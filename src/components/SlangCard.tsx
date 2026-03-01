"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  X,
  Bookmark,
  Copy,
  Share2,
  Volume2,
  Hash,
  TrendingUp,
  Flame,
  CheckCircle2,
  BookmarkCheck,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Slang, useSlang } from "@/hooks/useSlang";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SlangCardProps {
  slang: Slang;
  onClose: () => void;
  onSelectRelated: (word: string) => void;
}

const POPULARITY_STYLES = {
  Low: {
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Icon: TrendingUp,
  },
  Medium: {
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Icon: Flame,
  },
  Viral: {
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
    Icon: Flame,
  },
} as const;

export const SlangCard = ({ slang, onClose, onSelectRelated }: SlangCardProps) => {
  const { toggleBookmark, bookmarks } = useSlang();
  const shouldReduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [expandedMeaning, setExpandedMeaning] = useState(false);
  const [expandedExample, setExpandedExample] = useState(false);
  // Tracks whether the exit animation has been triggered.
  // Flip this to true instead of calling onClose directly — it strips all
  // GPU-expensive blur/shadow layers first so the animation is cost-free.
  const [isExiting, setIsExiting] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const isBookmarked = bookmarks.includes(slang.id);
  const isMeaningLong = slang.meaning.length > 150;
  const isExampleLong = slang.example.length > 200;

  const popularityConfig =
    POPULARITY_STYLES[slang.popularity as keyof typeof POPULARITY_STYLES] ??
    POPULARITY_STYLES.Low;

  // Single entry-point for all close triggers (button, backdrop, Escape).
  // Sets isExiting so expensive layers are stripped before the animation runs,
  // then the onAnimationComplete callback below fires onClose once it's done.
  const handleClose = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
  }, [isExiting]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  // Autofocus close button on mount
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard
      .writeText(`${slang.word}: ${slang.meaning}`)
      .then(() => {
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => toast.error("Failed to copy."));
  }, [slang.word, slang.meaning]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: slang.word,
      text: `${slang.word}: ${slang.meaning}`,
    };
    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${slang.word}: ${slang.meaning}`);
        toast.success("Link copied — share away!");
      }
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // User cancelled share — do nothing
    }
  }, [slang.word, slang.meaning]);

  const handleSpeak = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      toast.error("Text-to-speech is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(slang.word);
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }, [slang.word]);

  const handleRelated = useCallback(
    (word: string) => {
      onSelectRelated(word);
      handleClose();
    },
    [onSelectRelated, handleClose]
  );

  // Exit: pure opacity fade — no blur, no shadow, nothing expensive composited.
  const exitTransition = { duration: 0.15, ease: "easeIn" } as const;
  const enterTransition = { type: "spring", damping: 22, stiffness: 280 } as const;
  const instantTransition = { duration: 0.08 } as const;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Slang definition: ${slang.word}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      // Fire the real onClose only after the animation has fully finished
      onAnimationComplete={() => { if (isExiting) onClose(); }}
      transition={
        shouldReduceMotion
          ? instantTransition
          : isExiting
          ? exitTransition
          : { duration: 0.2 }
      }
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop — blur is removed the instant isExiting flips */}
      <div
        className={cn(
          "absolute inset-0 bg-black/60 transition-opacity duration-150",
          // Strip backdrop-blur immediately on exit so it's gone before opacity fades
          !shouldReduceMotion && !isExiting && "backdrop-blur-md"
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Card */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
        animate={
          isExiting
            ? { opacity: 0, scale: 0.97, y: 8 }
            : { opacity: 1, scale: 1, y: 0 }
        }
        transition={
          shouldReduceMotion
            ? instantTransition
            : isExiting
            ? exitTransition
            : enterTransition
        }
        className={cn(
          "relative w-full max-w-3xl flex flex-col",
          "bg-gradient-to-br from-[#09090b] via-[#0f0f13] to-[#09090b]",
          "border border-white/10 rounded-3xl",
          "max-h-[90vh]",
          // Strip shadow and card-level blur the moment exit starts
          !shouldReduceMotion && !isExiting &&
            "shadow-[0_0_100px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)]"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow blobs — hidden on exit so blur-[120px] isn't composited during fade */}
        {!isExiting && (
          <>
            <div
              aria-hidden="true"
              className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"
            />
          </>
        )}

        {/* ── Header ── */}
        <div className={cn(
          "flex-shrink-0 sticky top-0 bg-[#09090b]/80 border-b border-white/5 p-6 sm:p-8 rounded-t-3xl z-10",
          // Strip header backdrop-blur on exit
          !isExiting && "backdrop-blur-xl"
        )}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <motion.h1
                  layoutId={shouldReduceMotion ? undefined : `slang-title-${slang.id}`}
                  className="text-4xl sm:text-6xl font-black tracking-tight text-white italic break-words"
                >
                  {slang.word}
                </motion.h1>
                <button
                  onClick={handleSpeak}
                  className="p-2.5 bg-blue-600/10 hover:bg-blue-600/20 rounded-full transition-all text-blue-400 hover:text-blue-300 border border-blue-500/30 flex-shrink-0 hover:scale-110 active:scale-95"
                  title={`Pronounce "${slang.word}"`}
                  aria-label={`Pronounce ${slang.word}`}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Popularity badge */}
                <span
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 text-[9px] font-black uppercase tracking-[0.15em] rounded-full border",
                    popularityConfig.badge
                  )}
                >
                  <popularityConfig.Icon className="w-3 h-3 flex-shrink-0" />
                  {slang.popularity}
                </span>

                {/* Origin badge */}
                <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-zinc-500 bg-white/5 px-3 py-1 rounded-full border border-white/5 max-w-[180px]">
                  <Hash className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{slang.origin}</span>
                </span>
              </div>
            </div>

            <button
              ref={closeBtnRef}
              onClick={handleClose}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10 text-zinc-400 hover:text-white hover:scale-110 active:scale-95 flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Scrollable Content ── */}
        <div className="overflow-y-auto overscroll-contain flex-1">
          <div className="p-6 sm:p-10">
            <div className="grid gap-8">

              {/* Meaning */}
              <Section
                label="Meaning"
                accentColor="bg-blue-500/40"
              >
                <ExpandableText
                  text={slang.meaning}
                  isLong={isMeaningLong}
                  expanded={expandedMeaning}
                  onToggle={() => setExpandedMeaning((v) => !v)}
                  className="text-lg sm:text-xl text-zinc-200 leading-relaxed font-medium tracking-tight break-words"
                  toggleColor="text-blue-400 hover:text-blue-300"
                />
              </Section>

              {/* Example */}
              <Section label="Example" accentColor="bg-purple-500/40">
                <div
                  className={cn(
                    "bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-4 sm:p-5",
                    "border border-white/[0.08] text-zinc-300 leading-relaxed text-sm sm:text-base break-words"
                  )}
                >
                  <ExpandableText
                    text={`"${slang.example}"`}
                    isLong={isExampleLong}
                    expanded={expandedExample}
                    onToggle={() => setExpandedExample((v) => !v)}
                    className="italic"
                    toggleColor="text-purple-400 hover:text-purple-300"
                  />
                </div>
              </Section>

              {/* Tone */}
              <Section label="Tone" accentColor="bg-orange-500/40">
                <div className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl border border-orange-500/20 text-orange-200 text-sm font-semibold">
                  {slang.tone}
                </div>
              </Section>

              {/* Related */}
              {slang.related.length > 0 && (
                <Section label="Related Slangs" accentColor="bg-emerald-500/40">
                  <div className="flex flex-wrap gap-2.5">
                    {slang.related.map((rel) => (
                      <button
                        key={rel}
                        onClick={() => handleRelated(rel)}
                        className="px-4 py-2.5 bg-white/[0.04] hover:bg-emerald-600/15 border border-white/[0.08] hover:border-emerald-500/40 rounded-xl text-zinc-300 hover:text-emerald-300 transition-all text-xs font-semibold tracking-tight truncate max-w-[160px]"
                        title={`#${rel}`}
                      >
                        #{rel}
                      </button>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className={cn(
          "flex-shrink-0 sticky bottom-0 border-t border-white/[0.05] bg-[#09090b]/80 p-5 sm:p-6 flex items-center justify-between gap-4 rounded-b-3xl",
          !isExiting && "backdrop-blur-xl"
        )}>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Copy */}
            <ActionButton
              onClick={handleCopy}
              active={copied}
              activeIcon={<CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
              inactiveIcon={<Copy className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />}
              label={copied ? "Copied" : "Copy"}
              className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 border-blue-500/30"
            />

            {/* Bookmark */}
            <ActionButton
              onClick={() => toggleBookmark(slang.id)}
              active={isBookmarked}
              activeIcon={<BookmarkCheck className="w-4 h-4 flex-shrink-0" />}
              inactiveIcon={<Bookmark className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />}
              label={isBookmarked ? "Saved" : "Save"}
              className={
                isBookmarked
                  ? "bg-amber-600/10 border-amber-600/30 text-amber-400 hover:bg-amber-600/20"
                  : "bg-white/[0.04] border-white/[0.08] text-zinc-300 hover:bg-white/[0.08]"
              }
            />
          </div>

          {/* Share */}
          <button
            onClick={handleShare}
            title="Share"
            aria-label="Share this slang"
            className={cn(
              "p-2.5 rounded-xl border transition-all hover:scale-110 active:scale-95 flex-shrink-0",
              shared
                ? "bg-emerald-600/10 border-emerald-500/30 text-emerald-400"
                : "bg-white/[0.04] border-white/[0.08] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200"
            )}
          >
            {shared ? (
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Sub-components ────────────────────────────────────────────────────────────

interface SectionProps {
  label: string;
  accentColor: string;
  children: React.ReactNode;
}

const Section = ({ label, accentColor, children }: SectionProps) => (
  <section>
    <h3 className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
      <span className={cn("w-8 h-[1px] flex-shrink-0", accentColor)} />
      <span>{label}</span>
    </h3>
    {children}
  </section>
);

interface ExpandableTextProps {
  text: string;
  isLong: boolean;
  expanded: boolean;
  onToggle: () => void;
  className?: string;
  toggleColor: string;
}

const ExpandableText = ({
  text,
  isLong,
  expanded,
  onToggle,
  className,
  toggleColor,
}: ExpandableTextProps) => (
  <>
    <p
      className={cn(
        "transition-all duration-300",
        !expanded && isLong && "line-clamp-3",
        className
      )}
    >
      {text}
    </p>
    {isLong && (
      <button
        onClick={onToggle}
        className={cn("mt-2 text-xs font-semibold transition-colors", toggleColor)}
      >
        {expanded ? "Show less ↑" : "Show more ↓"}
      </button>
    )}
  </>
);

interface ActionButtonProps {
  onClick: () => void;
  active: boolean;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
  label: string;
  className: string;
}

const ActionButton = ({
  onClick,
  active,
  activeIcon,
  inactiveIcon,
  label,
  className,
}: ActionButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      "group flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border",
      className
    )}
  >
    {active ? activeIcon : inactiveIcon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);