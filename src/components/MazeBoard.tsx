import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import type { Cell, CharacterId, FlyingCoin, MazeTheme, Pos } from '../types';
import { canMove } from '../maze/pathfind';
import { posKey } from '../game/coins';
import { Character } from './Character';
import { GoalPortal, StartFlag } from './Markers';

interface MazeBoardProps {
  grid: Cell[][];
  start: Pos;
  goal: Pos;
  player: Pos;
  coins: Pos[];
  flyingCoins: FlyingCoin[];
  onFlyingCoinDone: (id: string) => void;
  characterId: CharacterId;
  hintCell: Pos | null;
  onMove: (to: Pos) => void;
  won: boolean;
  paused?: boolean;
  theme: MazeTheme;
}

export function MazeBoard({
  grid,
  start,
  goal,
  player,
  coins,
  flyingCoins,
  onFlyingCoinDone,
  characterId,
  hintCell,
  onMove,
  won,
  paused = false,
  theme,
}: MazeBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [cellPx, setCellPx] = useState(40);
  const dragging = useRef(false);
  const lastCell = useRef<Pos | null>(null);

  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  // Fit every board into the available viewport, including 25x25 phone layouts.
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const host = el.closest('.maze-board-wrap') ?? el.parentElement ?? el;
    const fit = () => {
      const availW = host.clientWidth - 8;
      const availH = host.clientHeight - 8;
      const byW = Math.floor(availW / cols);
      const byH = Math.floor(availH / rows);
      const size = Math.max(11, Math.min(52, byW, byH));
      setCellPx(size);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(host);
    return () => ro.disconnect();
  }, [rows, cols]);

  const cellFromPoint = useCallback(
    (clientX: number, clientY: number): Pos | null => {
      const el = boardRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const c = Math.floor(x / cellPx);
      const r = Math.floor(y / cellPx);
      if (r < 0 || r >= rows || c < 0 || c >= cols) return null;
      return { r, c };
    },
    [cellPx, rows, cols],
  );

  const locked = won || paused;

  useEffect(() => {
    if (paused) dragging.current = false;
  }, [paused]);

  const tryStep = useCallback(
    (to: Pos, from: Pos) => {
      if (won || paused) return;
      if (canMove(grid, from, to)) {
        onMove(to);
        lastCell.current = to;
      }
    },
    [grid, onMove, won, paused],
  );

  const onPointerDown = (e: ReactPointerEvent) => {
    if (locked) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    dragging.current = true;
    lastCell.current = player;
    const cell = cellFromPoint(e.clientX, e.clientY);
    if (cell && canMove(grid, player, cell)) {
      tryStep(cell, player);
    }
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging.current || locked) return;
    const cell = cellFromPoint(e.clientX, e.clientY);
    if (!cell) return;
    const from = lastCell.current ?? player;
    if (cell.r === from.r && cell.c === from.c) return;
    if (canMove(grid, from, cell)) {
      tryStep(cell, from);
    } else {
      const candidates: Pos[] = [
        { r: from.r - 1, c: from.c },
        { r: from.r + 1, c: from.c },
        { r: from.r, c: from.c - 1 },
        { r: from.r, c: from.c + 1 },
      ];
      let best: Pos | null = null;
      let bestD = Infinity;
      for (const cand of candidates) {
        if (!canMove(grid, from, cand)) continue;
        const d = Math.abs(cand.r - cell.r) + Math.abs(cand.c - cell.c);
        if (d < bestD) {
          bestD = d;
          best = cand;
        }
      }
      if (best && bestD < Math.abs(from.r - cell.r) + Math.abs(from.c - cell.c)) {
        tryStep(best, from);
      }
    }
  };

  const endDrag = () => {
    dragging.current = false;
  };

  const charSize = useMemo(() => Math.max(10, cellPx * 0.9), [cellPx]);
  const markSize = useMemo(() => Math.max(9, cellPx * 0.72), [cellPx]);
  const coinKeys = useMemo(() => new Set(coins.map(posKey)), [coins]);

  return (
    <div className="maze-board-wrap">
      <div
        className="maze-board-stack"
        style={{ width: cols * cellPx, height: rows * cellPx }}
      >
        <div
          ref={boardRef}
          className={`maze-board theme-${theme}`}
          data-theme={theme}
          style={{
            width: cols * cellPx,
            height: rows * cellPx,
            gridTemplateColumns: `repeat(${cols}, ${cellPx}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellPx}px)`,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
          role="application"
          aria-label="Maze board"
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isWall = cell === 1;
              const isStart = r === start.r && c === start.c;
              const isGoal = r === goal.r && c === goal.c;
              const isPlayer = r === player.r && c === player.c;
              const isCoin = coinKeys.has(posKey({ r, c }));
              const isHint =
                hintCell && r === hintCell.r && c === hintCell.c && !isPlayer;
              const floorTone = (r + c) % 2 === 0 ? 'floor-a' : 'floor-b';
              return (
                <div
                  key={`${r}-${c}`}
                  className={[
                    'maze-cell',
                    isWall ? 'wall' : floorTone,
                    isStart && !isPlayer ? 'start-cell' : '',
                    isGoal ? 'goal-cell' : '',
                    isCoin ? 'coin-cell' : '',
                    isHint ? 'hint-pulse' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ width: cellPx, height: cellPx }}
                  data-cell={isWall ? 'wall' : 'floor'}
                  data-row={r}
                  data-col={c}
                  data-player={isPlayer || undefined}
                  data-coin={isCoin || undefined}
                >
                  {isStart && !isPlayer && !isGoal && <StartFlag size={markSize} />}
                  {isGoal && <GoalPortal size={markSize} />}
                  {isCoin && !isPlayer && (
                    <img className="maze-coin" src="/aquarium/coin.png" alt="Coin" />
                  )}
                  {isPlayer && (
                    <div className={`player-wrap${won ? ' won' : ''}`}>
                      <Character id={characterId} size={charSize} celebrating={won} />
                    </div>
                  )}
                </div>
              );
            }),
          )}
        </div>
        {flyingCoins.length > 0 && (
          <div className="maze-coin-fx" aria-hidden="true">
            {flyingCoins.map((fx) => (
              <FlyingCoinSprite
                key={fx.id}
                fx={fx}
                cellPx={cellPx}
                onDone={onFlyingCoinDone}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FlyingCoinSprite({
  fx,
  cellPx,
  onDone,
}: {
  fx: FlyingCoin;
  cellPx: number;
  onDone: (id: string) => void;
}) {
  const [sucking, setSucking] = useState(false);
  const dx = (fx.to.c - fx.from.c) * cellPx;
  const dy = (fx.to.r - fx.from.r) * cellPx;

  useEffect(() => {
    let frameA = 0;
    let frameB = 0;
    frameA = window.requestAnimationFrame(() => {
      frameB = window.requestAnimationFrame(() => setSucking(true));
    });
    const timer = window.setTimeout(
      () => onDone(fx.id),
      fx.delayMs + fx.durationMs + 80,
    );
    return () => {
      window.cancelAnimationFrame(frameA);
      window.cancelAnimationFrame(frameB);
      window.clearTimeout(timer);
    };
  }, [fx.delayMs, fx.durationMs, fx.id, onDone]);

  const style: CSSProperties = {
    width: cellPx,
    height: cellPx,
    left: fx.from.c * cellPx,
    top: fx.from.r * cellPx,
    transform: sucking
      ? `translate3d(${dx}px, ${dy}px, 0) scale(0)`
      : 'translate3d(0, 0, 0) scale(1.06)',
    transition: sucking
      ? `transform ${fx.durationMs}ms cubic-bezier(0.62, 0.02, 0.92, 0.28) ${fx.delayMs}ms`
      : 'none',
  };

  return (
    <span
      className="flying-coin"
      data-flying-coin={fx.id}
      data-sucking={sucking || undefined}
      style={style}
      onTransitionEnd={(event) => {
        if (event.target === event.currentTarget && event.propertyName === 'transform') {
          onDone(fx.id);
        }
      }}
    >
      <img src="/aquarium/coin.png" alt="" />
    </span>
  );
}
