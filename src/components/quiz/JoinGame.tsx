import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft } from "lucide-react";

interface JoinGameProps {
  onJoin: (roomCode: string) => Promise<boolean>;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
  initialCode?: string;
}

export function JoinGame({ onJoin, onBack, isLoading, error, initialCode = "" }: JoinGameProps) {
  const [roomCode, setRoomCode] = useState(initialCode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.length >= 4) {
      await onJoin(roomCode);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto w-full">
        <Button
          variant="ghost"
          onClick={onBack}
          className="absolute top-4 left-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="bg-card/80 backdrop-blur rounded-xl p-6 border border-border/50 space-y-6">
          <h2 className="font-display text-2xl font-bold text-gradient">
            Join Game
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Enter Room Code
              </label>
              <Input
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="ABCD"
                className="text-center text-2xl font-display tracking-widest uppercase"
                maxLength={6}
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && (
              <div className="p-2 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || roomCode.length < 4}
              className="w-full bg-gradient-to-r from-primary to-secondary font-display font-bold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                "🎮 Join Game"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
