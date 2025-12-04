import { cn } from "@/lib/utils";

interface QuestionGridProps {
  questions: number[];
  usedQuestions: number[];
  selectedCount: number;
  maxSelections: number;
  onSelect: (questionNum: number) => void;
  roundType: 'normal' | 'gamble' | 'special';
}

export function QuestionGrid({
  questions,
  usedQuestions,
  selectedCount,
  maxSelections,
  onSelect,
  roundType
}: QuestionGridProps) {
  const canSelectMore = selectedCount < maxSelections;

  return (
    <div className="grid grid-cols-5 gap-4 max-w-lg mx-auto">
      {questions.map((num) => {
        const isUsed = usedQuestions.includes(num);
        const canSelect = !isUsed && canSelectMore;

        return (
          <button
            key={num}
            onClick={() => canSelect && onSelect(num)}
            disabled={!canSelect}
            className={cn(
              "aspect-square rounded-xl font-display text-2xl font-bold transition-all duration-300 relative overflow-hidden",
              isUsed && "bg-muted/50 text-muted-foreground cursor-not-allowed opacity-50",
              !isUsed && canSelect && roundType === 'normal' && "bg-card hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:glow-primary text-foreground border-2 border-primary/30",
              !isUsed && canSelect && roundType === 'gamble' && "bg-card hover:bg-gamble hover:text-background hover:scale-105 hover:glow-accent text-foreground border-2 border-gamble/30",
              !isUsed && canSelect && roundType === 'special' && "bg-card hover:bg-secondary hover:text-secondary-foreground hover:scale-105 hover:glow-secondary text-foreground border-2 border-secondary/30",
              !canSelect && !isUsed && "opacity-50 cursor-not-allowed"
            )}
          >
            {isUsed ? "✓" : num}
            {!isUsed && canSelect && (
              <span className="absolute inset-0 bg-gradient-to-br from-transparent to-foreground/5" />
            )}
          </button>
        );
      })}
    </div>
  );
}
