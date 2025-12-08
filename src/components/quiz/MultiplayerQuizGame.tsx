import { useState, useCallback, useEffect } from "react";
import { Question, QuizData } from "@/data/quizData";
import { ScoreBoard } from "./ScoreBoard";
import { Timer } from "./Timer";
import { QuestionGrid } from "./QuestionGrid";
import { QuestionDisplay } from "./QuestionDisplay";
import { RoundHeader } from "./RoundHeader";
import { AnswerFlash } from "./AnswerFlash";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { Volume2, VolumeX, Wifi, Crown } from "lucide-react";
import { GameSession } from "@/hooks/useMultiplayerGame";

interface MultiplayerQuizGameProps {
  session: GameSession;
  isHost: boolean;
  teamAName: string;
  teamBName: string;
  onUpdateState: (updates: Partial<GameSession>) => void;
  onGameOver: (teamAScore: number, teamBScore: number) => void;
}

type GamePhase = 'spinning' | 'selecting' | 'answering' | 'passed' | 'mass' | 'flash' | 'result' | 'round-complete';

export function MultiplayerQuizGame({ 
  session, 
  isHost, 
  teamAName, 
  teamBName, 
  onUpdateState, 
  onGameOver 
}: MultiplayerQuizGameProps) {
  const quizData = session.questions;
  
  // Use session state for synced data
  const currentRound = session.current_round;
  const teamAScore = session.team_a_score;
  const teamBScore = session.team_b_score;
  const currentTeam = session.current_team as 'A' | 'B';
  const selectedQuestions = session.selected_questions || [];
  const roundsCompleted = session.rounds_completed || [];
  
  // Local UI state
  const [gamePhase, setGamePhase] = useState<GamePhase>(session.game_phase as GamePhase || 'spinning');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gamblePenalty, setGamblePenalty] = useState({ A: 0, B: 0 });
  const [hostLine, setHostLine] = useState("");
  const [hostingTeam, setHostingTeam] = useState<'A' | 'B'>('A');
  const [flashResult, setFlashResult] = useState<boolean | null>(null);
  const [musicOn, setMusicOn] = useState(true);
  const [questionsSelectedThisRound, setQuestionsSelectedThisRound] = useState(0);
  
  const { playSound, startBgMusic, stopBgMusic, toggleBgMusic } = useSoundEffects();
  
  useEffect(() => {
    startBgMusic();
    return () => stopBgMusic();
  }, [startBgMusic, stopBgMusic]);

  // Sync phase from session
  useEffect(() => {
    if (session.game_phase) {
      setGamePhase(session.game_phase as GamePhase);
    }
  }, [session.game_phase]);

  const round = quizData.rounds[currentRound];
  const maxQuestionsPerRound = 6;

  const getRandomLine = (lines: string[]) => lines[Math.floor(Math.random() * lines.length)];

  const selectQuestion = (questionNum: number) => {
    if (!isHost) return;
    
    const question = round.questions.find(q => q.question_number === questionNum);
    if (!question) return;

    playSound('select');
    setCurrentQuestion(question);
    setQuestionsSelectedThisRound(prev => prev + 1);
    setGamePhase('answering');
    setTimerRunning(true);
    setSelectedAnswer(null);
    setHostingTeam(currentTeam);

    onUpdateState({
      current_question: questionNum,
      selected_questions: [...selectedQuestions, questionNum],
      game_phase: 'answering'
    });
  };

  const handlePass = () => {
    if (!isHost) return;
    
    playSound('pass');
    setTimerRunning(false);
    setGamePhase('passed');
    const newTeam = currentTeam === 'A' ? 'B' : 'A';
    setTimerRunning(true);
    setSelectedAnswer(null);

    onUpdateState({
      current_team: newTeam,
      game_phase: 'passed',
      is_passed: true
    });
  };

  const handleAnswer = (answer: string, isCorrect: boolean) => {
    if (!isHost) return;
    
    setSelectedAnswer(answer);
    setTimerRunning(false);
    
    const isGamble = round.round_type === 'gamble';
    const isPass = gamePhase === 'passed';
    const isMass = gamePhase === 'mass';
    
    let points = 0;
    let newTeamAScore = teamAScore;
    let newTeamBScore = teamBScore;
    
    if (isCorrect) {
      if (isMass) {
        points = 0;
      } else if (isGamble) {
        points = isPass ? 150 : 250;
      } else {
        points = isPass ? 50 : 100;
      }
      setHostLine(getRandomLine(quizData.host_correct_lines));
    } else {
      if (isGamble) {
        points = -150;
        if (!isPass && !isMass) {
          setGamblePenalty(prev => ({
            ...prev,
            [currentTeam]: Math.min(prev[currentTeam] + 2, 10)
          }));
        }
      }
      
      if (!isPass && !isMass && !isGamble) {
        setHostLine(getRandomLine(quizData.host_wrong_lines));
        setFlashResult(false);
        setGamePhase('flash');
        onUpdateState({ game_phase: 'flash', flash_result: 'false' });
        return;
      }
      
      if (isPass && !isMass && !isGamble) {
        setHostLine("Both teams missed! Let's ask the audience!");
        setFlashResult(false);
        setGamePhase('flash');
        onUpdateState({ game_phase: 'flash', flash_result: 'false' });
        return;
      }
    }

    if (!isMass) {
      if (currentTeam === 'A') {
        newTeamAScore = Math.max(0, teamAScore + points);
      } else {
        newTeamBScore = Math.max(0, teamBScore + points);
      }
    }

    playSound(isCorrect ? 'correct' : 'wrong');
    setFlashResult(isCorrect);
    setGamePhase('flash');
    
    onUpdateState({
      team_a_score: newTeamAScore,
      team_b_score: newTeamBScore,
      game_phase: 'flash',
      flash_result: isCorrect ? 'true' : 'false'
    });
  };

  const handleFlashComplete = () => {
    if (!isHost) return;
    
    const wasPassPhase = hostLine.includes("Both teams missed");
    
    if (flashResult === false && !wasPassPhase && !round.round_type.includes('gamble')) {
      const newTeam = currentTeam === 'A' ? 'B' : 'A';
      setGamePhase('passed');
      setTimerRunning(true);
      setSelectedAnswer(null);
      setFlashResult(null);
      onUpdateState({ 
        current_team: newTeam, 
        game_phase: 'passed',
        is_passed: true 
      });
    } else if (wasPassPhase) {
      setGamePhase('mass');
      setTimerRunning(true);
      setSelectedAnswer(null);
      setFlashResult(null);
      onUpdateState({ game_phase: 'mass' });
    } else {
      setFlashResult(null);
      setGamePhase('result');
      onUpdateState({ game_phase: 'result', show_explanation: true });
    }
  };

  const handleTimeUp = useCallback(() => {
    if (!isHost) return;
    
    setTimerRunning(false);
    
    if (gamePhase === 'answering') {
      const isGamble = round.round_type === 'gamble';
      
      if (isGamble) {
        const newScore = currentTeam === 'A' 
          ? Math.max(0, teamAScore - 150)
          : Math.max(0, teamBScore - 150);
        
        if (currentTeam === 'A') {
          onUpdateState({ team_a_score: newScore });
        } else {
          onUpdateState({ team_b_score: newScore });
        }
        setFlashResult(false);
        setGamePhase('flash');
        onUpdateState({ game_phase: 'flash', flash_result: 'false' });
      } else {
        setHostLine(getRandomLine(quizData.host_wrong_lines));
        setFlashResult(false);
        setGamePhase('flash');
        onUpdateState({ game_phase: 'flash', flash_result: 'false' });
      }
    } else if (gamePhase === 'passed') {
      setHostLine("Time's up for both teams! Audience, it's your turn!");
      setFlashResult(false);
      setGamePhase('flash');
      onUpdateState({ game_phase: 'flash', flash_result: 'false' });
    } else if (gamePhase === 'mass') {
      setFlashResult(null);
      setGamePhase('result');
      onUpdateState({ game_phase: 'result', show_explanation: true });
    }
  }, [gamePhase, round.round_type, currentTeam, quizData.host_wrong_lines, isHost, teamAScore, teamBScore, onUpdateState]);

  const nextQuestion = () => {
    if (!isHost) return;
    
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setHostLine("");
    const newTeam = hostingTeam === 'A' ? 'B' : 'A';

    if (questionsSelectedThisRound >= maxQuestionsPerRound) {
      playSound('roundComplete');
      setGamePhase('round-complete');
      onUpdateState({
        current_team: newTeam,
        game_phase: 'round-complete',
        rounds_completed: [...roundsCompleted, currentRound],
        show_explanation: false
      });
    } else {
      setGamePhase('selecting');
      onUpdateState({
        current_team: newTeam,
        game_phase: 'selecting',
        show_explanation: false,
        is_passed: false
      });
    }
  };

  const selectRound = (roundIndex: number) => {
    if (!isHost) return;
    
    setQuestionsSelectedThisRound(0);
    setGamePhase('selecting');
    setGamblePenalty({ A: 0, B: 0 });
    
    onUpdateState({
      current_round: roundIndex,
      game_phase: 'selecting',
      selected_questions: []
    });
  };

  const handleMusicToggle = () => {
    toggleBgMusic();
    setMusicOn(!musicOn);
  };

  const availableRounds = quizData.rounds.map((_, i) => i).filter(i => !roundsCompleted.includes(i));

  return (
    <div className="h-screen bg-background p-3 md:p-4 flex flex-col overflow-hidden">
      {/* Flash Effect */}
      {gamePhase === 'flash' && (
        <AnswerFlash isCorrect={flashResult} onComplete={handleFlashComplete} />
      )}

      <div className="max-w-5xl mx-auto w-full flex flex-col h-full">
        {/* Header */}
        <header className="mb-2 flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-lg font-bold text-gradient truncate">
                {quizData.game_title}
              </h1>
              <div className="flex items-center gap-1">
                <Wifi className="h-3 w-3 text-green-500" />
                {isHost && <Crown className="h-3 w-3 text-gamble" />}
              </div>
              <button
                onClick={handleMusicToggle}
                className="p-1.5 rounded-full hover:bg-muted/50 transition-colors"
                aria-label="Toggle music"
              >
                {musicOn ? (
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
            <ScoreBoard
              teamAScore={teamAScore}
              teamBScore={teamBScore}
              currentTeam={currentTeam}
              teamAName={teamAName}
              teamBName={teamBName}
            />
          </div>
          {!isHost && (
            <p className="text-xs text-center text-muted-foreground mt-1">
              Host is controlling the game
            </p>
          )}
        </header>

        {/* Round Header */}
        <RoundHeader
          roundNumber={currentRound + 1}
          roundName={round.round_name}
          roundType={round.round_type}
          rulesSummary={round.rules_summary}
          questionsSelected={questionsSelectedThisRound}
          maxQuestions={maxQuestionsPerRound}
        />

        {/* Main Content */}
        <main className="flex-1 min-h-0 overflow-auto py-2">
          {/* Selection Phase */}
          {gamePhase === 'selecting' && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                <span className={cn("font-bold", currentTeam === 'A' ? "text-teamA" : "text-teamB")}>
                  {currentTeam === 'A' ? teamAName : teamBName}
                </span>
                {isHost ? ", select a question" : " is selecting..."}
              </p>
              <QuestionGrid
                questions={round.question_grid}
                usedQuestions={selectedQuestions}
                selectedCount={questionsSelectedThisRound}
                maxSelections={maxQuestionsPerRound}
                onSelect={isHost ? selectQuestion : () => {}}
                roundType={round.round_type}
              />
            </div>
          )}

          {/* Answering/Passed/Mass Phase */}
          {(gamePhase === 'answering' || gamePhase === 'passed' || gamePhase === 'mass') && session.current_question && (
            <div className="space-y-3">
              <div className="flex justify-center">
                <Timer 
                  seconds={gamePhase === 'mass' ? 10 : gamePhase === 'passed' ? 30 : 45 - (round.round_type === 'gamble' ? gamblePenalty[currentTeam] : 0)} 
                  isRunning={timerRunning && isHost} 
                  onTimeUp={handleTimeUp} 
                />
              </div>
              
              <p className="text-center text-sm">
                {gamePhase === 'mass' ? (
                  <span className="font-bold text-primary animate-pulse">🎤 AUDIENCE — Answer now!</span>
                ) : gamePhase === 'passed' ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary font-bold animate-pulse">
                      ➡️ Passed to {currentTeam === 'A' ? teamAName : teamBName}
                    </span>
                  </span>
                ) : (
                  <span className={cn("font-bold", currentTeam === 'A' ? "text-teamA" : "text-teamB")}>
                    {currentTeam === 'A' ? teamAName : teamBName}
                  </span>
                )}
              </p>
              
              {currentQuestion && (
                <QuestionDisplay
                  question={currentQuestion}
                  onAnswer={isHost ? handleAnswer : () => {}}
                  onPass={isHost ? handlePass : undefined}
                  isPassedQuestion={gamePhase === 'passed'}
                  isMassQuestion={gamePhase === 'mass'}
                  showResult={false}
                  selectedAnswer={selectedAnswer}
                  canPass={gamePhase === 'answering' && isHost}
                />
              )}
            </div>
          )}

          {/* Result Phase */}
          {gamePhase === 'result' && currentQuestion && (
            <div className="space-y-3">
              {hostLine && (
                <div className="text-center p-2 bg-card rounded-lg">
                  <p className="text-sm font-medium text-foreground italic">"{hostLine}"</p>
                </div>
              )}
              
              <QuestionDisplay
                question={currentQuestion}
                onAnswer={() => {}}
                isPassedQuestion={false}
                showResult={true}
                selectedAnswer={selectedAnswer}
              />
              
              {isHost && (
                <div className="flex justify-center pt-2">
                  <Button onClick={nextQuestion} size="sm" className="font-display font-bold px-6">
                    {questionsSelectedThisRound >= maxQuestionsPerRound ? "Complete Round" : "Next"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Round Complete */}
          {gamePhase === 'round-complete' && (
            <div className="text-center space-y-4 py-4">
              <h2 className="font-display text-xl font-bold text-foreground">
                Round Complete! 🎊
              </h2>
              
              <div className="flex justify-center gap-4">
                <div className="bg-card rounded-lg p-3 min-w-[80px]">
                  <p className="text-teamA font-display font-bold text-xs">{teamAName}</p>
                  <p className="font-display text-xl font-black text-foreground">{teamAScore}</p>
                </div>
                <div className="bg-card rounded-lg p-3 min-w-[80px]">
                  <p className="text-teamB font-display font-bold text-xs">{teamBName}</p>
                  <p className="font-display text-xl font-black text-foreground">{teamBScore}</p>
                </div>
              </div>

              {availableRounds.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    {isHost ? "Choose your next round:" : "Waiting for host to choose..."}
                  </p>
                  {isHost && (
                    <div className="flex flex-wrap justify-center gap-2">
                      {availableRounds.map((roundIndex) => (
                        <Button
                          key={roundIndex}
                          onClick={() => selectRound(roundIndex)}
                          variant="outline"
                          size="sm"
                          className={cn(
                            "font-display",
                            quizData.rounds[roundIndex].round_type === 'gamble' && "border-gamble text-gamble",
                            quizData.rounds[roundIndex].round_type === 'special' && "border-secondary text-secondary"
                          )}
                        >
                          {quizData.rounds[roundIndex].round_name}
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                isHost && (
                  <Button
                    onClick={() => onGameOver(teamAScore, teamBScore)}
                    className="font-display font-bold px-8 bg-gradient-to-r from-gamble to-destructive"
                  >
                    🏆 See Results
                  </Button>
                )
              )}
            </div>
          )}
        </main>

        <footer className="text-center flex-shrink-0 py-1">
          <p className="text-xs text-muted-foreground opacity-50">{quizData.creator_taglines[0]}</p>
        </footer>
      </div>
    </div>
  );
}
