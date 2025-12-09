-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can create game sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Anyone can delete game sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Anyone can update game sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Anyone can view game sessions" ON public.game_sessions;

-- Create proper RLS policies using authenticated user IDs
-- SELECT: Participants can view games they're in
CREATE POLICY "Participants can view their games"
ON public.game_sessions
FOR SELECT
TO authenticated
USING (
  host_id = auth.uid()::text 
  OR player_id = auth.uid()::text
  OR player_id IS NULL  -- Allow viewing open games for joining
);

-- INSERT: Authenticated users can create games as host
CREATE POLICY "Authenticated users can create games"
ON public.game_sessions
FOR INSERT
TO authenticated
WITH CHECK (host_id = auth.uid()::text);

-- UPDATE: Host can update their games, or player can join open games
CREATE POLICY "Host can update games"
ON public.game_sessions
FOR UPDATE
TO authenticated
USING (
  host_id = auth.uid()::text 
  OR (player_id IS NULL AND host_id != auth.uid()::text)  -- Allow joining
  OR player_id = auth.uid()::text  -- Player can leave
);

-- DELETE: Only host can delete their games
CREATE POLICY "Host can delete games"
ON public.game_sessions
FOR DELETE
TO authenticated
USING (host_id = auth.uid()::text);