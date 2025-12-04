import { cn } from "@/lib/utils";

interface ScoreBoardProps {
  teamAScore: number;
  teamBScore: number;
  currentTeam: 'A' | 'B';
  teamAName?: string;
  teamBName?: string;
}

export function ScoreBoard({ 
  teamAScore, 
  teamBScore, 
  currentTeam,
  teamAName = "Team A",
  teamBName = "Team B"
}: ScoreBoardProps) {
  return (
    <div className="flex justify-center gap-8 items-center">
      {/* Team A */}
      <div className={cn(
        "flex flex-col items-center p-6 rounded-2xl transition-all duration-500 min-w-[160px]",
        currentTeam === 'A' ? "bg-teamA/20 glow-primary scale-105" : "bg-card/50"
      )}>
        <div className={cn(
          "w-4 h-4 rounded-full mb-2",
          currentTeam === 'A' ? "bg-teamA animate-pulse" : "bg-muted"
        )} />
        <h3 className={cn(
          "font-display text-lg font-bold mb-1",
          currentTeam === 'A' ? "text-teamA" : "text-muted-foreground"
        )}>
          {teamAName}
        </h3>
        <p className={cn(
          "font-display text-4xl font-black",
          currentTeam === 'A' ? "text-teamA" : "text-foreground"
        )}>
          {teamAScore}
        </p>
      </div>

      {/* VS Divider */}
      <div className="flex flex-col items-center">
        <span className="font-display text-2xl font-bold text-muted-foreground">VS</span>
      </div>

      {/* Team B */}
      <div className={cn(
        "flex flex-col items-center p-6 rounded-2xl transition-all duration-500 min-w-[160px]",
        currentTeam === 'B' ? "bg-teamB/20 glow-secondary scale-105" : "bg-card/50"
      )}>
        <div className={cn(
          "w-4 h-4 rounded-full mb-2",
          currentTeam === 'B' ? "bg-teamB animate-pulse" : "bg-muted"
        )} />
        <h3 className={cn(
          "font-display text-lg font-bold mb-1",
          currentTeam === 'B' ? "text-teamB" : "text-muted-foreground"
        )}>
          {teamBName}
        </h3>
        <p className={cn(
          "font-display text-4xl font-black",
          currentTeam === 'B' ? "text-teamB" : "text-foreground"
        )}>
          {teamBScore}
        </p>
      </div>
    </div>
  );
}
