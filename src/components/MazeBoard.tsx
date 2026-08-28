import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import type { Cell, CharacterId, MazeTheme, Pos } from '../types';
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
  characterId: CharacterId;
  hintCell: Pos | null;
  onMove: (to: Pos) => void;
  won: boolean;
  theme: MazeTheme;
}

export function MazeBoard({
  grid,
  start,
  goal,
  player,
  coins,
  characterId,
  hintCell,
  onMove,
  won,
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
    const fit = () => {
      const parent = el.parentElement;
      if (!parent) return;
      const availW = parent.clientWidth - 8;
      const availH = parent.clientHeight - 8;
      const byW = Math.floor(availW / cols);
      const byH = Math.floor(availH / rows);
      const size = Math.max(11, Math.min(52, byW, byH));
      setCellPx(size);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el.parentElement ?? el);
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

  const tryStep = useCallback(
    (to: Pos, from: Pos) => {
      if (won) return;
      if (canMove(grid, from, to)) {
        onMove(to);
        lastCell.current = to;
      }
    },
    [grid, onMove, won],
  );

  const onPointerDown = (e: ReactPointerEvent) => {
    if (won) return;
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
    if (!dragging.current || won) return;
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
    </div>
  );
}
