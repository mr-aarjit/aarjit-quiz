import { useState, useCallback } from "react";
import { Question, QuizData } from "@/data/quizData";
import { ScoreBoard } from "./ScoreBoard";
import { Timer } from "./Timer";
import { QuestionGrid } from "./QuestionGrid";
import { QuestionDisplay } from "./QuestionDisplay";
import { RoundHeader } from "./RoundHeader";
import { AnswerFlash } from "./AnswerFlash";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizGameProps {
  teamAName: string;
  teamBName: string;
  quizData: QuizData;
  startingRound: number;
  onGameOver: (teamAScore: number, teamBScore: number) => void;
}

type GamePhase = 'selecting' | 'answering' | 'passed' | 'mass' | 'flash' | 'result' | 'round-complete';

export function QuizGame({ teamAName, teamBName, quizData, startingRound, onGameOver }: QuizGameProps) {
  const [currentRound, setCurrentRound] = useState(startingRound);
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [currentTeam, setCurrentTeam] = useState<'A' | 'B'>('A');
  const [usedQuestions, setUsedQuestions] = useState<{ [key: number]: number[] }>({});
  const [questionsSelectedThisRound, setQuestionsSelectedThisRound] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>('selecting');
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gamblePenalty, setGamblePenalty] = useState({ A: 0, B: 0 });
  const [hostLine, setHostLine] = useState("");
  const [hostingTeam, setHostingTeam] = useState<'A' | 'B'>('A');
  const [flashResult, setFlashResult] = useState<boolean | null>(null);
  const [completedRounds, setCompletedRounds] = useState<number[]>([]);

  const round = quizData.rounds[currentRound];
  const maxQuestionsPerRound = 6;

  const getRandomLine = (lines: string[]) => lines[Math.floor(Math.random() * lines.length)];

  const selectQuestion = (questionNum: number) => {
    const question = round.questions.find(q => q.question_number === questionNum);
    if (!question) return;

    setCurrentQuestion(question);
    setUsedQuestions(prev => ({
      ...prev,
      [currentRound]: [...(prev[currentRound] || []), questionNum]
    }));
    setQuestionsSelectedThisRound(prev => prev + 1);
    setGamePhase('answering');
    setTimerRunning(true);
    setSelectedAnswer(null);
    setHostingTeam(currentTeam);
  };

  const handlePass = () => {
    setTimerRunning(false);
    setHostLine(getRandomLine(quizData.host_wrong_lines));
    setGamePhase('passed');
    setCurrentTeam(prev => prev === 'A' ? 'B' : 'A');
    setTimerRunning(true);
    setSelectedAnswer(null);
  };

  const handleAnswer = (answer: string, isCorrect: boolean) => {
    setSelectedAnswer(answer);
    setTimerRunning(false);
    
    const isGamble = round.round_type === 'gamble';
    const isPass = gamePhase === 'passed';
    const isMass = gamePhase === 'mass';
    
    let points = 0;
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
        return;
      }
      
      if (isPass && !isMass && !isGamble) {
        setHostLine("Both teams missed! Let's ask the audience!");
        setFlashResult(false);
        setGamePhase('flash');
        return;
      }
    }

    if (!isMass) {
      if (currentTeam === 'A') {
        setTeamAScore(prev => Math.max(0, prev + points));
      } else {
        setTeamBScore(prev => Math.max(0, prev + points));
      }
    }

    setFlashResult(isCorrect);
    setGamePhase('flash');
  };

  const handleFlashComplete = () => {
    const isPass = selectedAnswer !== null && gamePhase === 'flash' && flashResult === false;
    const wasPassPhase = hostLine.includes("Both teams missed");
    
    if (flashResult === false && !wasPassPhase && !round.round_type.includes('gamble')) {
      setGamePhase('passed');
      setCurrentTeam(prev => prev === 'A' ? 'B' : 'A');
      setTimerRunning(true);
      setSelectedAnswer(null);
      setFlashResult(null);
    } else if (wasPassPhase) {
      setGamePhase('mass');
      setTimerRunning(true);
      setSelectedAnswer(null);
      setFlashResult(null);
    } else {
      setFlashResult(null);
      setGamePhase('result');
    }
  };

  const handleTimeUp = useCallback(() => {
    setTimerRunning(false);
    
    if (gamePhase === 'answering') {
      const isGamble = round.round_type === 'gamble';
      
      if (isGamble) {
        if (currentTeam === 'A') {
          setTeamAScore(prev => Math.max(0, prev - 150));
        } else {
          setTeamBScore(prev => Math.max(0, prev - 150));
        }
        setFlashResult(false);
        setGamePhase('flash');
      } else {
        setHostLine(getRandomLine(quizData.host_wrong_lines));
        setFlashResult(false);
        setGamePhase('flash');
      }
    } else if (gamePhase === 'passed') {
      setHostLine("Time's up for both teams! Audience, it's your turn!");
      setFlashResult(false);
      setGamePhase('flash');
    } else if (gamePhase === 'mass') {
      setFlashResult(null);
      setGamePhase('result');
    }
  }, [gamePhase, round.round_type, currentTeam, quizData.host_wrong_lines]);

  const nextQuestion = () => {
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setHostLine("");
    setCurrentTeam(hostingTeam === 'A' ? 'B' : 'A');

    if (questionsSelectedThisRound >= maxQuestionsPerRound) {
      setCompletedRounds(prev => [...prev, currentRound]);
      setGamePhase('round-complete');
    } else {
      setGamePhase('selecting');
    }
  };

  const selectRound = (roundIndex: number) => {
    setCurrentRound(roundIndex);
    setQuestionsSelectedThisRound(0);
    setGamePhase('selecting');
    setGamblePenalty({ A: 0, B: 0 });
  };

  const nextRound = () => {
    const availableRounds = quizData.rounds.map((_, i) => i).filter(i => !completedRounds.includes(i));
    
    if (availableRounds.length === 0) {
      onGameOver(teamAScore, teamBScore);
      return;
    }
    
    setGamePhase('round-complete');
  };

  const availableRounds = quizData.rounds.map((_, i) => i).filter(i => !completedRounds.includes(i));

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
            <h1 className="font-display text-lg font-bold text-gradient truncate">
              {quizData.game_title}
            </h1>
            <ScoreBoard
              teamAScore={teamAScore}
              teamBScore={teamBScore}
              currentTeam={currentTeam}
              teamAName={teamAName}
              teamBName={teamBName}
            />
          </div>
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
                , select a question
              </p>
              <QuestionGrid
                questions={round.question_grid}
                usedQuestions={usedQuestions[currentRound] || []}
                selectedCount={questionsSelectedThisRound}
                maxSelections={maxQuestionsPerRound}
                onSelect={selectQuestion}
                roundType={round.round_type}
              />
            </div>
          )}

          {/* Answering/Passed/Mass Phase */}
          {(gamePhase === 'answering' || gamePhase === 'passed' || gamePhase === 'mass') && currentQuestion && (
            <div className="space-y-3">
              <div className="flex justify-center">
                <Timer seconds={gamePhase === 'mass' ? 10 : gamePhase === 'passed' ? currentQuestion.time_limit_pass : currentQuestion.time_limit_host - (round.round_type === 'gamble' ? gamblePenalty[currentTeam] : 0)} isRunning={timerRunning} onTimeUp={handleTimeUp} />
              </div>
              
              <p className="text-center text-sm">
                {gamePhase === 'mass' ? (
                  <span className="font-bold text-primary animate-pulse">🎤 AUDIENCE — Answer now!</span>
                ) : (
                  <>
                    <span className={cn("font-bold", currentTeam === 'A' ? "text-teamA" : "text-teamB")}>
                      {currentTeam === 'A' ? teamAName : teamBName}
                    </span>
                    {gamePhase === 'passed' ? " — Steal!" : ""}
                  </>
                )}
              </p>
              
              <QuestionDisplay
                question={currentQuestion}
                onAnswer={handleAnswer}
                onPass={handlePass}
                isPassedQuestion={gamePhase === 'passed'}
                isMassQuestion={gamePhase === 'mass'}
                showResult={false}
                selectedAnswer={selectedAnswer}
                canPass={gamePhase === 'answering' && round.round_type !== 'gamble'}
              />
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
                onAnswer={handleAnswer}
                isPassedQuestion={false}
                showResult={true}
                selectedAnswer={selectedAnswer}
              />
              
              <div className="flex justify-center pt-2">
                <Button onClick={nextQuestion} size="sm" className="font-display font-bold px-6">
                  {questionsSelectedThisRound >= maxQuestionsPerRound ? "Complete Round" : "Next"}
                </Button>
              </div>
            </div>
          )}

          {/* Round Complete - Choose Next Round */}
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
                  <p className="text-sm text-muted-foreground">Choose your next round:</p>
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
                </>
              ) : (
                <Button
                  onClick={() => onGameOver(teamAScore, teamBScore)}
                  className="font-display font-bold px-8 bg-gradient-to-r from-gamble to-destructive"
                >
                  🏆 See Results
                </Button>
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