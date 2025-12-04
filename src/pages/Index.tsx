import { useState } from "react";
import { GameIntro } from "@/components/quiz/GameIntro";
import { QuizGame } from "@/components/quiz/QuizGame";
import { GameOver } from "@/components/quiz/GameOver";

type GameState = 'intro' | 'playing' | 'finished';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [teamAName, setTeamAName] = useState("Team Alpha");
  const [teamBName, setTeamBName] = useState("Team Beta");
  const [finalScores, setFinalScores] = useState({ teamA: 0, teamB: 0 });

  const handleStart = (nameA: string, nameB: string) => {
    setTeamAName(nameA);
    setTeamBName(nameB);
    setGameState('playing');
  };

  const handleGameOver = (teamAScore: number, teamBScore: number) => {
    setFinalScores({ teamA: teamAScore, teamB: teamBScore });
    setGameState('finished');
  };

  const handleRestart = () => {
    setGameState('intro');
    setFinalScores({ teamA: 0, teamB: 0 });
  };

  return (
    <>
      {gameState === 'intro' && <GameIntro onStart={handleStart} />}
      {gameState === 'playing' && (
        <QuizGame
          teamAName={teamAName}
          teamBName={teamBName}
          onGameOver={handleGameOver}
        />
      )}
      {gameState === 'finished' && (
        <GameOver
          teamAScore={finalScores.teamA}
          teamBScore={finalScores.teamB}
          teamAName={teamAName}
          teamBName={teamBName}
          onRestart={handleRestart}
        />
      )}
    </>
  );
};

export default Index;
