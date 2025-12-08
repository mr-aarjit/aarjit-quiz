-- Create game sessions table
CREATE TABLE public.game_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    room_code TEXT NOT NULL UNIQUE,
    host_id TEXT NOT NULL,
    player_id TEXT,
    topic TEXT NOT NULL,
    questions JSONB NOT NULL,
    current_round INTEGER DEFAULT 1,
    current_question INTEGER,
    team_a_score INTEGER DEFAULT 0,
    team_b_score INTEGER DEFAULT 0,
    current_team TEXT DEFAULT 'A',
    game_phase TEXT DEFAULT 'waiting',
    selected_questions JSONB DEFAULT '[]',
    rounds_completed JSONB DEFAULT '[]',
    is_passed BOOLEAN DEFAULT false,
    show_explanation BOOLEAN DEFAULT false,
    flash_result TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read game sessions (for joining)
CREATE POLICY "Anyone can view game sessions" 
ON public.game_sessions 
FOR SELECT 
USING (true);

-- Allow anyone to create game sessions
CREATE POLICY "Anyone can create game sessions" 
ON public.game_sessions 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update game sessions (for gameplay)
CREATE POLICY "Anyone can update game sessions" 
ON public.game_sessions 
FOR UPDATE 
USING (true);

-- Allow anyone to delete game sessions
CREATE POLICY "Anyone can delete game sessions" 
ON public.game_sessions 
FOR DELETE 
USING (true);

-- Enable realtime for game sessions
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_sessions;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_game_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_game_sessions_updated_at
BEFORE UPDATE ON public.game_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_game_session_timestamp();