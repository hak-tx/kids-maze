import { useCallback, useState } from 'react';
import type { Progress } from '../types';
import { LEVELS } from '../maze/levels';

const KEY = 'kids-maze-progress-v1';

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Progress;
      if (
        typeof parsed.unlocked === 'number' &&
        Array.isArray(parsed.completed)
      ) {
        return {
          unlocked: Math.max(1, Math.min(parsed.unlocked, LEVELS.length)),
          completed: parsed.completed.filter(
            (n) => typeof n === 'number' && n >= 1 && n <= LEVELS.length,
          ),
        };
      }
    }
  } catch {
    /* ignore */
  }
  return { unlocked: 1, completed: [] };
}

function save(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load);

  const completeLevel = useCallback((levelId: number) => {
    setProgress((prev) => {
      const completed = prev.completed.includes(levelId)
        ? prev.completed
        : [...prev.completed, levelId];
      const unlocked = Math.max(
        prev.unlocked,
        Math.min(levelId + 1, LEVELS.length),
      );
      const next = { unlocked, completed };
      save(next);
      return next;
    });
  }, []);

  const isUnlocked = useCallback(
    (levelId: number) => levelId <= progress.unlocked,
    [progress.unlocked],
  );

  const isCompleted = useCallback(
    (levelId: number) => progress.completed.includes(levelId),
    [progress.completed],
  );

  return { progress, completeLevel, isUnlocked, isCompleted };
}
