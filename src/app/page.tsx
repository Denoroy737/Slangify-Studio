"use client";

import React, { useState } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { SearchBar } from "@/components/SearchBar";
import { TrendingSlangs } from "@/components/TrendingSlangs";
import { SlangCard } from "@/components/SlangCard";
import { useSlang, Slang } from "@/hooks/useSlang";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Twitter, Sparkles } from "lucide-react";

export default function Home() {
  const { getRandomSlang, slangs } = useSlang();
  const [selectedSlang, setSelectedSlang] = useState<Slang | null>(null);

  const handleSelectRelated = (word: string) => {
    const related = slangs.find((s) => s.word.toLowerCase() === word.toLowerCase());
    if (related) {
      setSelectedSlang(related);
    }
  };

  const handleRandom = () => {
    setSelectedSlang(getRandomSlang());
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden font-sans selection:bg-blue-500/30 selection:text-white">
      <AnimatedBackground />
      
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 p-6 flex items-center justify-between z-40">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
            <span className="text-white font-black text-xl leading-none italic">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
            Slangify
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <a href="https://x.com/denoroy737" className="p-2 text-zinc-400 hover:text-white transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="https://github.com/Denoroy737/Slangify-Studio" className="p-2 text-zinc-400 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
          {/* <button 
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white transition-all backdrop-blur-md"
          >
            Login
          </button> */}
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative w-full max-w-4xl px-6 flex flex-col items-center gap-12 z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
              Gen-Z Language Engine
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-white drop-shadow-sm">
            Speak fluent <span className="text-blue-500">Slang.</span>
          </h1>
          <p className="text-zinc-500 text-lg sm:text-xl font-medium max-w-lg">
            The minimal dictionary for the modern web. Search, learn, and bookmark your favorite Gen-Z slangs.
          </p>
        </motion.div>

        <SearchBar 
          onSelect={(slang) => setSelectedSlang(slang)} 
          onRandom={handleRandom}
        />

        <TrendingSlangs onSelect={(slang) => setSelectedSlang(slang)} />
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-8 flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest font-bold text-zinc-600">
          {/* <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">API</a> */}
        </div>
        <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-700">
          © 2026 Slangify AI. Inspired by Arc.
        </p>
      </footer>

      {/* Modals/Cards */}
      <AnimatePresence>
        {selectedSlang && (
          <SlangCard 
            slang={selectedSlang} 
            onClose={() => setSelectedSlang(null)} 
            onSelectRelated={handleSelectRelated}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
