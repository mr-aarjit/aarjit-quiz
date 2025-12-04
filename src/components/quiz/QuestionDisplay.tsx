import { useState } from "react";
import { Question } from "@/data/quizData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuestionDisplayProps {
  question: Question;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  isPassedQuestion: boolean;
  showResult: boolean;
  selectedAnswer: string | null;
}

export function QuestionDisplay({
  question,
  onAnswer,
  isPassedQuestion,
  showResult,
  selectedAnswer
}: QuestionDisplayProps) {
  const handleSelect = (option: string) => {
    if (showResult) return;
    const isCorrect = option === question.answer;
    onAnswer(option, isCorrect);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Question */}
      <div className="bg-card rounded-2xl p-8 border border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
            question.difficulty === 'easy' && "bg-success/20 text-success",
            question.difficulty === 'medium' && "bg-gamble/20 text-gamble",
            question.difficulty === 'hard' && "bg-destructive/20 text-destructive"
          )}>
            {question.difficulty}
          </span>
          {isPassedQuestion && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-secondary/20 text-secondary">
              Passed Question
            </span>
          )}
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectAnswer = option === question.answer;
          const showCorrect = showResult && isCorrectAnswer;
          const showWrong = showResult && isSelected && !isCorrectAnswer;

          return (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              disabled={showResult}
              className={cn(
                "p-6 rounded-xl text-left font-medium text-lg transition-all duration-300 border-2",
                !showResult && "bg-card hover:bg-card/80 hover:border-primary hover:scale-[1.02] border-border/50",
                showCorrect && "bg-success/20 border-success text-success",
                showWrong && "bg-destructive/20 border-destructive text-destructive animate-shake",
                isSelected && !showResult && "border-primary bg-primary/10"
              )}
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50 text-sm font-bold mr-4">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {/* Result Display */}
      {showResult && (
        <div className={cn(
          "rounded-2xl p-6 space-y-4",
          selectedAnswer === question.answer ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"
        )}>
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-3xl",
              selectedAnswer === question.answer ? "animate-float" : ""
            )}>
              {selectedAnswer === question.answer ? "🎉" : "😔"}
            </span>
            <h3 className={cn(
              "font-display text-xl font-bold",
              selectedAnswer === question.answer ? "text-success" : "text-destructive"
            )}>
              {selectedAnswer === question.answer ? "Correct!" : "Incorrect!"}
            </h3>
          </div>
          
          <p className="text-foreground/80">
            <strong>Answer:</strong> {question.answer}
          </p>
          
          <p className="text-muted-foreground">
            {question.explanation}
          </p>
          
          <div className="pt-4 border-t border-border/30">
            <p className="text-sm text-primary flex items-center gap-2">
              <span>💡</span>
              <span className="font-medium">Cool Fact:</span> {question.cool_fact}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
