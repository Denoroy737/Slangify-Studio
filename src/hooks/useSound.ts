"use client";

import { useState, useEffect } from "react";

export const useSound = () => {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("slangify-sound-enabled");
    if (saved !== null) {
      setEnabled(JSON.parse(saved));
    }
  }, []);

  const toggleSound = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    localStorage.setItem("slangify-sound-enabled", JSON.stringify(newValue));
  };

  const playSearchSound = () => {
    if (!enabled) return;

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.error("Audio context failed", e);
    }
  };

  return { enabled, toggleSound, playSearchSound };
};
