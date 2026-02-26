import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { quizData } from "@/data/quizData";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface GameOverProps {
  teamNames: string[];
  scores: number[];
  topic: string;
  onRestart: () => void;
}

export function GameOver({ teamNames, scores, topic, onRestart }: GameOverProps) {
  const [saved, setSaved] = useState(false);

  const maxScore = Math.max(...scores);
  const winners = scores.reduce<number[]>((acc, s, i) => (s === maxScore ? [...acc, i] : acc), []);
  const isTie = winners.length > 1;
  const winnerName = isTie ? "It's a Tie!" : teamNames[winners[0]];

  useEffect(() => {
    const saveScores = async () => {
      const inserts = teamNames.map((name, i) => ({
        team_name: name,
        score: scores[i],
        topic,
        num_teams: teamNames.length,
      }));
      await supabase.from("leaderboard").insert(inserts);
      setSaved(true);
    };
    saveScores();
  }, [teamNames, scores, topic]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gamble/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div className="text-8xl mb-6 animate-float">🏆</div>

        <h1 className="font-display text-4xl md:text-6xl font-black mb-4">
          {isTie ? (
            <span className="text-gamble">IT'S A TIE!</span>
          ) : (
            <>
              <span className="text-primary">{winnerName}</span>
              <span className="text-foreground"> WINS!</span>
            </>
          )}
        </h1>

        <p className="text-xl text-muted-foreground mb-8">
          {isTie ? "An incredible match!" : `With an amazing score of ${maxScore} points!`}
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {teamNames.map((name, i) => (
            <div key={i} className={cn(
              "bg-card/80 backdrop-blur rounded-2xl p-6 border-2 min-w-[140px]",
              winners.includes(i) ? "border-primary glow-primary" : "border-border/50"
            )}>
              {winners.includes(i) && !isTie && <div className="text-3xl mb-2">👑</div>}
              <h3 className="font-display text-sm font-bold text-muted-foreground mb-1">{name}</h3>
              <p className="font-display text-4xl font-black text-foreground">{scores[i]}</p>
            </div>
          ))}
        </div>

        {saved && (
          <p className="text-xs text-muted-foreground mb-4">✅ Scores saved to leaderboard!</p>
        )}

        <p className="text-lg text-foreground/70 mb-8">{quizData.ending_message}</p>

        <Button
          onClick={onRestart}
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-display font-bold text-xl px-12 py-6 rounded-2xl"
        >
          🔄 PLAY AGAIN
        </Button>

        <p className="text-sm text-muted-foreground mt-8 opacity-70">
          {quizData.creator_taglines[Math.floor(Math.random() * quizData.creator_taglines.length)]}
        </p>
      </div>
    </div>
  );
}
