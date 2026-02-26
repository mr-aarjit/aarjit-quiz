import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Zap, Users } from "lucide-react";
import { Leaderboard } from "./Leaderboard";

interface GameIntroProps {
  onStart: (teamNames: string[], topic: string) => void;
  onStartPrepared: (teamNames: string[]) => void;
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
  const [numTeams, setNumTeams] = useState(2);
  const [teamNames, setTeamNames] = useState<string[]>(["Team Alpha", "Team Beta"]);
  const [topic, setTopic] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [showTeamPicker, setShowTeamPicker] = useState(false);

  const randomIntro = defaultIntroLines[Math.floor(Math.random() * defaultIntroLines.length)];
  const randomTagline = defaultTaglines[Math.floor(Math.random() * defaultTaglines.length)];

  const defaultNames = ["Team Alpha", "Team Beta", "Team Gamma", "Team Delta", "Team Epsilon", "Team Zeta"];

  const handleTeamCountChange = (count: number) => {
    setNumTeams(count);
    const names = Array.from({ length: count }, (_, i) => teamNames[i] || defaultNames[i] || `Team ${i + 1}`);
    setTeamNames(names);
    setShowTeamPicker(false);
  };

  const updateTeamName = (index: number, name: string) => {
    setTeamNames(prev => {
      const updated = [...prev];
      updated[index] = name;
      return updated;
    });
  };

  const handleStartCustom = () => {
    if (!topic.trim()) return;
    onStart(teamNames.map((n, i) => n || defaultNames[i] || `Team ${i + 1}`), topic.trim());
  };

  const handleStartPrepared = () => {
    onStartPrepared(teamNames.map((n, i) => n || defaultNames[i] || `Team ${i + 1}`));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center max-w-xl mx-auto w-full">
        <div className="mb-4">
          <h1 className="font-display text-4xl md:text-5xl font-black text-gradient mb-2 animate-float">
            ULTIMATE QUIZ
          </h1>
          <p className="text-base md:text-lg text-foreground/80 font-medium">{randomIntro}</p>
        </div>

        {/* Team count selector */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTeamPicker(!showTeamPicker)}
              className="gap-2 font-display"
            >
              <Users className="h-4 w-4" />
              {numTeams} Teams
            </Button>
            {showTeamPicker && (
              <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg p-2 flex gap-1 z-20 shadow-lg">
                {[2, 3, 4, 5, 6].map(n => (
                  <Button
                    key={n}
                    size="sm"
                    variant={numTeams === n ? "default" : "ghost"}
                    className="font-display w-8 h-8 p-0"
                    onClick={() => handleTeamCountChange(n)}
                  >
                    {n}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Game Info */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-card/50 backdrop-blur rounded-lg p-2 border border-border/50">
            <p className="font-display text-xl font-bold text-primary">5</p>
            <p className="text-xs text-muted-foreground">Rounds</p>
          </div>
          <div className="bg-card/50 backdrop-blur rounded-lg p-2 border border-border/50">
            <p className="font-display text-xl font-bold text-secondary">50</p>
            <p className="text-xs text-muted-foreground">Questions</p>
          </div>
          <div className="bg-card/50 backdrop-blur rounded-lg p-2 border border-border/50">
            <p className="font-display text-xl font-bold text-gamble">{numTeams}</p>
            <p className="text-xs text-muted-foreground">Teams</p>
          </div>
        </div>

        {showNameInput ? (
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 mb-4 border border-border/50 space-y-3">
            <h3 className="font-display text-lg font-bold text-foreground">Setup Your Quiz</h3>
            
            {/* Team Names */}
            <div className="grid grid-cols-2 gap-2">
              {teamNames.map((name, i) => (
                <div key={i}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Team {i + 1}</label>
                  <Input
                    value={name}
                    onChange={(e) => updateTeamName(i, e.target.value)}
                    className="bg-background text-center text-sm"
                    placeholder={defaultNames[i]}
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>

            {/* Quick Start */}
            <div className="pt-2 border-t border-border/30">
              <Button onClick={handleStartPrepared} disabled={isLoading} variant="outline" className="w-full gap-2 font-display font-bold">
                <Zap className="h-4 w-4 text-gamble" />
                Quick Start: Computer & Tech Trends
              </Button>
              <p className="text-xs text-muted-foreground mt-1">Instant start with pre-made questions</p>
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
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-display font-bold text-lg px-8 py-6 rounded-xl glow-primary mb-4"
          >
            🎮 BEGIN QUIZ
          </Button>
        )}

        {/* Leaderboard */}
        <div className="mt-4">
          <Leaderboard />
        </div>

        <p className="text-xs text-muted-foreground mt-4 opacity-70">{randomTagline}</p>
      </div>
    </div>
  );
}