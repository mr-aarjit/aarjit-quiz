import { useState } from "react";
import { GameIntro } from "@/components/quiz/GameIntro";
import { SpinWheel } from "@/components/quiz/SpinWheel";
import { QuizGame } from "@/components/quiz/QuizGame";
import { GameOver } from "@/components/quiz/GameOver";
import { QuizData } from "@/data/quizData";
import { preparedQuizData } from "@/data/preparedQuizData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type GameState = 'intro' | 'spinning' | 'playing' | 'finished';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [teamNames, setTeamNames] = useState<string[]>(["Team Alpha", "Team Beta"]);
  const [finalScores, setFinalScores] = useState<number[]>([0, 0]);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [startingRound, setStartingRound] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState("General");
  const { toast } = useToast();

  const handleStartPrepared = (names: string[]) => {
    setTeamNames(names);
    setQuizData(preparedQuizData);
    setTopic("Computer & Tech Trends");
    setGameState('spinning');
  };

  const handleStart = async (names: string[], topicInput: string) => {
    setTeamNames(names);
    setTopic(topicInput);
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-quiz', {
        body: { topic: topicInput }
      });

      if (fnError) throw new Error(fnError.message);
      if (data.error) throw new Error(data.error);

      setQuizData(data as QuizData);
      setGameState('spinning');
      toast({ title: "Quiz Ready!", description: `50 questions generated!` });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate quiz";
      setError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpinComplete = (selectedIndex: number) => {
    setStartingRound(selectedIndex);
    setGameState('playing');
  };

  const handleGameOver = (teamAScore: number, teamBScore: number) => {
    setFinalScores([teamAScore, teamBScore]);
    setGameState('finished');
  };

  const handleRestart = () => {
    setGameState('intro');
    setQuizData(null);
    setFinalScores([0, 0]);
    setStartingRound(0);
  };

  return (
    <>
      {gameState === 'intro' && (
        <GameIntro 
          onStart={handleStart}
          onStartPrepared={handleStartPrepared}
          isLoading={isLoading}
          error={error}
        />
      )}
      {gameState === 'spinning' && quizData && (
        <SpinWheel
          rounds={quizData.rounds.map(r => r.round_name)}
          onSpinComplete={handleSpinComplete}
        />
      )}
      {gameState === 'playing' && quizData && (
        <QuizGame
          teamAName={teamNames[0]}
          teamBName={teamNames[1]}
          quizData={quizData}
          startingRound={startingRound}
          onGameOver={handleGameOver}
        />
      )}
      {gameState === 'finished' && (
        <GameOver
          teamNames={teamNames}
          scores={finalScores}
          topic={topic}
          onRestart={handleRestart}
        />
      )}
    </>
  );
};

export default Index;