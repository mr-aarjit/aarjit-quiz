import { cn } from "@/lib/utils";

interface RoundHeaderProps {
  roundNumber: number;
  roundName: string;
  roundType: 'normal' | 'gamble' | 'special';
  rulesSummary: string;
  questionsSelected: number;
  maxQuestions: number;
}

export function RoundHeader({
  roundNumber,
  roundName,
  roundType,
  rulesSummary,
  questionsSelected,
  maxQuestions
}: RoundHeaderProps) {
  return (
    <div className={cn(
      "rounded-xl p-3 mb-2 border flex-shrink-0",
      roundType === 'normal' && "bg-primary/10 border-primary/30",
      roundType === 'gamble' && "bg-gamble/10 border-gamble/30",
      roundType === 'special' && "bg-secondary/10 border-secondary/30"
    )}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-xs font-semibold uppercase",
            roundType === 'normal' && "text-primary",
            roundType === 'gamble' && "text-gamble",
            roundType === 'special' && "text-secondary"
          )}>
            R{roundNumber}
          </span>
          <h2 className="font-display text-base font-bold text-foreground flex items-center gap-1">
            {roundType === 'gamble' && <span>🔥</span>}
            {roundType === 'special' && <span>⭐</span>}
            {roundName}
          </h2>
        </div>
        
        <div className={cn(
          "px-2 py-1 rounded-lg font-display text-sm font-bold",
          roundType === 'normal' && "bg-primary/20 text-primary",
          roundType === 'gamble' && "bg-gamble/20 text-gamble",
          roundType === 'special' && "bg-secondary/20 text-secondary"
        )}>
          {questionsSelected}/{maxQuestions}
        </div>
      </div>
    </div>
  );
}
