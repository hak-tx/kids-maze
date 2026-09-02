interface BonusTimerProps {
  remainingMs: number;
  active: boolean;
  paused?: boolean;
}

function formatBonusClock(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function BonusTimer({ remainingMs, active, paused = false }: BonusTimerProps) {
  if (!active) {
    return (
      <div className="bonus-timer bonus-timer-over" role="status" aria-live="polite">
        Bonus over
      </div>
    );
  }

  const low = remainingMs <= 10_000 && !paused;
  const clock = formatBonusClock(remainingMs);

  return (
    <div
      className={`bonus-timer bonus-timer-active${low ? ' bonus-timer-low' : ''}${paused ? ' bonus-timer-paused' : ''}`}
      role="timer"
      aria-label={
        paused
          ? `Bonus time ${clock}, paused.`
          : `Bonus time ${clock}. Finish in time for double coins.`
      }
    >
      <span aria-hidden="true">⭐</span>
      <span>{clock}</span>
    </div>
  );
}
