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
    <div className="flex items-center gap-3">
      <div className={cn(
        "flex items-center gap-2 px-3 py-1 rounded-lg transition-all",
        currentTeam === 'A' ? "bg-teamA/20" : "bg-card/50"
      )}>
        <span className={cn("font-display text-sm font-bold", currentTeam === 'A' ? "text-teamA" : "text-muted-foreground")}>
          {teamAName}
        </span>
        <span className={cn("font-display text-lg font-black", currentTeam === 'A' ? "text-teamA" : "text-foreground")}>
          {teamAScore}
        </span>
      </div>
      <span className="text-xs text-muted-foreground">vs</span>
      <div className={cn(
        "flex items-center gap-2 px-3 py-1 rounded-lg transition-all",
        currentTeam === 'B' ? "bg-teamB/20" : "bg-card/50"
      )}>
        <span className={cn("font-display text-sm font-bold", currentTeam === 'B' ? "text-teamB" : "text-muted-foreground")}>
          {teamBName}
        </span>
        <span className={cn("font-display text-lg font-black", currentTeam === 'B' ? "text-teamB" : "text-foreground")}>
          {teamBScore}
        </span>
      </div>
    </div>
  );
}
