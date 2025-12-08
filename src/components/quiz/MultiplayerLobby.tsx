import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Copy, Check, Users, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MultiplayerLobbyProps {
  roomCode: string;
  shareUrl: string;
  isHost: boolean;
  hasOpponent: boolean;
  isConnected: boolean;
  onStartGame: () => void;
  onLeave: () => void;
}

export function MultiplayerLobby({
  roomCode,
  shareUrl,
  isHost,
  hasOpponent,
  isConnected,
  onStartGame,
  onLeave
}: MultiplayerLobbyProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied!", description: `${type} copied to clipboard` });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto w-full">
        <div className="bg-card/80 backdrop-blur rounded-xl p-6 border border-border/50 space-y-6">
          {/* Connection Status */}
          <div className="flex items-center justify-center gap-2">
            {isConnected ? (
              <Wifi className="h-5 w-5 text-green-500 animate-pulse" />
            ) : (
              <WifiOff className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold text-gradient">
            {isHost ? "Waiting for Player 2" : "Waiting for Host"}
          </h2>

          {/* Room Code Display */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Share this code:</p>
            <div className="flex items-center gap-2 justify-center">
              <div className="bg-background px-6 py-3 rounded-lg border-2 border-primary">
                <span className="font-display text-3xl font-black tracking-widest text-primary">
                  {roomCode}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(roomCode, "Room code")}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Share Link */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Or share this link:</p>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="text-center text-xs"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(shareUrl, "Link")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Players Status */}
          <div className="flex justify-center gap-4">
            <div className={`p-3 rounded-lg border-2 ${isHost ? 'border-teamA bg-teamA/10' : 'border-muted'}`}>
              <Users className="h-6 w-6 mx-auto mb-1 text-teamA" />
              <p className="text-xs font-medium">Host (Team A)</p>
              <p className="text-xs text-green-500">✓ Ready</p>
            </div>
            <div className={`p-3 rounded-lg border-2 ${hasOpponent ? 'border-teamB bg-teamB/10' : 'border-dashed border-muted'}`}>
              <Users className="h-6 w-6 mx-auto mb-1 text-teamB" />
              <p className="text-xs font-medium">Player 2 (Team B)</p>
              <p className={`text-xs ${hasOpponent ? 'text-green-500' : 'text-muted-foreground'}`}>
                {hasOpponent ? '✓ Joined' : 'Waiting...'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {isHost && (
              <Button
                onClick={onStartGame}
                disabled={!hasOpponent}
                className="w-full bg-gradient-to-r from-primary to-secondary font-display font-bold"
              >
                {hasOpponent ? "🎮 Start Game" : "Waiting for opponent..."}
              </Button>
            )}
            {!isHost && (
              <div className="p-3 bg-secondary/10 rounded-lg">
                <p className="text-sm text-secondary">
                  Waiting for host to start the game...
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              onClick={onLeave}
              className="w-full text-muted-foreground"
            >
              Leave Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
