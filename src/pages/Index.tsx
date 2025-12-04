import { useState } from "react";
import { GameIntro } from "@/components/quiz/GameIntro";
import { QuizGame } from "@/components/quiz/QuizGame";
import { GameOver } from "@/components/quiz/GameOver";
import { QuizData } from "@/data/quizData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type GameState = 'intro' | 'playing' | 'finished';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [teamAName, setTeamAName] = useState("Team Alpha");
  const [teamBName, setTeamBName] = useState("Team Beta");
  const [finalScores, setFinalScores] = useState({ teamA: 0, teamB: 0 });
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleStart = async (teamA: string, teamB: string, topic: string) => {
    setTeamAName(teamA);
    setTeamBName(teamB);
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-quiz', {
        body: { topic }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setQuizData(data as QuizData);
      setGameState('playing');
      
      toast({
        title: "Quiz Generated!",
        description: `50 unique questions about "${topic}" are ready!`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate quiz";
      setError(message);
      toast({
        title: "Generation Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameOver = (teamAScore: number, teamBScore: number) => {
    setFinalScores({ teamA: teamAScore, teamB: teamBScore });
    setGameState('finished');
  };

  const handleRestart = () => {
    setGameState('intro');
    setQuizData(null);
    setFinalScores({ teamA: 0, teamB: 0 });
  };

  return (
    <>
      {gameState === 'intro' && (
        <GameIntro 
          onStart={handleStart} 
          isLoading={isLoading}
          error={error}
        />
      )}
      {gameState === 'playing' && quizData && (
        <QuizGame
          teamAName={teamAName}
          teamBName={teamBName}
          quizData={quizData}
          onGameOver={handleGameOver}
        />
      )}
      {gameState === 'finished' && (
        <GameOver
          teamAName={teamAName}
          teamBName={teamBName}
          teamAScore={finalScores.teamA}
          teamBScore={finalScores.teamB}
          onRestart={handleRestart}
        />
      )}
    </>
  );
};

export default Index;
