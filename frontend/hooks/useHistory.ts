import { useState, useCallback } from 'react';

export interface HistoryEntry {
  id: string;
  type: 'gesture_to_text' | 'text_to_gesture' | 'speech_to_gesture';
  input: string;
  output: string;
  confidence?: number;
  timestamp: number;
  favorite: boolean;
  details?: string;
}

const STORAGE_KEY = 'signbridge_history';
const MAX_ENTRIES = 50;

function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // storage full or unavailable
  }
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(loadHistory);

  const addEntry = useCallback((entry: Omit<HistoryEntry, 'id' | 'timestamp' | 'favorite'>) => {
    setEntries((prev) => {
      const next: HistoryEntry[] = [
        { ...entry, id: crypto.randomUUID(), timestamp: Date.now(), favorite: false },
        ...prev,
      ].slice(0, MAX_ENTRIES);
      saveHistory(next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, favorite: !e.favorite } : e));
      saveHistory(next);
      return next;
    });
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setEntries([]);
    saveHistory([]);
  }, []);

  const favorites = entries.filter((e) => e.favorite);
  const history = entries;

  return { history, favorites, addEntry, toggleFavorite, removeEntry, clearHistory };
}
