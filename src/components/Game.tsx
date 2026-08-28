import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CharacterId, Pos } from '../types';
import { getLevel, LEVELS } from '../maze/levels';
import { generateMaze } from '../maze/generate';
import { canMove, nextHintStep } from '../maze/pathfind';
import { generateCoins, posKey } from '../game/coins';
import { playCoin, playHint, playMove, playWin } from '../sound';
import { MazeBoard } from './MazeBoard';
import { MuteButton } from './MuteButton';
import { WinModal } from './WinModal';
import { CoinBadge } from './CoinBadge';

interface GameProps {
  levelId: number;
  onWin: (levelId: number) => void;
  onHome: () => void;
  onSelectLevel: (id: number) => void;
  muted: boolean;
  onToggleMute: () => void;
  coinTotal: number;
  characterId: CharacterId;
  onCollectCoin: (amount?: number) => void;
  onShop: () => void;
}

export function Game(props: GameProps) {
  const [roundKey, setRoundKey] = useState(0);
  return <GameRound key={`${props.levelId}-${roundKey}`} {...props} onRestart={() => setRoundKey((key) => key + 1)} />;
}

function GameRound({
  levelId,
  onWin,
  onHome,
  onSelectLevel,
  muted,
  onToggleMute,
  coinTotal,
  characterId,
  onCollectCoin,
  onShop,
  onRestart,
}: GameProps & { onRestart: () => void }) {
  const config = getLevel(levelId)!;
  const maze = useMemo(
    () => generateMaze(config.rows, config.cols, config.seed, {
      widenPasses: config.widenPasses,
      loopCount: config.loopCount,
    }),
    [config],
  );
  const [player, setPlayer] = useState<Pos>(maze.start);
  const [won, setWon] = useState(false);
  const [hintCell, setHintCell] = useState<Pos | null>(null);
  const [coins, setCoins] = useState(() => generateCoins(maze.grid, maze.start, maze.goal, levelId));
  const [roundCoins, setRoundCoins] = useState(0);
  const coinKeys = useMemo(() => new Set(coins.map(posKey)), [coins]);

  const moveTo = useCallback(
    (to: Pos) => {
      if (won) return;
      setPlayer(to);
      setHintCell(null);

      const foundCoin = coinKeys.has(posKey(to));
      if (foundCoin) {
        setCoins((current) => current.filter((coin) => posKey(coin) !== posKey(to)));
        setRoundCoins((count) => count + 1);
        onCollectCoin(1);
        playCoin(muted);
      }

      if (to.r === maze.goal.r && to.c === maze.goal.c) {
        setWon(true);
        playWin(muted);
        onWin(levelId);
      } else if (!foundCoin) {
        playMove(muted);
      }
    },
    [won, coinKeys, maze.goal, onCollectCoin, muted, onWin, levelId],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (won) return;
      const map: Record<string, Pos> = {
        ArrowUp: { r: player.r - 1, c: player.c },
        ArrowDown: { r: player.r + 1, c: player.c },
        ArrowLeft: { r: player.r, c: player.c - 1 },
        ArrowRight: { r: player.r, c: player.c + 1 },
        w: { r: player.r - 1, c: player.c }, W: { r: player.r - 1, c: player.c },
        s: { r: player.r + 1, c: player.c }, S: { r: player.r + 1, c: player.c },
        a: { r: player.r, c: player.c - 1 }, A: { r: player.r, c: player.c - 1 },
        d: { r: player.r, c: player.c + 1 }, D: { r: player.r, c: player.c + 1 },
      };
      const next = map[event.key];
      if (!next) return;
      event.preventDefault();
      if (canMove(maze.grid, player, next)) moveTo(next);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [player, maze.grid, moveTo, won]);

  const showHint = () => {
    if (won) return;
    setHintCell(nextHintStep(maze.grid, player, maze.goal));
    playHint(muted);
  };

  return (
    <div className={`screen play-screen theme-${config.theme}`}>
      <header className="play-header">
        <button type="button" className="btn btn-ghost btn-icon" onClick={onHome} aria-label="Home">⌂</button>
        <div className="play-title">
          <span className="play-level">Level {levelId}</span>
          <span className="play-name">{config.name}</span>
        </div>
        <button type="button" className="hud-shop-button" onClick={onShop} aria-label="Open Aquarium Shop">
          <CoinBadge coins={coinTotal} compact />
          <span>Shop</span>
        </button>
        <button type="button" className="btn btn-hint" onClick={showHint} disabled={won}>💡 Hint</button>
      </header>

      <MazeBoard
        grid={maze.grid}
        start={maze.start}
        goal={maze.goal}
        player={player}
        coins={coins}
        characterId={characterId}
        hintCell={hintCell}
        onMove={moveTo}
        won={won}
        theme={config.theme}
      />

      <footer className="play-footer">
        <MuteButton muted={muted} onToggle={onToggleMute} />
        <span className="round-coin-count">Found this maze: <strong>{roundCoins}</strong></span>
        <button type="button" className="btn btn-secondary btn-lg" onClick={onRestart}>Restart</button>
      </footer>

      {won && (
        <WinModal
          levelId={levelId}
          levelName={config.name}
          hasNext={levelId < LEVELS.length}
          characterId={characterId}
          coinsCollected={roundCoins}
          onNext={() => onSelectLevel(levelId + 1)}
          onReplay={onRestart}
          onHome={onHome}
        />
      )}
    </div>
  );
}
