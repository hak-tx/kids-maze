import { AQUARIUM_CHARACTERS } from '../game/characters';
import type { CharacterId, Economy } from '../types';
import { Character } from './Character';
import { CoinBadge } from './CoinBadge';
import { COINS_PER_FULL_ADVENTURE } from '../game/coins';

interface CharacterShopProps {
  economy: Economy;
  onBack: () => void;
  onBuy: (id: CharacterId) => void;
  onEquip: (id: CharacterId) => void;
}

export function CharacterShop({ economy, onBack, onBuy, onEquip }: CharacterShopProps) {
  return (
    <div className="screen shop-screen">
      <header className="shop-header">
        <button type="button" className="btn btn-ghost btn-icon" onClick={onBack} aria-label="Back">←</button>
        <div>
          <span className="eyebrow">Aquarium Shop</span>
          <h2>Choose Your Swimmer</h2>
        </div>
        <CoinBadge coins={economy.coins} />
      </header>

      <p className="shop-intro">
        Find all {COINS_PER_FULL_ADVENTURE} coins in one full adventure. Replay mazes to keep
        building your collection!
      </p>

      <div className="character-grid">
        {AQUARIUM_CHARACTERS.map((character) => {
          const owned = economy.owned.includes(character.id);
          const equipped = economy.equipped === character.id;
          const canBuy = economy.coins >= character.price;

          return (
            <article key={character.id} className={`character-card rarity-${character.rarity}${equipped ? ' equipped' : ''}`}>
              <span className={`rarity-tag rarity-tag-${character.rarity}`}>{character.rarity}</span>
              <div className="character-art" aria-hidden="true"><Character id={character.id} size={128} /></div>
              <h3>{character.name}</h3>
              <p>{character.description}</p>
              <div className="magnet-power" aria-label={`Magnet power ${character.magnetRadius + 1} of ${AQUARIUM_CHARACTERS.length}`}>
                <span aria-hidden="true">🧲</span>
                <strong>Magnet Power {character.magnetRadius + 1}</strong>
                <small>{character.magnetRadius === 0 ? 'Touch coin' : `Reach ${character.magnetRadius} space${character.magnetRadius === 1 ? '' : 's'}`}</small>
              </div>
              <div className="character-price">
                {character.price === 0 ? <strong>Free starter</strong> : <CoinBadge coins={character.price} compact />}
              </div>
              {equipped ? (
                <button type="button" className="btn shop-action equipped-button" disabled>✓ Equipped</button>
              ) : owned ? (
                <button type="button" className="btn btn-secondary shop-action" onClick={() => onEquip(character.id)}>Equip</button>
              ) : (
                <button type="button" className="btn btn-primary shop-action" disabled={!canBuy} onClick={() => onBuy(character.id)}>
                  {canBuy ? 'Unlock & Equip' : `Save ${Math.max(0, character.price - economy.coins).toLocaleString()} more`}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
