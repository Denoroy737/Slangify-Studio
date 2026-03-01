"use client";

import React, { useState } from "react";
import { 
  X, 
  Bookmark, 
  Copy, 
  Share2, 
  Volume2, 
  Hash, 
  TrendingUp, 
  Flame, 
  MessageCircle,
  CheckCircle2,
  BookmarkCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Slang, useSlang } from "@/hooks/useSlang";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SlangCardProps {
  slang: Slang;
  onClose: () => void;
  onSelectRelated: (word: string) => void;
}

export const SlangCard = ({ slang, onClose, onSelectRelated }: SlangCardProps) => {
  const { toggleBookmark, bookmarks } = useSlang();
  const [copied, setCopied] = useState(false);
  const [expandedMeaning, setExpandedMeaning] = useState(false);
  const [expandedExample, setExpandedExample] = useState(false);
  const isBookmarked = bookmarks.includes(slang.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${slang.word}: ${slang.meaning}`);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const popularityColors = {
    Low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Viral: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const isMeaningLong = slang.meaning.length > 150;
  const isExampleLong = slang.example.length > 200;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative w-full max-w-3xl bg-gradient-to-br from-[#09090b] via-[#0f0f13] to-[#09090b] backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Header */}
        <div className="sticky top-0 backdrop-blur-xl bg-[#09090b]/80 border-b border-white/5 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              <div className="flex items-baseline gap-3 flex-wrap">
                <motion.h1 
                  layoutId={`slang-title-${slang.id}`}
                  className="text-4xl sm:text-6xl font-black tracking-tight text-white italic break-words"
                >
                  {slang.word}
                </motion.h1>
                <button 
                  className="p-2.5 bg-blue-600/10 hover:bg-blue-600/20 rounded-full transition-all text-blue-400 hover:text-blue-300 border border-blue-500/30 flex-shrink-0"
                  title="Pronunciation"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn(
                  "px-3 py-1 text-[9px] font-black uppercase tracking-[0.15em] rounded-full border",
                  popularityColors[slang.popularity as keyof typeof popularityColors]
                )}>
                  {slang.popularity}
                </span>
                <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-zinc-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                  <Hash className="w-3 h-3 flex-shrink-0" /> <span className="truncate">{slang.origin}</span>
                </span>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10 text-zinc-400 hover:text-white hover:scale-110 active:scale-95 flex-shrink-0"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10 relative">
          <div className="grid gap-8">
            {/* Meaning Section */}
            <section>
              <h3 className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-blue-500/40 flex-shrink-0" /> 
                <span>Meaning</span>
              </h3>
              <div className="relative">
                <p 
                  className={cn(
                    "text-lg sm:text-xl text-zinc-200 leading-relaxed font-medium tracking-tight word-break transition-all",
                    !expandedMeaning && isMeaningLong ? "line-clamp-3" : ""
                  )}
                >
                  {slang.meaning}
                </p>
                {isMeaningLong && (
                  <button
                    onClick={() => setExpandedMeaning(!expandedMeaning)}
                    className="mt-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {expandedMeaning ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            </section>

            {/* Example Section */}
            <section>
              <h3 className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-purple-500/40 flex-shrink-0" /> 
                <span>Example</span>
              </h3>
              <div className="relative">
                <div className={cn(
                  "bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-4 sm:p-5 border border-white/[0.08] italic text-zinc-300 leading-relaxed text-sm sm:text-base word-break transition-all",
                  !expandedExample && isExampleLong ? "line-clamp-4" : ""
                )}>
                  &quot;{slang.example}&quot;
                </div>
                {isExampleLong && (
                  <button
                    onClick={() => setExpandedExample(!expandedExample)}
                    className="mt-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {expandedExample ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            </section>

            {/* Tone Section */}
            <section>
              <h3 className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-orange-500/40 flex-shrink-0" /> 
                <span>Tone</span>
              </h3>
              <div className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl border border-orange-500/20 text-orange-200 text-sm font-semibold">
                {slang.tone}
              </div>
            </section>

            {/* Related Slangs Section */}
            <section>
              <h3 className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                <span className="w-8 h-px bg-emerald-500/40 flex-shrink-0" /> 
                <span>Related Slangs</span>
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {slang.related.map((rel) => (
                  <button
                    key={rel}
                    onClick={() => onSelectRelated(rel)}
                    className="px-4 py-2.5 bg-white/[0.04] hover:bg-emerald-600/15 border border-white/[0.08] hover:border-emerald-500/40 rounded-xl text-zinc-300 hover:text-emerald-300 transition-all text-xs font-semibold tracking-tight truncate"
                    title={rel}
                  >
                    #{rel}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 border-t border-white/[0.05] bg-[#09090b]/80 backdrop-blur-xl p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={handleCopy}
              className="group flex items-center gap-2 px-4 py-2.5 bg-blue-600/10 hover:bg-blue-600/20 rounded-xl text-xs font-bold uppercase tracking-wider text-blue-300 transition-all border border-blue-500/30"
              title="Copy to clipboard"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <Copy className="w-4 h-4 group-hover:scale-110 transition-transform flex-shrink-0" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            </button>
            <button 
              onClick={() => toggleBookmark(slang.id)}
              className={cn(
                "group flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border",
                isBookmarked 
                  ? "bg-amber-600/10 border-amber-600/30 text-amber-400 hover:bg-amber-600/20" 
                  : "bg-white/[0.04] border-white/[0.08] text-zinc-300 hover:bg-white/[0.08]"
              )}
              title={isBookmarked ? "Remove bookmark" : "Save slang"}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 flex-shrink-0" /> : <Bookmark className="w-4 h-4 group-hover:scale-110 transition-transform flex-shrink-0" />}
              <span className="hidden sm:inline">{isBookmarked ? "Saved" : "Save"}</span>
            </button>
          </div>
          <button 
            className="p-2.5 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl border border-white/[0.08] text-zinc-400 transition-all hover:text-zinc-200 hover:scale-110 active:scale-95 flex-shrink-0"
            title="Share"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
