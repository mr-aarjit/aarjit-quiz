import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface SpinWheelProps {
  rounds: string[];
  onSpinComplete: (selectedIndex: number) => void;
}

const WHEEL_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--gamble))",
  "hsl(var(--teamA))",
  "hsl(var(--teamB))",
];

export function SpinWheel({ rounds, onSpinComplete }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { playSound } = useSoundEffects();
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const segmentAngle = 360 / rounds.length;

  // Draw wheel on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 8;

    ctx.clearRect(0, 0, size, size);

    // Draw segments
    rounds.forEach((round, i) => {
      const startAngle = (i * segmentAngle - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180);

      // Segment fill
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
      ctx.fill();

      // Segment border
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      const textAngle = startAngle + (endAngle - startAngle) / 2;
      const textRadius = radius * 0.65;
      const tx = center + Math.cos(textAngle) * textRadius;
      const ty = center + Math.sin(textAngle) * textRadius;

      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.fillStyle = "white";
      ctx.font = "bold 13px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Word wrap for long names
      const words = round.split(" ");
      if (words.length > 1) {
        ctx.font = "bold 11px system-ui, sans-serif";
        ctx.fillText(words[0], 0, -7);
        ctx.fillText(words.slice(1).join(" "), 0, 7);
      } else {
        ctx.fillText(round, 0, 0);
      }
      ctx.restore();
    });

    // Outer ring
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "hsl(var(--border))";
    ctx.lineWidth = 6;
    ctx.stroke();

    // Decorative dots on outer ring
    for (let i = 0; i < 24; i++) {
      const dotAngle = (i * 15) * (Math.PI / 180);
      const dx = center + Math.cos(dotAngle) * (radius + 0);
      const dy = center + Math.sin(dotAngle) * (radius + 0);
      ctx.beginPath();
      ctx.arc(dx, dy, 3, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--secondary))";
      ctx.fill();
    }
  }, [rounds, segmentAngle]);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    playSound("spin");

    // Play tick sounds during spin
    let tickSpeed = 80;
    const startTicking = () => {
      let elapsed = 0;
      const tick = () => {
        if (elapsed > 3500) {
          if (tickIntervalRef.current) clearTimeout(tickIntervalRef.current);
          return;
        }
        playSound("tick");
        elapsed += tickSpeed;
        tickSpeed = Math.min(tickSpeed + 8, 400); // Slow down
        tickIntervalRef.current = setTimeout(tick, tickSpeed);
      };
      tick();
    };
    startTicking();

    const spins = 5 + Math.random() * 5;
    const randomOffset = Math.random() * 360;
    const totalRotation = spins * 360 + randomOffset;

    setRotation((prev) => prev + totalRotation);

    setTimeout(() => {
      const finalAngle = (rotation + totalRotation) % 360;
      const selectedIndex =
        Math.floor(((360 - finalAngle + segmentAngle / 2) % 360) / segmentAngle) %
        rounds.length;

      setSelectedRound(selectedIndex);
      setIsSpinning(false);
      playSound("roundComplete");

      setTimeout(() => {
        onSpinComplete(selectedIndex);
      }, 2000);
    }, 4500);
  };

  useEffect(() => {
    return () => {
      if (tickIntervalRef.current) clearTimeout(tickIntervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="font-display text-3xl md:text-5xl font-black text-gradient mb-1 animate-fade-in">
          🎡 SPIN THE WHEEL
        </h1>
        <p className="text-muted-foreground mb-6 text-sm animate-fade-in">
          Spin to select your starting round!
        </p>

        {/* Wheel container */}
        <div className="relative w-72 h-72 md:w-[340px] md:h-[340px]">
          {/* Pointer triangle */}
          <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 z-30">
            <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[28px] border-l-transparent border-r-transparent border-t-primary drop-shadow-lg" />
          </div>

          {/* Spinning wheel wrapper */}
          <div
            className="w-full h-full rounded-full shadow-2xl"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? "transform 4.5s cubic-bezier(0.15, 0.6, 0.15, 1)"
                : "none",
            }}
          >
            <canvas
              ref={canvasRef}
              width={340}
              height={340}
              className="w-full h-full"
            />
          </div>

          {/* Center button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div
              className={cn(
                "w-16 h-16 md:w-20 md:h-20 rounded-full bg-background border-4 border-border shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform",
                isSpinning && "animate-pulse"
              )}
              onClick={handleSpin}
            >
              <span className="text-2xl md:text-3xl">{isSpinning ? "🌀" : "🎯"}</span>
            </div>
          </div>
        </div>

        {/* Result */}
        {selectedRound !== null && !isSpinning && (
          <div className="mt-6 text-center animate-scale-in">
            <p className="text-sm text-muted-foreground">You're starting with</p>
            <p className="font-display text-2xl md:text-3xl font-black text-primary animate-float">
              🎉 {rounds[selectedRound]}
            </p>
          </div>
        )}

        {/* Spin button */}
        {selectedRound === null && (
          <Button
            onClick={handleSpin}
            disabled={isSpinning}
            size="lg"
            className="mt-6 font-display font-bold text-lg px-10 py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl glow-primary animate-fade-in"
          >
            {isSpinning ? "🌀 Spinning..." : "🎰 SPIN!"}
          </Button>
        )}

        {/* Round legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-sm">
          {rounds.map((round, i) => (
            <span
              key={i}
              className={cn(
                "text-xs px-2 py-1 rounded-full font-medium border border-border/30",
                selectedRound === i && "ring-2 ring-primary font-bold"
              )}
              style={{
                backgroundColor: WHEEL_COLORS[i % WHEEL_COLORS.length] + "22",
                color: WHEEL_COLORS[i % WHEEL_COLORS.length],
              }}
            >
              {round}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
