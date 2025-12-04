import { Button } from "@/components/ui/button";
import { quizData } from "@/data/quizData";
import { cn } from "@/lib/utils";

interface GameOverProps {
  teamAScore: number;
  teamBScore: number;
  teamAName: string;
  teamBName: string;
  onRestart: () => void;
}

export function GameOver({ teamAScore, teamBScore, teamAName, teamBName, onRestart }: GameOverProps) {
  const winner = teamAScore > teamBScore ? 'A' : teamBScore > teamAScore ? 'B' : 'tie';
  const winnerName = winner === 'A' ? teamAName : winner === 'B' ? teamBName : 'Both Teams';
  const winnerScore = winner === 'A' ? teamAScore : winner === 'B' ? teamBScore : teamAScore;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Celebration effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gamble/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Trophy */}
        <div className="text-8xl mb-6 animate-float">🏆</div>

        {/* Winner Announcement */}
        <h1 className="font-display text-4xl md:text-6xl font-black mb-4">
          {winner === 'tie' ? (
            <span className="text-gamble">IT'S A TIE!</span>
          ) : (
            <>
              <span className={cn(
                winner === 'A' ? "text-teamA" : "text-teamB"
              )}>
                {winnerName}
              </span>
              <span className="text-foreground"> WINS!</span>
            </>
          )}
        </h1>

        <p className="text-xl text-muted-foreground mb-12">
          {winner === 'tie' 
            ? "An incredible match! Both teams proved their brilliance!"
            : `With an amazing score of ${winnerScore} points!`}
        </p>

        {/* Final Scores */}
        <div className="flex justify-center gap-8 mb-12">
          <div className={cn(
            "bg-card/80 backdrop-blur rounded-2xl p-8 border-2 min-w-[180px]",
            winner === 'A' ? "border-teamA glow-primary" : "border-border/50"
          )}>
            {winner === 'A' && <div className="text-3xl mb-2">👑</div>}
            <h3 className="font-display text-lg font-bold text-teamA mb-2">{teamAName}</h3>
            <p className="font-display text-5xl font-black text-foreground">{teamAScore}</p>
          </div>

          <div className={cn(
            "bg-card/80 backdrop-blur rounded-2xl p-8 border-2 min-w-[180px]",
            winner === 'B' ? "border-teamB glow-secondary" : "border-border/50"
          )}>
            {winner === 'B' && <div className="text-3xl mb-2">👑</div>}
            <h3 className="font-display text-lg font-bold text-teamB mb-2">{teamBName}</h3>
            <p className="font-display text-5xl font-black text-foreground">{teamBScore}</p>
          </div>
        </div>

        {/* Message */}
        <p className="text-lg text-foreground/70 mb-8">
          {quizData.ending_message}
        </p>

        {/* Restart Button */}
        <Button
          onClick={onRestart}
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-display font-bold text-xl px-12 py-6 rounded-2xl"
        >
          🔄 PLAY AGAIN
        </Button>

        {/* Creator Credit */}
        <p className="text-sm text-muted-foreground mt-12 opacity-70">
          {quizData.creator_taglines[Math.floor(Math.random() * quizData.creator_taglines.length)]}
        </p>
      </div>
    </div>
  );
}
