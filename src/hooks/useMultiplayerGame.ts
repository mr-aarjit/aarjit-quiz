import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { QuizData } from '@/data/quizData';
import { preparedQuizData } from '@/data/preparedQuizData';
import { useToast } from '@/hooks/use-toast';

export interface GameSession {
  id: string;
  room_code: string;
  host_id: string;
  player_id: string | null;
  topic: string;
  questions: QuizData;
  current_round: number;
  current_question: number | null;
  team_a_score: number;
  team_b_score: number;
  current_team: string;
  game_phase: string;
  selected_questions: number[];
  rounds_completed: number[];
  is_passed: boolean;
  show_explanation: boolean;
  flash_result: string | null;
}

const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
};

const generatePlayerId = () => {
  return Math.random().toString(36).substring(2, 12);
};

export function useMultiplayerGame() {
  const [session, setSession] = useState<GameSession | null>(null);
  const [playerId] = useState(() => {
    const stored = localStorage.getItem('quiz_player_id');
    if (stored) return stored;
    const newId = generatePlayerId();
    localStorage.setItem('quiz_player_id', newId);
    return newId;
  });
  const [isHost, setIsHost] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Subscribe to real-time updates
  useEffect(() => {
    if (!session?.id) return;

    console.log('Subscribing to session:', session.id);
    
    const channel = supabase
      .channel(`game-${session.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${session.id}`
        },
        (payload) => {
          console.log('Received update:', payload);
          const newData = payload.new as any;
          setSession({
            ...newData,
            questions: newData.questions as QuizData,
            selected_questions: newData.selected_questions as number[],
            rounds_completed: newData.rounds_completed as number[]
          });
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
        }
      });

    return () => {
      console.log('Unsubscribing from session');
      supabase.removeChannel(channel);
    };
  }, [session?.id]);

  // Create a new game session
  const createGame = useCallback(async (
    teamAName: string, 
    teamBName: string, 
    topic: string,
    usePrepared: boolean = false
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      let quizData: QuizData;
      
      if (usePrepared) {
        quizData = preparedQuizData;
      } else {
        const { data, error: fnError } = await supabase.functions.invoke('generate-quiz', {
          body: { topic }
        });
        
        if (fnError) throw new Error(fnError.message);
        if (data.error) throw new Error(data.error);
        quizData = data as QuizData;
      }

      const roomCode = generateRoomCode();

      const { data: sessionData, error: dbError } = await supabase
        .from('game_sessions')
        .insert({
          room_code: roomCode,
          host_id: playerId,
          topic: usePrepared ? 'Computer & Tech Trends' : topic,
          questions: quizData as any,
          game_phase: 'waiting'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      const newSession: GameSession = {
        ...sessionData,
        questions: sessionData.questions as unknown as QuizData,
        selected_questions: sessionData.selected_questions as number[],
        rounds_completed: sessionData.rounds_completed as number[]
      };

      setSession(newSession);
      setIsHost(true);
      
      toast({
        title: "Game Created!",
        description: `Room Code: ${roomCode}`
      });

      return { roomCode, shareUrl: `${window.location.origin}?room=${roomCode}` };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create game";
      setError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [playerId, toast]);

  // Join an existing game
  const joinGame = useCallback(async (roomCode: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: sessionData, error: fetchError } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('room_code', roomCode.toUpperCase())
        .single();

      if (fetchError || !sessionData) {
        throw new Error('Game not found. Check the room code.');
      }

      if (sessionData.player_id && sessionData.player_id !== playerId && sessionData.host_id !== playerId) {
        throw new Error('Game is full.');
      }

      // If we're the host, just reconnect
      if (sessionData.host_id === playerId) {
        setSession({
          ...sessionData,
          questions: sessionData.questions as unknown as QuizData,
          selected_questions: sessionData.selected_questions as number[],
          rounds_completed: sessionData.rounds_completed as number[]
        });
        setIsHost(true);
        return true;
      }

      // Join as player
      const { data: updatedSession, error: updateError } = await supabase
        .from('game_sessions')
        .update({ player_id: playerId })
        .eq('id', sessionData.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setSession({
        ...updatedSession,
        questions: updatedSession.questions as unknown as QuizData,
        selected_questions: updatedSession.selected_questions as number[],
        rounds_completed: updatedSession.rounds_completed as number[]
      });
      setIsHost(false);
      
      toast({ title: "Joined!", description: "You joined as Player 2 (Team B)" });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to join game";
      setError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [playerId, toast]);

  // Update game state (host only)
  const updateGameState = useCallback(async (updates: Partial<GameSession>) => {
    if (!session?.id || !isHost) return;

    const dbUpdates: any = { ...updates };
    if (updates.questions) dbUpdates.questions = updates.questions;
    if (updates.selected_questions) dbUpdates.selected_questions = updates.selected_questions;
    if (updates.rounds_completed) dbUpdates.rounds_completed = updates.rounds_completed;

    const { error } = await supabase
      .from('game_sessions')
      .update(dbUpdates)
      .eq('id', session.id);

    if (error) {
      console.error('Failed to update game state:', error);
    }
  }, [session?.id, isHost]);

  // Leave game
  const leaveGame = useCallback(async () => {
    if (session?.id) {
      if (isHost) {
        await supabase.from('game_sessions').delete().eq('id', session.id);
      } else {
        await supabase
          .from('game_sessions')
          .update({ player_id: null })
          .eq('id', session.id);
      }
    }
    setSession(null);
    setIsHost(false);
    setIsConnected(false);
  }, [session?.id, isHost]);

  return {
    session,
    playerId,
    isHost,
    isConnected,
    isLoading,
    error,
    createGame,
    joinGame,
    updateGameState,
    leaveGame,
    hasOpponent: !!session?.player_id
  };
}
