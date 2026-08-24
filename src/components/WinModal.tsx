import { Character } from './Character';

interface WinModalProps {
  levelId: number;
  levelName: string;
  hasNext: boolean;
  onNext: () => void;
  onReplay: () => void;
  onHome: () => void;
}

export function WinModal({
  levelId,
  levelName,
  hasNext,
  onNext,
  onReplay,
  onHome,
}: WinModalProps) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="win-title">
      <div className="modal win-modal">
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 18 }, (_, i) => (
            <span key={i} className={`confetti-piece c${i % 6}`} />
          ))}
        </div>
        <div className="win-burst" aria-hidden="true" />
        <div className="win-hero" aria-hidden="true">
          <Character size={72} celebrating />
        </div>
        <h2 id="win-title">{hasNext ? 'You did it!' : 'Champion!'}</h2>
        <p className="win-sub">
          Level {levelId}: {levelName}
        </p>
        <div className="win-actions">
          {hasNext ? (
            <button type="button" className="btn btn-primary btn-xl" onClick={onNext} autoFocus>
              Next Level →
            </button>
          ) : (
            <p className="win-champ">You finished every maze! 🏆</p>
          )}
          <button type="button" className="btn btn-secondary btn-lg" onClick={onReplay}>
            Play Again
          </button>
          <button type="button" className="btn btn-ghost btn-lg" onClick={onHome}>
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
