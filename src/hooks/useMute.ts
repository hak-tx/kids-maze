import { useCallback, useEffect, useState } from 'react';
import { loadMuted, persistMuted, setBackgroundMusicEnabled } from '../sound';

export function useMute() {
  const [muted, setMutedState] = useState(loadMuted);

  useEffect(() => {
    setBackgroundMusicEnabled(!muted);
  }, [muted]);

  useEffect(() => () => setBackgroundMusicEnabled(false), []);

  const setMuted = useCallback((next: boolean) => {
    setBackgroundMusicEnabled(!next);
    setMutedState(next);
    persistMuted(next);
  }, []);

  const toggleMuted = useCallback(() => {
    setMutedState((prev) => {
      const next = !prev;
      setBackgroundMusicEnabled(!next);
      persistMuted(next);
      return next;
    });
  }, []);

  return { muted, setMuted, toggleMuted };
}
