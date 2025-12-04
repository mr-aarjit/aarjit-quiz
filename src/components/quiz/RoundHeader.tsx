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
      "rounded-2xl p-6 mb-8 border",
      roundType === 'normal' && "bg-primary/10 border-primary/30",
      roundType === 'gamble' && "bg-gamble/10 border-gamble/30",
      roundType === 'special' && "bg-secondary/10 border-secondary/30"
    )}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className={cn(
            "text-sm font-semibold uppercase tracking-wider mb-1",
            roundType === 'normal' && "text-primary",
            roundType === 'gamble' && "text-gamble",
            roundType === 'special' && "text-secondary"
          )}>
            Round {roundNumber}
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            {roundType === 'gamble' && <span className="animate-pulse">🔥</span>}
            {roundType === 'special' && <span className="animate-float">⭐</span>}
            {roundName}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            {rulesSummary}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={cn(
            "px-4 py-2 rounded-xl font-display font-bold",
            roundType === 'normal' && "bg-primary/20 text-primary",
            roundType === 'gamble' && "bg-gamble/20 text-gamble",
            roundType === 'special' && "bg-secondary/20 text-secondary"
          )}>
            {questionsSelected} / {maxQuestions}
          </div>
          <span className="text-sm text-muted-foreground">selected</span>
        </div>
      </div>
    </div>
  );
}
