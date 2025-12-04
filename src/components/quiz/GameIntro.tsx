import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { quizData } from "@/data/quizData";

interface GameIntroProps {
  onStart: (teamAName: string, teamBName: string) => void;
}

export function GameIntro({ onStart }: GameIntroProps) {
  const [teamAName, setTeamAName] = useState("Team Alpha");
  const [teamBName, setTeamBName] = useState("Team Beta");
  const [showNameInput, setShowNameInput] = useState(false);

  const randomIntro = quizData.intro_lines[Math.floor(Math.random() * quizData.intro_lines.length)];
  const randomTagline = quizData.creator_taglines[Math.floor(Math.random() * quizData.creator_taglines.length)];

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

        {/* Team Names Input */}
        {showNameInput ? (
          <div className="bg-card/80 backdrop-blur rounded-2xl p-8 mb-8 border border-border/50 space-y-6">
            <h3 className="font-display text-xl font-bold text-foreground">Enter Team Names</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-teamA mb-2">Team A</label>
                <Input
                  value={teamAName}
                  onChange={(e) => setTeamAName(e.target.value)}
                  className="bg-background border-teamA/30 focus:border-teamA text-center font-medium"
                  placeholder="Team Alpha"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-teamB mb-2">Team B</label>
                <Input
                  value={teamBName}
                  onChange={(e) => setTeamBName(e.target.value)}
                  className="bg-background border-teamB/30 focus:border-teamB text-center font-medium"
                  placeholder="Team Beta"
                />
              </div>
            </div>

            <Button
              onClick={() => onStart(teamAName || "Team Alpha", teamBName || "Team Beta")}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-display font-bold text-lg py-6"
            >
              🚀 START THE BATTLE
            </Button>
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
