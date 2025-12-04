import { useState, useCallback } from "react";
import { quizData, Question } from "@/data/quizData";
import { ScoreBoard } from "./ScoreBoard";
import { Timer } from "./Timer";
import { QuestionGrid } from "./QuestionGrid";
import { QuestionDisplay } from "./QuestionDisplay";
import { RoundHeader } from "./RoundHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizGameProps {
  teamAName: string;
  teamBName: string;
  onGameOver: (teamAScore: number, teamBScore: number) => void;
}

type GamePhase = 'selecting' | 'answering' | 'passed' | 'result' | 'round-complete';

export function QuizGame({ teamAName, teamBName, onGameOver }: QuizGameProps) {
  const [currentRound, setCurrentRound] = useState(0);
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
  };

  const handleAnswer = (answer: string, isCorrect: boolean) => {
    setSelectedAnswer(answer);
    setTimerRunning(false);
    
    const isGamble = round.round_type === 'gamble';
    const isPass = gamePhase === 'passed';
    
    let points = 0;
    if (isCorrect) {
      if (isGamble) {
        points = isPass ? 150 : 250;
      } else {
        points = isPass ? 50 : 100;
      }
      setHostLine(getRandomLine(quizData.host_correct_lines));
    } else {
      if (isGamble) {
        points = -150;
        // Apply time penalty for wrong gamble answers
        if (!isPass) {
          setGamblePenalty(prev => ({
            ...prev,
            [currentTeam]: Math.min(prev[currentTeam] + 2, 10)
          }));
        }
      }
      if (!isPass && !isGamble) {
        setHostLine(getRandomLine(quizData.host_wrong_lines));
      }
    }

    // Update scores
    if (currentTeam === 'A') {
      setTeamAScore(prev => Math.max(0, prev + points));
    } else {
      setTeamBScore(prev => Math.max(0, prev + points));
    }

    // Handle pass logic for non-gamble rounds
    if (!isCorrect && !isPass && !isGamble) {
      setGamePhase('passed');
      setCurrentTeam(prev => prev === 'A' ? 'B' : 'A');
      setTimerRunning(true);
      setSelectedAnswer(null);
      return;
    }

    setGamePhase('result');
  };

  const handleTimeUp = useCallback(() => {
    setTimerRunning(false);
    
    if (gamePhase === 'answering') {
      const isGamble = round.round_type === 'gamble';
      
      if (isGamble) {
        // Gamble timeout = wrong answer
        if (currentTeam === 'A') {
          setTeamAScore(prev => Math.max(0, prev - 150));
        } else {
          setTeamBScore(prev => Math.max(0, prev - 150));
        }
        setGamePhase('result');
      } else {
        // Pass to opponent
        setHostLine(getRandomLine(quizData.host_wrong_lines));
        setGamePhase('passed');
        setCurrentTeam(prev => prev === 'A' ? 'B' : 'A');
        setTimerRunning(true);
      }
    } else if (gamePhase === 'passed') {
      setGamePhase('result');
    }
  }, [gamePhase, round.round_type, currentTeam]);

  const nextQuestion = () => {
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setHostLine("");
    
    // Alternate hosting team
    setCurrentTeam(prev => prev === 'A' ? 'B' : 'A');

    if (questionsSelectedThisRound >= maxQuestionsPerRound) {
      setGamePhase('round-complete');
    } else {
      setGamePhase('selecting');
    }
  };

  const nextRound = () => {
    if (currentRound >= quizData.rounds.length - 1) {
      onGameOver(teamAScore, teamBScore);
      return;
    }
    
    setCurrentRound(prev => prev + 1);
    setQuestionsSelectedThisRound(0);
    setGamePhase('selecting');
    setGamblePenalty({ A: 0, B: 0 });
  };

  const getTimerSeconds = () => {
    if (!currentQuestion) return 30;
    
    const isGamble = round.round_type === 'gamble';
    const isPass = gamePhase === 'passed';
    
    if (isPass) return currentQuestion.time_limit_pass;
    
    if (isGamble) {
      const penalty = gamblePenalty[currentTeam];
      return Math.max(10, currentQuestion.time_limit_host - penalty);
    }
    
    return currentQuestion.time_limit_host;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="font-display text-2xl font-bold text-gradient">
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
        <main className="relative">
          {/* Selection Phase */}
          {gamePhase === 'selecting' && (
            <div className="text-center">
              <p className="text-lg text-muted-foreground mb-6">
                <span className={cn(
                  "font-bold",
                  currentTeam === 'A' ? "text-teamA" : "text-teamB"
                )}>
                  {currentTeam === 'A' ? teamAName : teamBName}
                </span>
                , select a question number
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

          {/* Answering Phase */}
          {(gamePhase === 'answering' || gamePhase === 'passed') && currentQuestion && (
            <div className="space-y-8">
              <div className="flex justify-center">
                <Timer
                  seconds={getTimerSeconds()}
                  isRunning={timerRunning}
                  onTimeUp={handleTimeUp}
                />
              </div>
              
              <p className="text-center text-lg">
                <span className={cn(
                  "font-bold",
                  currentTeam === 'A' ? "text-teamA" : "text-teamB"
                )}>
                  {currentTeam === 'A' ? teamAName : teamBName}
                </span>
                {gamePhase === 'passed' ? " — Steal opportunity!" : " is answering..."}
              </p>
              
              <QuestionDisplay
                question={currentQuestion}
                onAnswer={handleAnswer}
                isPassedQuestion={gamePhase === 'passed'}
                showResult={false}
                selectedAnswer={selectedAnswer}
              />
            </div>
          )}

          {/* Result Phase */}
          {gamePhase === 'result' && currentQuestion && (
            <div className="space-y-8">
              {hostLine && (
                <div className="text-center p-4 bg-card rounded-xl">
                  <p className="text-xl font-medium text-foreground italic">
                    "{hostLine}"
                  </p>
                </div>
              )}
              
              <QuestionDisplay
                question={currentQuestion}
                onAnswer={handleAnswer}
                isPassedQuestion={false}
                showResult={true}
                selectedAnswer={selectedAnswer}
              />
              
              <div className="flex justify-center">
                <Button
                  onClick={nextQuestion}
                  size="lg"
                  className="font-display font-bold px-8"
                >
                  {questionsSelectedThisRound >= maxQuestionsPerRound ? "Complete Round" : "Next Question"}
                </Button>
              </div>
            </div>
          )}

          {/* Round Complete */}
          {gamePhase === 'round-complete' && (
            <div className="text-center space-y-8 py-12">
              <div className="text-6xl animate-float">🎊</div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                Round {currentRound + 1} Complete!
              </h2>
              <p className="text-xl text-muted-foreground">
                {currentRound < quizData.rounds.length - 1 
                  ? `Get ready for ${quizData.rounds[currentRound + 1].round_name}!`
                  : "Final scores are in!"}
              </p>
              
              <div className="flex justify-center gap-8">
                <div className="bg-card rounded-xl p-6 min-w-[140px]">
                  <p className="text-teamA font-display font-bold text-lg">{teamAName}</p>
                  <p className="font-display text-4xl font-black text-foreground">{teamAScore}</p>
                </div>
                <div className="bg-card rounded-xl p-6 min-w-[140px]">
                  <p className="text-teamB font-display font-bold text-lg">{teamBName}</p>
                  <p className="font-display text-4xl font-black text-foreground">{teamBScore}</p>
                </div>
              </div>
              
              <Button
                onClick={nextRound}
                size="lg"
                className={cn(
                  "font-display font-bold text-xl px-12 py-6",
                  currentRound < quizData.rounds.length - 1 
                    ? "bg-gradient-to-r from-primary to-secondary" 
                    : "bg-gradient-to-r from-gamble to-destructive"
                )}
              >
                {currentRound < quizData.rounds.length - 1 ? "🚀 Next Round" : "🏆 See Results"}
              </Button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-xs text-muted-foreground opacity-50">
            {quizData.creator_taglines[0]}
          </p>
        </footer>
      </div>
    </div>
  );
}
