import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface TimerProps {
  seconds: number;
  isRunning: boolean;
  onTimeUp: () => void;
}

export function Timer({ seconds, isRunning, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const { playSound } = useSoundEffects();

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next === 10) playSound('timerWarning');
        if (next === 5) playSound('timerCritical');
        if (next <= 5 && next > 0) playSound('tick');
        if (next <= 0) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onTimeUp, playSound]);

  const percentage = (timeLeft / seconds) * 100;
  const isWarning = timeLeft <= 10 && timeLeft > 5;
  const isDanger = timeLeft <= 5;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
          <circle
            cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 58}`}
            strokeDashoffset={`${2 * Math.PI * 58 * (1 - percentage / 100)}`}
            strokeLinecap="round"
            className={cn(
              "transition-all duration-1000",
              isDanger && "text-timer-danger",
              isWarning && "text-timer-warning",
              !isDanger && !isWarning && "text-timer-safe"
            )}
          />
        </svg>
        <div className={cn(
          "absolute inset-0 flex items-center justify-center font-display text-4xl font-bold",
          isDanger && "text-timer-danger animate-countdown",
          isWarning && "text-timer-warning",
          !isDanger && !isWarning && "text-timer-safe"
        )}>
          {timeLeft}
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
        {isDanger ? "Hurry!" : isWarning ? "Time running out!" : "Seconds remaining"}
      </p>
    </div>
  );
}
