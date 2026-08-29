import { Character } from './Character';
import type { CharacterId } from '../types';
import { getBestAffordableUpgrade } from '../game/characters';

interface WinModalProps {
  levelId: number;
  levelName: string;
  hasNext: boolean;
  onNext: () => void;
  onReplay: () => void;
  onHome: () => void;
  characterId: CharacterId;
  coinsCollected: number;
  coinTotal: number;
  ownedCharacters: CharacterId[];
  onShop: () => void;
}

export function WinModal({
  levelId,
  levelName,
  hasNext,
  onNext,
  onReplay,
  onHome,
  characterId,
  coinsCollected,
  coinTotal,
  ownedCharacters,
  onShop,
}: WinModalProps) {
  const upgrade = getBestAffordableUpgrade(coinTotal, ownedCharacters);

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
          <Character id={characterId} size={92} celebrating />
        </div>
        <h2 id="win-title">{hasNext ? 'You did it!' : 'Champion!'}</h2>
        <p className="win-sub">
          Level {levelId}: {levelName}
        </p>
        <p className="win-coins">🪙 You found <strong>{coinsCollected}</strong> coin{coinsCollected === 1 ? '' : 's'}!</p>
        {upgrade ? (
          <section className={`win-upgrade-offer rarity-${upgrade.rarity}`} aria-label="Character upgrade available">
            <div className="win-upgrade-art" aria-hidden="true">
              <Character id={upgrade.id} size={72} celebrating />
            </div>
            <div className="win-upgrade-copy">
              <span className={`rarity-tag rarity-tag-${upgrade.rarity}`}>{upgrade.rarity}</span>
              <strong>New upgrade available!</strong>
              <span>{upgrade.name} · Magnet Power {upgrade.magnetRadius + 1}</span>
              <small>Yours for {upgrade.price} coins · You have {coinTotal}</small>
            </div>
            <button type="button" className="btn btn-upgrade-offer" onClick={onShop}>
              View in Shop
            </button>
          </section>
        ) : null}
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
