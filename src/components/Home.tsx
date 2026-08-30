import { Character } from './Character';
import { GoalPortal, MazeMark } from './Markers';
import { MuteButton } from './MuteButton';
import { playTap } from '../sound';
import type { CharacterId } from '../types';
import { CoinBadge } from './CoinBadge';

interface HomeProps {
  onPlay: () => void;
  onLevels: () => void;
  onHowTo: () => void;
  unlocked: number;
  muted: boolean;
  onToggleMute: () => void;
  coins: number;
  characterId: CharacterId;
  onShop: () => void;
}

export function Home({
  onPlay,
  onLevels,
  onHowTo,
  unlocked,
  muted,
  onToggleMute,
  coins,
  characterId,
  onShop,
}: HomeProps) {
  return (
    <div className="screen home-screen">
      <div className="home-top">
        <MuteButton muted={muted} onToggle={onToggleMute} />
        <button type="button" className="btn btn-shop" onClick={onShop}>
          <CoinBadge coins={coins} compact />
          <span>Aquarium Shop</span>
        </button>
      </div>

      <div className="home-hero">
        <div className="home-logo" aria-hidden="true">
          <MazeMark size={88} />
          <div className="home-buddy">
            <Character id={characterId} size={64} />
          </div>
        </div>
        <span className="eyebrow">Underwater Adventure</span>
        <h1 className="home-title">Aquarium Maze</h1>
        <p className="home-tagline">
          <GoalPortal size={28} />
          <span>Swim, explore, and collect treasure!</span>
        </p>
      </div>

      <div className="home-actions">
        <button
          type="button"
          className="btn btn-primary btn-xl"
          onClick={() => {
            playTap(muted);
            onPlay();
          }}
        >
          Play Level {unlocked}
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-lg"
          onClick={() => {
            playTap(muted);
            onLevels();
          }}
        >
          Choose Level
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-lg"
          onClick={() => {
            playTap(muted);
            onHowTo();
          }}
        >
          How to Play
        </button>
      </div>
    </div>
  );
}
