import { LEVELS } from '../maze/levels';
import type { Difficulty, MazeTheme } from '../types';

interface LevelSelectProps {
  unlocked: number;
  completed: number[];
  onSelect: (id: number) => void;
  onBack: () => void;
}

const DIFF_LABEL: Record<Difficulty, string> = {
  easy: 'Trail',
  medium: 'Trek',
  hard: 'Quest',
  legend: 'Legend',
};

const THEME_ICON: Record<MazeTheme, string> = {
  meadow: '🌿',
  hedge: '🌳',
  orchard: '🍎',
  river: '💧',
  forest: '🌲',
  canyon: '🧡',
  sunset: '🌅',
  tide: '🌊',
  crystal: '💎',
  lava: '🔥',
  storm: '⚡',
  aurora: '✨',
  moon: '🌙',
  dragon: '🐉',
  galaxy: '🪐',
  champion: '🏆',
  pearl: '🤍',
  shipwreck: '⚓',
  bioluminescent: '🪼',
  iceberg: '🧊',
  mangrove: '🌴',
  whirlpool: '🌀',
  treasure: '🪙',
  smoker: '🌋',
};

export function LevelSelect({
  unlocked,
  completed,
  onSelect,
  onBack,
}: LevelSelectProps) {
  return (
    <div className="screen levels-screen">
      <header className="screen-header">
        <button type="button" className="btn btn-ghost btn-icon" onClick={onBack} aria-label="Back">
          ←
        </button>
        <h2>Levels</h2>
        <span className="spacer" />
      </header>

      <div className="level-grid">
        {LEVELS.map((lvl) => {
          const open = lvl.id <= unlocked;
          const done = completed.includes(lvl.id);
          return (
            <button
              key={lvl.id}
              type="button"
              className={`level-card theme-${lvl.theme} diff-${lvl.difficulty} ${open ? '' : 'locked'} ${done ? 'done' : ''}`}
              disabled={!open}
              onClick={() => open && onSelect(lvl.id)}
              aria-label={
                open
                  ? `Level ${lvl.id}: ${lvl.name}, ${DIFF_LABEL[lvl.difficulty]}, ${lvl.rows} by ${lvl.cols}`
                  : `Level ${lvl.id} locked`
              }
            >
              <span className="level-stripe" aria-hidden="true" />
              {open && (
                <span className="level-theme-icon" aria-hidden="true">
                  {THEME_ICON[lvl.theme]}
                </span>
              )}
              <span className="level-num">{open ? lvl.id : '🔒'}</span>
              <span className="level-name">{open ? lvl.name : 'Locked'}</span>
              <span className="level-meta">
                <span className="level-diff">{DIFF_LABEL[lvl.difficulty]}</span>
                {open && (
                  <span className="level-size">
                    {lvl.rows}×{lvl.cols}
                  </span>
                )}
              </span>
              {done && (
                <span className="level-star" aria-hidden="true">
                  ★
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
