"use client";

import { useState, useEffect } from "react";
import slangData from "@/data/slang.json";

export interface Slang {
  id: string;
  word: string;
  meaning: string;
  tone: string;
  example: string;
  origin: string;
  popularity: string;
  related: string[];
}

export const useSlang = () => {
  const [slangs, setSlangs] = useState<Slang[]>(slangData);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("slangify-bookmarks");
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  const toggleBookmark = (id: string) => {
    const newBookmarks = bookmarks.includes(id)
      ? bookmarks.filter((b) => b !== id)
      : [...bookmarks, id];
    setBookmarks(newBookmarks);
    localStorage.setItem("slangify-bookmarks", JSON.stringify(newBookmarks));
  };

  const getRandomSlang = () => {
    const randomIndex = Math.floor(Math.random() * slangs.length);
    return slangs[randomIndex];
  };

  const searchSlang = (query: string) => {
    if (!query) return [];
    return slangs.filter((s) =>
      s.word.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getSlangById = (id: string) => {
    return slangs.find((s) => s.id === id);
  };

  const fetchSuggestions = async (term: string): Promise<Slang[]> => {
    if (!term || term.length < 2) return [];
    
    // First, check local data
    const localMatches = slangs.filter(s => 
      s.word.toLowerCase().includes(term.toLowerCase())
    );

    try {
      const response = await fetch(`https://api.urbandictionary.com/v0/autocomplete?term=${encodeURIComponent(term)}`);
      const data: string[] = await response.json();
      
      // Combine local and remote suggestions, ensuring unique words
      const remoteSuggestions = data
        .filter(word => !localMatches.some(l => l.word.toLowerCase() === word.toLowerCase()))
        .slice(0, 5)
        .map(word => ({
          id: `remote-${word}`,
          word,
          meaning: "Loading definition...",
          tone: "Unknown",
          example: "",
          origin: "Urban Dictionary",
          popularity: "Unknown",
          related: []
        }));

      return [...localMatches, ...remoteSuggestions];
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return localMatches;
    }
  };

  const fetchDefinition = async (term: string): Promise<Slang | null> => {
    // First, check local
    const local = slangs.find(s => s.word.toLowerCase() === term.toLowerCase());
    if (local) return local;

    try {
      const response = await fetch(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`);
      const data = await response.json();
      
      if (data.list && data.list.length > 0) {
        const best = data.list[0];
        // Clean definition from [word] markers
        const cleanDef = best.definition.replace(/\[|\]/g, "");
        const cleanExample = best.example.replace(/\[|\]/g, "");
        
        return {
          id: `remote-${best.defid}`,
          word: best.word,
          meaning: cleanDef,
          tone: "Casual / Internet",
          example: cleanExample,
          origin: "Urban Dictionary",
          popularity: best.thumbs_up > 100 ? "Viral" : best.thumbs_up > 20 ? "Medium" : "Low",
          related: [] // UD doesn't provide related in the same way, we could extract or just leave empty
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching definition:", error);
      return null;
    }
  };

  return {
    slangs,
    bookmarks,
    toggleBookmark,
    getRandomSlang,
    searchSlang,
    getSlangById,
    fetchSuggestions,
    fetchDefinition
  };
};
