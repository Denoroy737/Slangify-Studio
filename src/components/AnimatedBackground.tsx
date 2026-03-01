"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EMOJIS = ["🔥", "💀", "💅", "🤡", "🧢", "🗿", "💯", "✨", "👀", "🤫", "🤑", "🫠"];

interface Emoji {
  id: number;
  char: string;
  x: number;
  y: number;
  size: number;
  duration: number;
}

export const AnimatedBackground = () => {
  const [emojis, setEmojis] = useState<Emoji[]>([]);

  useEffect(() => {
    const initialEmojis = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      char: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 20,
      duration: Math.random() * 15 + 15,
    }));
    setEmojis(initialEmojis);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-black">
      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      
      <div className="absolute inset-0 opacity-20">
        <AnimatePresence>
          {emojis.map((emoji) => (
            <motion.div
              key={emoji.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.1, 0.4, 0.1],
                scale: [1, 1.1, 1],
                x: [`${emoji.x}%`, `${(emoji.x + 2) % 100}%`, `${emoji.x}%`],
                y: [`${emoji.y}%`, `${(emoji.y + 2) % 100}%`, `${emoji.y}%`],
              }}
              transition={{
                duration: emoji.duration,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute select-none"
              style={{ fontSize: `${emoji.size}px` }}
            >
              {emoji.char}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="absolute inset-0 bg-radial-[circle_at_center,_var(--tw-gradient-from)_0%,_transparent_100%] from-blue-600/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black" />
    </div>
  );
};
