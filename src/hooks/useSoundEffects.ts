import { useCallback, useRef, useEffect } from "react";

// Sound URLs using free sound effects
const SOUNDS = {
  correct: "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3",
  wrong: "https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3",
  tick: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
  pass: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
  spin: "https://assets.mixkit.co/active_storage/sfx/146/146-preview.mp3",
  select: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
  roundComplete: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3",
  timerWarning: "https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3",
  timerCritical: "https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3",
};

export function useSoundEffects() {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  useEffect(() => {
    // Preload sounds
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = "auto";
      audio.volume = 0.5;
      audioRefs.current[key] = audio;
    });

    return () => {
      Object.values(audioRefs.current).forEach(audio => audio?.pause());
    };
  }, []);

  const playSound = useCallback((sound: keyof typeof SOUNDS) => {
    const audio = audioRefs.current[sound];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, []);

  return { playSound };
}
