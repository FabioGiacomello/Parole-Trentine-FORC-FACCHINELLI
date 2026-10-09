import { useState, useEffect } from 'react';
import { SearchHistoryItem } from '@/types/dictionary';

const STORAGE_KEY = 'dizionario-trentino-history';
const STATS_STORAGE_KEY = 'dizionario-trentino-search-stats';
const MAX_HISTORY_ITEMS = 20;

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [searchStats, setSearchStats] = useState<Record<string, number>>({});

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    const storedStats = localStorage.getItem(STATS_STORAGE_KEY);
    if (storedStats) {
      try {
        setSearchStats(JSON.parse(storedStats));
      } catch {
        setSearchStats({});
      }
    }
  }, []);

  const addToHistory = (query: string, resultCount: number) => {
    if (!query.trim()) return;
    const normalizedQuery = query.trim().toLowerCase();

    const newItem: SearchHistoryItem = {
      query: query.trim(),
      timestamp: new Date(),
      resultCount
    };

    setHistory(prev => {
      // Rimuovi la stessa ricerca se già presente in cronologia
      const filtered = prev.filter(item =>
        item.query.toLowerCase() !== query.toLowerCase()
      );

      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    setSearchStats(prev => {
      const updated = {
        ...prev,
        [normalizedQuery]: (prev[normalizedQuery] ?? 0) + 1
      };
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromHistory = (query: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.query !== query);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getMostSearched = (limit = 5) => {
    return Object.entries(searchStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([query, count]) => ({ query, count }));
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getMostSearched
  };
}
