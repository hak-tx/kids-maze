import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Pos } from '../types';
import { getLevel, LEVELS } from '../maze/levels';
import { generateMaze } from '../maze/generate';
import { canMove, nextHintStep } from '../maze/pathfind';
import { playHint, playMove, playWin } from '../sound';
import { MazeBoard } from './MazeBoard';
import { MuteButton } from './MuteButton';
import { WinModal } from './WinModal';

interface GameProps {
  levelId: number;
  onWin: (levelId: number) => void;
  onHome: () => void;
  onSelectLevel: (id: number) => void;
  muted: boolean;
  onToggleMute: () => void;
}

export function Game({
  levelId,
  onWin,
  onHome,
  onSelectLevel,
  muted,
  onToggleMute,
}: GameProps) {
  const config = getLevel(levelId)!;

  const maze = useMemo(
    () =>
      generateMaze(config.rows, config.cols, config.seed, {
        widenPasses: config.widenPasses,
        loopCount: config.loopCount,
      }),
    [config],
  );

  const [player, setPlayer] = useState<Pos>(maze.start);
  const [won, setWon] = useState(false);
  const [hintCell, setHintCell] = useState<Pos | null>(null);
  const [moveKey, setMoveKey] = useState(0);

  useEffect(() => {
    setPlayer(maze.start);
    setWon(false);
    setHintCell(null);
  }, [maze, moveKey]);

  const moveTo = useCallback(
    (to: Pos) => {
      if (won) return;
      setPlayer(to);
      setHintCell(null);
      if (to.r === maze.goal.r && to.c === maze.goal.c) {
        setWon(true);
        playWin(muted);
        onWin(levelId);
      } else {
        playMove(muted);
      }
    },
    [won, maze.goal, onWin, levelId, muted],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (won) return;
      const map: Record<string, Pos> = {
        ArrowUp: { r: player.r - 1, c: player.c },
        ArrowDown: { r: player.r + 1, c: player.c },
        ArrowLeft: { r: player.r, c: player.c - 1 },
        ArrowRight: { r: player.r, c: player.c + 1 },
        w: { r: player.r - 1, c: player.c },
        W: { r: player.r - 1, c: player.c },
        s: { r: player.r + 1, c: player.c },
        S: { r: player.r + 1, c: player.c },
        a: { r: player.r, c: player.c - 1 },
        A: { r: player.r, c: player.c - 1 },
        d: { r: player.r, c: player.c + 1 },
        D: { r: player.r, c: player.c + 1 },
      };
      const next = map[e.key];
      if (!next) return;
      e.preventDefault();
      if (canMove(maze.grid, player, next)) moveTo(next);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [player, maze.grid, moveTo, won]);

  const showHint = () => {
    if (won) return;
    const next = nextHintStep(maze.grid, player, maze.goal);
    setHintCell(next);
    playHint(muted);
  };

  const hasNext = levelId < LEVELS.length;

  return (
    <div className={`screen play-screen theme-${config.theme}`}>
      <header className="play-header">
        <button
          type="button"
          className="btn btn-ghost btn-icon"
          onClick={onHome}
          aria-label="Home"
        >
          ⌂
        </button>
        <div className="play-title">
          <span className="play-level">Level {levelId}</span>
          <span className="play-name">{config.name}</span>
        </div>
        <button
          type="button"
          className="btn btn-hint"
          onClick={showHint}
          disabled={won}
        >
          💡 Hint
        </button>
      </header>

      <MazeBoard
        key={`${levelId}-${moveKey}`}
        grid={maze.grid}
        start={maze.start}
        goal={maze.goal}
        player={player}
        hintCell={hintCell}
        onMove={moveTo}
        won={won}
        theme={config.theme}
      />

      <footer className="play-footer">
        <MuteButton muted={muted} onToggle={onToggleMute} />
        <button
          type="button"
          className="btn btn-secondary btn-lg"
          onClick={() => {
            setMoveKey((k) => k + 1);
          }}
        >
          Restart
        </button>
      </footer>

      {won && (
        <WinModal
          levelId={levelId}
          levelName={config.name}
          hasNext={hasNext}
          onNext={() => onSelectLevel(levelId + 1)}
          onReplay={() => setMoveKey((k) => k + 1)}
          onHome={onHome}
        />
      )}
    </div>
  );
}
