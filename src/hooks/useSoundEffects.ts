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
  bgMusic: "https://assets.mixkit.co/active_storage/sfx/2514/2514-preview.mp3"
};

export function useSoundEffects() {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload sounds
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = "auto";
      if (key === "bgMusic") {
        audio.loop = true;
        audio.volume = 0.15;
        bgMusicRef.current = audio;
      } else {
        audio.volume = 0.5;
        audioRefs.current[key] = audio;
      }
    });

    return () => {
      bgMusicRef.current?.pause();
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

  const startBgMusic = useCallback(() => {
    bgMusicRef.current?.play().catch(() => {});
  }, []);

  const stopBgMusic = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
    }
  }, []);

  const toggleBgMusic = useCallback(() => {
    if (bgMusicRef.current?.paused) {
      bgMusicRef.current.play().catch(() => {});
    } else {
      bgMusicRef.current?.pause();
    }
  }, []);

  return { playSound, startBgMusic, stopBgMusic, toggleBgMusic };
}
