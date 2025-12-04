import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface GameIntroProps {
  onStart: (teamAName: string, teamBName: string, topic: string) => void;
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

export function GameIntro({ onStart, isLoading = false, error = null }: GameIntroProps) {
  const [teamAName, setTeamAName] = useState("Team Alpha");
  const [teamBName, setTeamBName] = useState("Team Beta");
  const [topic, setTopic] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  const randomIntro = defaultIntroLines[Math.floor(Math.random() * defaultIntroLines.length)];
  const randomTagline = defaultTaglines[Math.floor(Math.random() * defaultTaglines.length)];

  const handleStart = () => {
    if (!topic.trim()) return;
    onStart(teamAName || "Team Alpha", teamBName || "Team Beta", topic.trim());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Logo/Title */}
        <div className="mb-8">
          <h1 className="font-display text-5xl md:text-7xl font-black text-gradient mb-4 animate-float">
            ULTIMATE QUIZ
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 font-medium">
            {randomIntro}
          </p>
        </div>

        {/* Game Info */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-card/50 backdrop-blur rounded-xl p-4 border border-border/50">
            <p className="font-display text-3xl font-bold text-primary">5</p>
            <p className="text-sm text-muted-foreground">Rounds</p>
          </div>
          <div className="bg-card/50 backdrop-blur rounded-xl p-4 border border-border/50">
            <p className="font-display text-3xl font-bold text-secondary">50</p>
            <p className="text-sm text-muted-foreground">Questions</p>
          </div>
          <div className="bg-card/50 backdrop-blur rounded-xl p-4 border border-border/50">
            <p className="font-display text-3xl font-bold text-gamble">2</p>
            <p className="text-sm text-muted-foreground">Teams</p>
          </div>
        </div>

        {/* Topic & Team Names Input */}
        {showNameInput ? (
          <div className="bg-card/80 backdrop-blur rounded-2xl p-8 mb-8 border border-border/50 space-y-6">
            <h3 className="font-display text-xl font-bold text-foreground">Setup Your Quiz</h3>
            
            {/* Topic Input */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Quiz Topic *</label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-background border-primary/30 focus:border-primary text-center font-medium"
                placeholder="e.g., Space Science, Indian History, Sports..."
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                AI will generate unique questions based on your topic
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-teamA mb-2">Team A</label>
                <Input
                  value={teamAName}
                  onChange={(e) => setTeamAName(e.target.value)}
                  className="bg-background border-teamA/30 focus:border-teamA text-center font-medium"
                  placeholder="Team Alpha"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-teamB mb-2">Team B</label>
                <Input
                  value={teamBName}
                  onChange={(e) => setTeamBName(e.target.value)}
                  className="bg-background border-teamB/30 focus:border-teamB text-center font-medium"
                  placeholder="Team Beta"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              onClick={handleStart}
              disabled={isLoading || !topic.trim()}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-display font-bold text-lg py-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                "🚀 GENERATE & START"
              )}
            </Button>

            {isLoading && (
              <p className="text-sm text-muted-foreground animate-pulse">
                AI is crafting 50 unique questions for you... This may take a moment.
              </p>
            )}
          </div>
        ) : (
          <Button
            onClick={() => setShowNameInput(true)}
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-display font-bold text-xl px-12 py-8 rounded-2xl glow-primary"
          >
            🎮 BEGIN QUIZ
          </Button>
        )}

        {/* Creator Credit */}
        <p className="text-sm text-muted-foreground mt-8 opacity-70">
          {randomTagline}
        </p>
      </div>
    </div>
  );
}
