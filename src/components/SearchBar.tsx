"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, CornerDownLeft, Sparkles, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSlang, Slang } from "@/hooks/useSlang";
import { useSound } from "@/hooks/useSound";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSelect: (slang: Slang) => void;
  onRandom: () => void;
}

export const SearchBar = ({ onSelect, onRandom }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<Slang[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchSuggestions, fetchDefinition } = useSlang();
  const { enabled: soundEnabled, toggleSound, playSearchSound } = useSound();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAsyncSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      const results = await fetchSuggestions(query);
      setSuggestions(results);
      setIsLoading(false);
    };

    const timer = setTimeout(fetchAsyncSuggestions, 200);
    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex]);
        } else if (suggestions.length > 0) {
          handleSelect(suggestions[0]);
        } else if (query.trim()) {
          // If no suggestions, try to fetch definition for exact query
          const manualSlang: Slang = {
            id: `remote-${query}`,
            word: query,
            meaning: "Loading definition...",
            tone: "Unknown",
            example: "",
            origin: "Urban Dictionary",
            popularity: "Unknown",
            related: []
          };
          handleSelect(manualSlang);
        }
      } else if (e.key === "Escape") {

      setIsOpen(false);
    }
  };

  const handleSelect = async (slang: Slang) => {
    playSearchSound();
    
    // If it's a remote suggestion with no definition, fetch it
    if (slang.id.startsWith("remote-") && slang.meaning === "Loading definition...") {
      setIsLoading(true);
      const fullSlang = await fetchDefinition(slang.word);
      setIsLoading(false);
      if (fullSlang) {
        onSelect(fullSlang);
      }
    } else {
      onSelect(slang);
    }
    
    setQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto z-50">
      <div className="group relative">
        <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl blur-md opacity-25 group-focus-within:opacity-100 transition duration-1000 group-focus-within:duration-200"></div>
        <div className="relative flex items-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden px-4 shadow-2xl">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-none focus:ring-0 text-white py-5 px-4 text-xl placeholder:text-zinc-600 outline-hidden"
            placeholder="Search for slang..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-2">
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1.5 mr-2"
              >
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse [animation-delay:200ms]" />
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse [animation-delay:400ms]" />
              </motion.div>
            )}
            <button 
              onClick={toggleSound}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
              title={soundEnabled ? "Mute Sound" : "Unmute Sound"}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button 
              onClick={onRandom}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
              title="Random Slang"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-zinc-500 font-medium">
              <span className="text-xs">⌘</span>
              <span>K</span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-3xl overflow-hidden p-2"
          >
            {suggestions.map((slang, index) => (
              <motion.button
                key={slang.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelect(slang)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group/item",
                  selectedIndex === index ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-focus-within/item:opacity-100 group-hover/item:opacity-100 transition-opacity" />
                  <span className="font-medium text-lg">{slang.word}</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                  <span className="text-xs text-zinc-500">Search</span>
                  <CornerDownLeft className="w-3 h-3 text-zinc-500" />
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
