import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SpinWheelProps {
  rounds: string[];
  onSpinComplete: (selectedIndex: number) => void;
}

export function SpinWheel({ rounds, onSpinComplete }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const colors = [
    "bg-primary",
    "bg-secondary", 
    "bg-gamble",
    "bg-teamA",
    "bg-teamB"
  ];

  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const randomOffset = Math.random() * 360;
    const totalRotation = spins * 360 + randomOffset;
    
    setRotation(prev => prev + totalRotation);
    
    setTimeout(() => {
      const finalAngle = (rotation + totalRotation) % 360;
      const segmentAngle = 360 / rounds.length;
      const selectedIndex = Math.floor((360 - finalAngle + segmentAngle / 2) % 360 / segmentAngle) % rounds.length;
      
      setSelectedRound(selectedIndex);
      setIsSpinning(false);
      
      setTimeout(() => {
        onSpinComplete(selectedIndex);
      }, 1500);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="font-display text-3xl md:text-4xl font-black text-gradient mb-2 animate-fade-in">
        SPIN THE WHEEL
      </h1>
      <p className="text-muted-foreground mb-8 animate-fade-in">
        Spin to select your starting round!
      </p>

      <div className="relative w-72 h-72 md:w-80 md:h-80">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
          <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-primary drop-shadow-lg" />
        </div>

        {/* Wheel */}
        <div
          ref={wheelRef}
          className="w-full h-full rounded-full border-4 border-border overflow-hidden shadow-2xl transition-transform ease-out"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isSpinning ? "4s" : "0s",
            transitionTimingFunction: "cubic-bezier(0.17, 0.67, 0.12, 0.99)"
          }}
        >
          {rounds.map((round, index) => {
            const angle = (360 / rounds.length) * index;
            const skewAngle = 90 - 360 / rounds.length;
            
            return (
              <div
                key={index}
                className={cn(
                  "absolute w-1/2 h-1/2 origin-bottom-right",
                  colors[index % colors.length]
                )}
                style={{
                  transform: `rotate(${angle}deg) skewY(${skewAngle}deg)`,
                  transformOrigin: "0% 100%",
                  left: "50%",
                  top: "0"
                }}
              >
                <span
                  className="absolute text-xs font-bold text-white drop-shadow-md whitespace-nowrap"
                  style={{
                    transform: `skewY(-${skewAngle}deg) rotate(${360 / rounds.length / 2}deg)`,
                    left: "20%",
                    top: "40%"
                  }}
                >
                  {round.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-background border-4 border-border shadow-lg flex items-center justify-center z-10">
          <span className="text-2xl">🎯</span>
        </div>
      </div>

      {selectedRound !== null && !isSpinning && (
        <div className="mt-8 text-center animate-scale-in">
          <p className="text-lg text-muted-foreground">Starting with</p>
          <p className="font-display text-2xl font-bold text-primary">{rounds[selectedRound]}</p>
        </div>
      )}

      {selectedRound === null && (
        <Button
          onClick={handleSpin}
          disabled={isSpinning}
          size="lg"
          className="mt-8 font-display font-bold text-lg px-10 py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 animate-fade-in"
        >
          {isSpinning ? "Spinning..." : "🎰 SPIN!"}
        </Button>
      )}
    </div>
  );
}