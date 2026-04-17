import { useCallback, useRef, useState } from 'react';

const STORAGE_KEY = 'herosculpt_recent_parts';
const MAX_PER_CATEGORY = 6;

type RecentMap = Record<string, string[]>; // category -> partId[]

function load(): RecentMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function save(map: RecentMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function useRecentParts() {
  const mapRef = useRef<RecentMap>(load());
  const [, forceUpdate] = useState(0);

  const recordUsed = useCallback((category: string, partId: string) => {
    const map = mapRef.current;
    const list = (map[category] || []).filter(id => id !== partId);
    list.unshift(partId);
    map[category] = list.slice(0, MAX_PER_CATEGORY);
    save(map);
    forceUpdate(n => n + 1);
  }, []);

  const getRecent = useCallback((category: string): string[] => {
    return mapRef.current[category] || [];
  }, []);

  return { recordUsed, getRecent };
}
