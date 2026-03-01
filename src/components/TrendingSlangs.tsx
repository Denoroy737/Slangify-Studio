"use client";

import React from "react";
import { TrendingUp, Flame, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Slang, useSlang } from "@/hooks/useSlang";
import { cn } from "@/lib/utils";

interface TrendingSlangsProps {
  onSelect: (slang: Slang) => void;
}

export const TrendingSlangs = ({ onSelect }: TrendingSlangsProps) => {
  const { slangs } = useSlang();
  
  // Just pick first 4 for trending
  const trending = slangs.slice(0, 4);

  return (
    <div className="w-full max-w-2xl mx-auto mt-12">
      <div className="flex items-center gap-2 mb-4 px-2">
        <TrendingUp className="w-4 h-4 text-emerald-400" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
          Trending Slangs
        </h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {trending.map((slang, index) => (
          <motion.button
            key={slang.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(slang)}
            className="group flex flex-col items-start gap-2 p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl transition-all text-left relative overflow-hidden"
          >
            <div className="absolute -right-2 -top-2 opacity-10 group-hover:opacity-20 transition-opacity">
              {index % 2 === 0 ? <Flame className="w-12 h-12 text-orange-500" /> : <Star className="w-12 h-12 text-blue-500" />}
            </div>
            <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
              {slang.word}
            </span>
            <span className="text-xs text-zinc-500 line-clamp-1">
              {slang.meaning}
            </span>
          </motion.button>
        ))}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => {/* View all or similar */}}
          className="group flex flex-col items-center justify-center gap-2 p-4 bg-white/2 hover:bg-white/5 border border-dashed border-white/10 rounded-2xl transition-all"
        >
          <Sparkles className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          <span className="text-xs font-medium text-zinc-600 group-hover:text-zinc-400 transition-colors">
            View More
          </span>
        </motion.button>
      </div>
    </div>
  );
};
