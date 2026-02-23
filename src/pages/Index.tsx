import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MultiplayerIntro } from "@/components/quiz/MultiplayerIntro";
import { JoinGame } from "@/components/quiz/JoinGame";
import { MultiplayerLobby } from "@/components/quiz/MultiplayerLobby";
import { SpinWheel } from "@/components/quiz/SpinWheel";
import { MultiplayerQuizGame } from "@/components/quiz/MultiplayerQuizGame";
import { GameOver } from "@/components/quiz/GameOver";
import { useMultiplayerGame } from "@/hooks/useMultiplayerGame";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

type GameState = 'intro' | 'joining' | 'lobby' | 'spinning' | 'playing' | 'finished';
type PlayMode = 'online' | 'local';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [teamAName, setTeamAName] = useState("Team Alpha");
  const [teamBName, setTeamBName] = useState("Team Beta");
  const [finalScores, setFinalScores] = useState({ teamA: 0, teamB: 0 });
  const [roomInfo, setRoomInfo] = useState<{ roomCode: string; shareUrl: string } | null>(null);
  const [initialRoomCode, setInitialRoomCode] = useState("");
  const [playMode, setPlayMode] = useState<PlayMode>('online');

  const { isAuthenticated, isLoading: authLoading, user, signOut } = useAuth();
  const navigate = useNavigate();

  const {
    session,
    isHost,
    isConnected,
    isLoading,
    error,
    createGame,
    joinGame,
    updateGameState,
    leaveGame,
    hasOpponent
  } = useMultiplayerGame();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Check URL for room code on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomCode = params.get('room');
    if (roomCode) {
      setInitialRoomCode(roomCode);
      setGameState('joining');
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Watch session for game start
  useEffect(() => {
    if (session && session.game_phase === 'spinning' && gameState === 'lobby') {
      setGameState('spinning');
    }
    if (session && session.game_phase === 'playing' && gameState !== 'playing') {
      setGameState('playing');
    }
  }, [session, gameState]);

  const handleCreateGame = async (teamA: string, teamB: string, topic: string, usePrepared: boolean) => {
    setTeamAName(teamA);
    setTeamBName(teamB);
    
    const result = await createGame(teamA, teamB, topic, usePrepared);
    if (result) {
      setRoomInfo(result);
      setGameState('lobby');
    }
  };

  const handleLocalPlay = async (teamA: string, teamB: string, topic: string, usePrepared: boolean) => {
    setTeamAName(teamA);
    setTeamBName(teamB);
    setPlayMode('local');
    
    const result = await createGame(teamA, teamB, topic, usePrepared);
    if (result) {
      setRoomInfo(result);
      // Skip lobby, go straight to spinning
      updateGameState({ game_phase: 'spinning' });
      setGameState('spinning');
    }
  };

  const handleJoinGame = async (roomCode: string) => {
    const success = await joinGame(roomCode);
    if (success) {
      setGameState('lobby');
    }
    return success;
  };

  const handleStartGame = () => {
    if (session) {
      updateGameState({ game_phase: 'spinning' });
      setGameState('spinning');
    }
  };

  const handleSpinComplete = (selectedIndex: number) => {
    if (session && (isHost || playMode === 'local')) {
      updateGameState({ 
        current_round: selectedIndex,
        game_phase: 'selecting'
      });
    }
    setGameState('playing');
  };

  const handleGameOver = (teamAScore: number, teamBScore: number) => {
    setFinalScores({ teamA: teamAScore, teamB: teamBScore });
    setGameState('finished');
  };

  const handleRestart = async () => {
    await leaveGame();
    setGameState('intro');
    setRoomInfo(null);
    setFinalScores({ teamA: 0, teamB: 0 });
    setPlayMode('online');
  };

  const handleLeave = async () => {
    await leaveGame();
    setGameState('intro');
    setRoomInfo(null);
  };

  // Loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/10">
        <div className="text-xl text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative">
      {/* User info header */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{user?.email}</span>
        <Button variant="outline" size="sm" onClick={signOut}>
          Sign Out
        </Button>
      </div>

      {gameState === 'intro' && (
        <MultiplayerIntro
          onCreateGame={handleCreateGame}
          onJoinGame={() => setGameState('joining')}
          onLocalPlay={handleLocalPlay}
          isLoading={isLoading}
          error={error}
        />
      )}

      {gameState === 'joining' && (
        <JoinGame
          onJoin={handleJoinGame}
          onBack={() => setGameState('intro')}
          isLoading={isLoading}
          error={error}
          initialCode={initialRoomCode}
        />
      )}

      {gameState === 'lobby' && session && roomInfo && (
        <MultiplayerLobby
          roomCode={roomInfo.roomCode}
          shareUrl={roomInfo.shareUrl}
          isHost={isHost}
          hasOpponent={hasOpponent}
          isConnected={isConnected}
          onStartGame={handleStartGame}
          onLeave={handleLeave}
        />
      )}

      {gameState === 'spinning' && session && (
        <SpinWheel
          rounds={session.questions.rounds.map(r => r.round_name)}
          onSpinComplete={handleSpinComplete}
        />
      )}

      {gameState === 'playing' && session && (
        <MultiplayerQuizGame
          session={session}
          isHost={playMode === 'local' ? true : isHost}
          teamAName={teamAName}
          teamBName={teamBName}
          onUpdateState={updateGameState}
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
    </div>
  );
};

export default Index;
