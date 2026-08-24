interface HomeProps {
  onPlay: () => void;
  onLevels: () => void;
  onHowTo: () => void;
  unlocked: number;
}

export function Home({ onPlay, onLevels, onHowTo, unlocked }: HomeProps) {
  return (
    <div className="screen home-screen">
      <div className="home-hero">
        <div className="home-logo" aria-hidden="true">
          <span className="home-emoji">🧩</span>
        </div>
        <h1 className="home-title">Kids Maze</h1>
        <p className="home-tagline">Find the star. Have fun!</p>
      </div>

      <div className="home-actions">
        <button type="button" className="btn btn-primary btn-xl" onClick={onPlay}>
          Play Level {unlocked}
        </button>
        <button type="button" className="btn btn-secondary btn-lg" onClick={onLevels}>
          Choose Level
        </button>
        <button type="button" className="btn btn-ghost btn-lg" onClick={onHowTo}>
          How to Play
        </button>
      </div>
    </div>
  );
}
