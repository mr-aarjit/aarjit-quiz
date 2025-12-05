import { Question } from "@/data/quizData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SkipForward } from "lucide-react";

interface QuestionDisplayProps {
  question: Question;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  onPass?: () => void;
  isPassedQuestion: boolean;
  isMassQuestion?: boolean;
  showResult: boolean;
  selectedAnswer: string | null;
  canPass?: boolean;
}

export function QuestionDisplay({
  question,
  onAnswer,
  onPass,
  isPassedQuestion,
  isMassQuestion = false,
  showResult,
  selectedAnswer,
  canPass = false
}: QuestionDisplayProps) {
  const handleSelect = (option: string) => {
    if (showResult) return;
    const isCorrect = option === question.answer;
    onAnswer(option, isCorrect);
  };

  const isCorrectAnswer = selectedAnswer === question.answer;

  return (
    <div className="space-y-3 max-w-4xl mx-auto">
      {/* Question - Compact */}
      <div className="bg-card rounded-xl p-4 border border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-semibold uppercase",
            question.difficulty === 'easy' && "bg-success/20 text-success",
            question.difficulty === 'medium' && "bg-gamble/20 text-gamble",
            question.difficulty === 'hard' && "bg-destructive/20 text-destructive"
          )}>
            {question.difficulty}
          </span>
          {isPassedQuestion && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold uppercase bg-secondary/20 text-secondary">
              Steal!
            </span>
          )}
          {isMassQuestion && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold uppercase bg-primary/20 text-primary animate-pulse">
              🎤 AUDIENCE ROUND
            </span>
          )}
        </div>
        
        <h2 className="text-lg md:text-xl font-bold text-foreground leading-snug">
          {question.question}
        </h2>
      </div>

      {/* Options - Compact Grid */}
      <div className="grid grid-cols-2 gap-2">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === question.answer;
          const showCorrect = showResult && isCorrect;
          const showWrong = showResult && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              disabled={showResult}
              className={cn(
                "p-3 rounded-lg text-left font-medium text-sm transition-all duration-200 border-2",
                !showResult && "bg-card hover:bg-card/80 hover:border-primary hover:scale-[1.01] border-border/50",
                showCorrect && "bg-success/20 border-success text-success",
                showWrong && "bg-destructive/20 border-destructive text-destructive",
                isSelected && !showResult && "border-primary bg-primary/10"
              )}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-muted/50 text-xs font-bold mr-2">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {/* Pass Button */}
      {canPass && !showResult && (
        <div className="flex justify-center pt-2">
          <Button
            onClick={onPass}
            variant="outline"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <SkipForward className="h-4 w-4" />
            Pass Question
          </Button>
        </div>
      )}

      {/* Result Display - Compact Combined */}
      {showResult && (
        <div className={cn(
          "rounded-xl p-4 space-y-2",
          isCorrectAnswer ? "bg-success/10 border border-success/30" : "bg-muted/30 border border-border/30"
        )}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {isCorrectAnswer ? "🎉" : "💡"}
            </span>
            <h3 className={cn(
              "font-display text-base font-bold",
              isCorrectAnswer ? "text-success" : "text-foreground"
            )}>
              {isCorrectAnswer ? "Brilliant!" : "The Answer Was:"}
            </h3>
            {!isCorrectAnswer && (
              <span className="font-bold text-primary">{question.answer}</span>
            )}
          </div>
          
          {/* Combined explanation and cool fact */}
          <p className="text-sm text-muted-foreground">
            {question.explanation} <span className="text-primary">💡 {question.cool_fact}</span>
          </p>
        </div>
      )}
    </div>
  );
}