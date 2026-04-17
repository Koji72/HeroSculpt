import { useState, useCallback } from 'react';

const STORAGE_KEY = 'herosculpt_favorites';

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function save(favorites: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(load);

  const toggleFavorite = useCallback((partId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(partId)) next.delete(partId);
      else next.add(partId);
      save(next);
      return next;
    });
  }, []);

  return { favorites, toggleFavorite };
}
