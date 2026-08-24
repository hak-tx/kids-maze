import { useCallback, useState } from 'react';
import { loadMuted, persistMuted } from '../sound';

export function useMute() {
  const [muted, setMutedState] = useState(loadMuted);

  const setMuted = useCallback((next: boolean) => {
    setMutedState(next);
    persistMuted(next);
  }, []);

  const toggleMuted = useCallback(() => {
    setMutedState((prev) => {
      const next = !prev;
      persistMuted(next);
      return next;
    });
  }, []);

  return { muted, setMuted, toggleMuted };
}
