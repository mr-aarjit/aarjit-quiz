import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Zap } from "lucide-react";

interface GameIntroProps {
  onStart: (teamAName: string, teamBName: string, topic: string) => void;
  onStartPrepared: (teamAName: string, teamBName: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

const defaultIntroLines = [
  "Get ready, scholars — the battle of brilliance begins now!",
  "Two teams. Five rounds. One champion. Let the games begin!",
  "Only the sharpest minds will survive this challenge!",
  "Welcome to the arena of knowledge. May the best team win!",
  "Prepare your neurons — it's time to prove who's the smartest!"
];

const defaultTaglines = [
  "Designed by Aarjit — the Quiz Master of Class 8",
  "Powered by smart logic created by Aarjit",
  "Aarjit's Quiz Engine: Fair. Smart. Competitive.",
  "A masterpiece of quiz engineering by Aarjit"
];

export function GameIntro({ onStart, onStartPrepared, isLoading = false, error = null }: GameIntroProps) {
  const [teamAName, setTeamAName] = useState("Team Alpha");
  const [teamBName, setTeamBName] = useState("Team Beta");
  const [topic, setTopic] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  const randomIntro = defaultIntroLines[Math.floor(Math.random() * defaultIntroLines.length)];
  const randomTagline = defaultTaglines[Math.floor(Math.random() * defaultTaglines.length)];

  const handleStartCustom = () => {
    if (!topic.trim()) return;
    onStart(teamAName || "Team Alpha", teamBName || "Team Beta", topic.trim());
  };

  const handleStartPrepared = () => {
    onStartPrepared(teamAName || "Team Alpha", teamBName || "Team Beta");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center max-w-xl mx-auto w-full">
        {/* Logo/Title */}
        <div className="mb-6">
          <h1 className="font-display text-4xl md:text-5xl font-black text-gradient mb-2 animate-float">
            ULTIMATE QUIZ
          </h1>
          <p className="text-base md:text-lg text-foreground/80 font-medium">
            {randomIntro}
          </p>
        </div>

        {/* Game Info - Compact */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-card/50 backdrop-blur rounded-lg p-2 border border-border/50">
            <p className="font-display text-xl font-bold text-primary">5</p>
            <p className="text-xs text-muted-foreground">Rounds</p>
          </div>
          <div className="bg-card/50 backdrop-blur rounded-lg p-2 border border-border/50">
            <p className="font-display text-xl font-bold text-secondary">50</p>
            <p className="text-xs text-muted-foreground">Questions</p>
          </div>
          <div className="bg-card/50 backdrop-blur rounded-lg p-2 border border-border/50">
            <p className="font-display text-xl font-bold text-gamble">2</p>
            <p className="text-xs text-muted-foreground">Teams</p>
          </div>
        </div>

        {/* Topic & Team Names Input */}
        {showNameInput ? (
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 mb-4 border border-border/50 space-y-4">
            <h3 className="font-display text-lg font-bold text-foreground">Setup Your Quiz</h3>
            
            {/* Team Names */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-teamA mb-1">Team A</label>
                <Input
                  value={teamAName}
                  onChange={(e) => setTeamAName(e.target.value)}
                  className="bg-background border-teamA/30 focus:border-teamA text-center text-sm"
                  placeholder="Team Alpha"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-teamB mb-1">Team B</label>
                <Input
                  value={teamBName}
                  onChange={(e) => setTeamBName(e.target.value)}
                  className="bg-background border-teamB/30 focus:border-teamB text-center text-sm"
                  placeholder="Team Beta"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Quick Start - Prepared Quiz */}
            <div className="pt-2 border-t border-border/30">
              <Button
                onClick={handleStartPrepared}
                disabled={isLoading}
                variant="outline"
                className="w-full gap-2 font-display font-bold"
              >
                <Zap className="h-4 w-4 text-gamble" />
                Quick Start: Computer & Tech Trends
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                Instant start with pre-made questions
              </p>
            </div>

            {/* Custom Topic */}
            <div className="pt-2 border-t border-border/30">
              <label className="block text-xs font-medium text-primary mb-1">Or Enter Custom Topic</label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-background border-primary/30 focus:border-primary text-center text-sm"
                placeholder="e.g., Space, Geography, Sports..."
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-2 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}

            <Button
              onClick={handleStartCustom}
              disabled={isLoading || !topic.trim()}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-display font-bold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating (~30s)...
                </>
              ) : (
                "🚀 Generate Custom Quiz"
              )}
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setShowNameInput(true)}
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-display font-bold text-lg px-8 py-6 rounded-xl glow-primary"
          >
            🎮 BEGIN QUIZ
          </Button>
        )}

        {/* Creator Credit */}
        <p className="text-xs text-muted-foreground mt-4 opacity-70">
          {randomTagline}
        </p>
      </div>
    </div>
  );
}