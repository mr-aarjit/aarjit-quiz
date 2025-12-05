import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnswerFlashProps {
  isCorrect: boolean | null;
  onComplete: () => void;
}

export function AnswerFlash({ isCorrect, onComplete }: AnswerFlashProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (isCorrect === null) return;
    
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [isCorrect, onComplete]);

  if (isCorrect === null || !visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 pointer-events-none transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Radial glow from center */}
      <div
        className={cn(
          "absolute inset-0 animate-pulse",
          isCorrect
            ? "bg-gradient-radial from-success/40 via-success/20 to-transparent"
            : "bg-gradient-radial from-destructive/40 via-destructive/20 to-transparent"
        )}
      />
      
      {/* Edge glow */}
      <div
        className={cn(
          "absolute inset-0",
          isCorrect
            ? "shadow-[inset_0_0_100px_20px_rgba(34,197,94,0.5)]"
            : "shadow-[inset_0_0_100px_20px_rgba(239,68,68,0.5)]"
        )}
      />

      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={cn(
            "text-8xl animate-scale-in",
            isCorrect ? "drop-shadow-[0_0_30px_rgba(34,197,94,0.8)]" : "drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]"
          )}
        >
          {isCorrect ? "✓" : "✗"}
        </div>
      </div>
    </div>
  );
}