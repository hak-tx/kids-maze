import type { Cell, Pos } from '../types';

const DIRS: [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

/** BFS shortest path from start to goal. Returns path including start. */
export function shortestPath(
  grid: Cell[][],
  start: Pos,
  goal: Pos,
): Pos[] | null {
  const R = grid.length;
  const C = grid[0].length;
  const key = (p: Pos) => `${p.r},${p.c}`;
  const prev = new Map<string, Pos | null>();
  const q: Pos[] = [start];
  prev.set(key(start), null);

  while (q.length) {
    const cur = q.shift()!;
    if (cur.r === goal.r && cur.c === goal.c) {
      const path: Pos[] = [];
      let p: Pos | null = cur;
      while (p) {
        path.push(p);
        p = prev.get(key(p)) ?? null;
      }
      return path.reverse();
    }
    for (const [dr, dc] of DIRS) {
      const nr = cur.r + dr;
      const nc = cur.c + dc;
      const n: Pos = { r: nr, c: nc };
      if (
        nr >= 0 &&
        nr < R &&
        nc >= 0 &&
        nc < C &&
        grid[nr][nc] === 0 &&
        !prev.has(key(n))
      ) {
        prev.set(key(n), cur);
        q.push(n);
      }
    }
  }
  return null;
}

/** Next cell toward goal from current (one step of shortest path). */
export function nextHintStep(
  grid: Cell[][],
  from: Pos,
  goal: Pos,
): Pos | null {
  const path = shortestPath(grid, from, goal);
  if (!path || path.length < 2) return null;
  return path[1];
}

export function isAdjacent(a: Pos, b: Pos): boolean {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;
}

export function canMove(grid: Cell[][], from: Pos, to: Pos): boolean {
  if (!isAdjacent(from, to)) return false;
  const R = grid.length;
  const C = grid[0].length;
  if (to.r < 0 || to.r >= R || to.c < 0 || to.c >= C) return false;
  return grid[to.r][to.c] === 0;
}
