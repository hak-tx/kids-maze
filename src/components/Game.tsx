import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CharacterId, FlyingCoin, Pos } from '../types';
import { bonusSecondsForLevel, getLevel, LEVELS } from '../maze/levels';
import { generateMaze } from '../maze/generate';
import { canMove } from '../maze/pathfind';
import { coinSuckDurationMs, generateCoins, magnetizedCoins, posKey } from '../game/coins';
import { getCharacter } from '../game/characters';
import { playCoin, playMove, playWin } from '../sound';
import { MazeBoard } from './MazeBoard';
import { MuteButton } from './MuteButton';
import { WinModal } from './WinModal';
import { CoinBadge } from './CoinBadge';
import { BonusTimer } from './BonusTimer';

interface GameProps {
  levelId: number;
  onWin: (levelId: number) => void;
  onHome: () => void;
  onSelectLevel: (id: number) => void;
  muted: boolean;
  onToggleMute: () => void;
  coinTotal: number;
  ownedCharacters: CharacterId[];
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
  ownedCharacters,
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
      randomPick: config.randomPick,
    }),
    [config],
  );
  const bonusMs = bonusSecondsForLevel(config) * 1000;
  const [player, setPlayer] = useState<Pos>(maze.start);
  const [won, setWon] = useState(false);
  const [coins, setCoins] = useState(() => generateCoins(maze.grid, maze.start, maze.goal, levelId));
  const coinsRef = useRef(coins);
  const [flyingCoins, setFlyingCoins] = useState<FlyingCoin[]>([]);
  const flyingIdRef = useRef(0);
  const [roundCoins, setRoundCoins] = useState(0);
  const roundCoinsRef = useRef(0);
  const [bonusRemainingMs, setBonusRemainingMs] = useState(bonusMs);
  const [bonusActive, setBonusActive] = useState(true);
  const [earnedBonus, setEarnedBonus] = useState(false);
  const [paused, setPaused] = useState(false);
  const bonusActiveRef = useRef(true);
  const wonRef = useRef(false);
  const pausedRef = useRef(false);
  const magnetRadius = getCharacter(characterId).magnetRadius;

  const setPausedState = useCallback((next: boolean) => {
    pausedRef.current = next;
    setPaused(next);
  }, []);

  const togglePaused = useCallback(() => {
    if (wonRef.current) return;
    setPausedState(!pausedRef.current);
  }, [setPausedState]);

  useEffect(() => {
    let pausedAt: number | null =
      document.hidden || pausedRef.current ? performance.now() : null;
    let pausedMs = 0;
    const started = performance.now();

    const timerFrozen = () => document.hidden || pausedRef.current || wonRef.current;

    const syncFreeze = () => {
      if (timerFrozen()) {
        if (pausedAt == null) pausedAt = performance.now();
        return;
      }
      if (pausedAt != null) {
        pausedMs += performance.now() - pausedAt;
        pausedAt = null;
      }
    };

    const onVisibility = () => {
      syncFreeze();
    };
    document.addEventListener('visibilitychange', onVisibility);

    let frame = 0;
    const tick = (now: number) => {
      syncFreeze();
      if (!wonRef.current && !document.hidden && !pausedRef.current) {
        const elapsed = now - started - pausedMs;
        const remaining = Math.max(0, bonusMs - elapsed);
        setBonusRemainingMs(remaining);
        if (remaining <= 0 && bonusActiveRef.current) {
          bonusActiveRef.current = false;
          setBonusActive(false);
        }
      }
      if (!wonRef.current && bonusActiveRef.current) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [bonusMs]);

  const finishFlyingCoin = useCallback((id: string) => {
    setFlyingCoins((current) => current.filter((coin) => coin.id !== id));
  }, []);

  const moveTo = useCallback(
    (to: Pos) => {
      if (won || paused) return;
      setPlayer(to);

      const collectedCoins = magnetizedCoins(maze.grid, to, coinsRef.current, magnetRadius);
      if (collectedCoins.length > 0) {
        const collectedKeys = new Set(collectedCoins.map(posKey));
        const remainingCoins = coinsRef.current.filter((coin) => !collectedKeys.has(posKey(coin)));
        coinsRef.current = remainingCoins;
        setCoins(remainingCoins);
        const incoming = collectedCoins.map((coin, index) => {
          flyingIdRef.current += 1;
          return {
            id: `fly-${flyingIdRef.current}`,
            from: coin,
            to,
            durationMs: coinSuckDurationMs(coin, to),
            delayMs: Math.min(index * 18, 72),
          };
        });
        setFlyingCoins((current) => [...current, ...incoming]);
        roundCoinsRef.current += collectedCoins.length;
        setRoundCoins(roundCoinsRef.current);
        onCollectCoin(collectedCoins.length);
        playCoin(muted);
      }

      if (to.r === maze.goal.r && to.c === maze.goal.c) {
        const hitBonus = bonusActiveRef.current;
        wonRef.current = true;
        setEarnedBonus(hitBonus);
        if (hitBonus && roundCoinsRef.current > 0) {
          onCollectCoin(roundCoinsRef.current);
        }
        setWon(true);
        playWin(muted);
        onWin(levelId);
      } else if (collectedCoins.length === 0) {
        playMove(muted);
      }
    },
    [won, paused, maze.grid, maze.goal, magnetRadius, onCollectCoin, muted, onWin, levelId],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (won || paused) return;
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
  }, [player, maze.grid, moveTo, won, paused]);

  // Wide boards keep a top/bottom HUD in landscape; square/tall boards use side rails.
  const mazeCols = maze.grid[0]?.length ?? config.cols;
  const mazeRows = maze.grid.length;
  const mazeAspect = mazeCols > mazeRows ? 'maze-wide' : 'maze-fit-sides';

  return (
    <div className={`screen play-screen theme-${config.theme} ${mazeAspect}`}>
      <header className="play-header play-rail-left">
        <button type="button" className="btn btn-ghost btn-icon" onClick={onHome} aria-label="Home">⌂</button>
        <div className="play-title">
          <span className="play-level">Level {levelId}</span>
          <span className="play-name">{config.name}</span>
        </div>
        <div className="hud-coin-counter">
          <CoinBadge coins={coinTotal} compact />
          <span>Coins</span>
        </div>
        <button type="button" className="btn btn-hint" onClick={onShop} disabled={won} aria-label="Open Aquarium Shop">🛒 Shop</button>
      </header>

      <aside className="play-rail-right">
        {!won && (
          <div className="play-bonus-row">
            <BonusTimer remainingMs={bonusRemainingMs} active={bonusActive} paused={paused} />
            <button
              type="button"
              className="btn btn-pause"
              onClick={togglePaused}
              aria-pressed={paused}
              aria-label={paused ? 'Resume bonus timer and movement' : 'Pause bonus timer and movement'}
            >
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>
          </div>
        )}
        <footer className="play-footer">
          <MuteButton muted={muted} onToggle={onToggleMute} />
          <span className="round-coin-count">Found this maze: <strong>{roundCoins}</strong></span>
          <button type="button" className="btn btn-secondary btn-lg" onClick={onRestart}>Restart</button>
        </footer>
      </aside>

      <div className="play-maze-stage">
        <MazeBoard
          grid={maze.grid}
          start={maze.start}
          goal={maze.goal}
          player={player}
          coins={coins}
          flyingCoins={flyingCoins}
          onFlyingCoinDone={finishFlyingCoin}
          characterId={characterId}
          hintCell={null}
          onMove={moveTo}
          won={won}
          paused={paused}
          theme={config.theme}
        />
        {paused && !won && (
          <div className="pause-overlay" role="dialog" aria-modal="true" aria-labelledby="pause-title">
            <div className="pause-card">
              <p id="pause-title">Paused</p>
              <p className="pause-sub">Timer is frozen — tap to swim again</p>
              <button
                type="button"
                className="btn btn-primary btn-xl"
                onClick={() => setPausedState(false)}
              >
                ▶ Resume
              </button>
            </div>
          </div>
        )}
      </div>

      {won && (
        <WinModal
          levelId={levelId}
          levelName={config.name}
          hasNext={levelId < LEVELS.length}
          characterId={characterId}
          coinsCollected={roundCoins}
          bonusHit={earnedBonus}
          coinTotal={coinTotal}
          ownedCharacters={ownedCharacters}
          onShop={onShop}
          onNext={() => onSelectLevel(levelId + 1)}
          onReplay={onRestart}
          onHome={onHome}
        />
      )}
    </div>
  );
}
