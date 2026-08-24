import { Character } from './Character';
import { GoalPortal, MazeMark } from './Markers';
import { MuteButton } from './MuteButton';
import { playTap } from '../sound';

interface HomeProps {
  onPlay: () => void;
  onLevels: () => void;
  onHowTo: () => void;
  unlocked: number;
  muted: boolean;
  onToggleMute: () => void;
}

export function Home({
  onPlay,
  onLevels,
  onHowTo,
  unlocked,
  muted,
  onToggleMute,
}: HomeProps) {
  return (
    <div className="screen home-screen">
      <div className="sky-decor" aria-hidden="true">
        <span className="cloud cloud-a" />
        <span className="cloud cloud-b" />
        <span className="cloud cloud-c" />
        <span className="float-star s1">✦</span>
        <span className="float-star s2">★</span>
        <span className="float-star s3">✦</span>
        <span className="hill hill-left" />
        <span className="hill hill-right" />
      </div>

      <div className="home-top">
        <MuteButton muted={muted} onToggle={onToggleMute} />
      </div>

      <div className="home-hero">
        <div className="home-logo" aria-hidden="true">
          <MazeMark size={88} />
          <div className="home-buddy">
            <Character size={52} />
          </div>
        </div>
        <h1 className="home-title">Kids Maze</h1>
        <p className="home-tagline">
          <GoalPortal size={28} />
          <span>Wiggle to the glowing star!</span>
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
