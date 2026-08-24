import type { Cell, Pos } from '../types';

/** Mulberry32 seeded PRNG — deterministic across sessions. */
export function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface GenerateOptions {
  widenPasses?: number;
  /** Number of single-width loop openings (braids). Never creates rooms. */
  loopCount?: number;
}

export interface GeneratedMaze {
  grid: Cell[][];
  start: Pos;
  goal: Pos;
  /** Shortest-path length from start to goal (in steps). */
  pathLength: number;
}

/**
 * Perfect maze via recursive backtracker on odd×odd grid.
 * Outer border is always wall. Start/goal are floor cells.
 * Goal is the farthest floor cell from start — always solvable.
 */
export function generateMaze(
  rows: number,
  cols: number,
  seed: number,
  widenPassesOrOptions: number | GenerateOptions = 0,
): GeneratedMaze {
  const options: GenerateOptions =
    typeof widenPassesOrOptions === 'number'
      ? { widenPasses: widenPassesOrOptions, loopCount: 0 }
      : widenPassesOrOptions;
  const widenPasses = options.widenPasses ?? 0;
  const loopCount = options.loopCount ?? 0;

  // Ensure odd dimensions so carving lands on cell centers
  const R = rows % 2 === 0 ? rows + 1 : rows;
  const C = cols % 2 === 0 ? cols + 1 : cols;
  const rand = mulberry32(seed);

  const grid: Cell[][] = Array.from({ length: R }, () =>
    Array.from({ length: C }, () => 1 as Cell),
  );

  const inBounds = (r: number, c: number) =>
    r > 0 && r < R - 1 && c > 0 && c < C - 1;

  const carve = (r: number, c: number) => {
    grid[r][c] = 0;
    const dirs = shuffle(
      [
        [-2, 0],
        [2, 0],
        [0, -2],
        [0, 2],
      ] as [number, number][],
      rand,
    );
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (inBounds(nr, nc) && grid[nr][nc] === 1) {
        grid[r + dr / 2][c + dc / 2] = 0;
        carve(nr, nc);
      }
    }
  };

  carve(1, 1);

  // Optional widening — unused by the new curve (creates open rooms).
  for (let pass = 0; pass < widenPasses; pass++) {
    const candidates: Pos[] = [];
    for (let r = 1; r < R - 1; r++) {
      for (let c = 1; c < C - 1; c++) {
        if (grid[r][c] !== 1) continue;
        const neighbors =
          (grid[r - 1][c] === 0 ? 1 : 0) +
          (grid[r + 1][c] === 0 ? 1 : 0) +
          (grid[r][c - 1] === 0 ? 1 : 0) +
          (grid[r][c + 1] === 0 ? 1 : 0);
        if (neighbors >= 2) candidates.push({ r, c });
      }
    }
    const picks = shuffle(candidates, rand).slice(
      0,
      Math.max(2, Math.floor(candidates.length * 0.12)),
    );
    for (const p of picks) grid[p.r][p.c] = 0;
  }

  // Sparse braids: open a wall that sits between two opposite floors only.
  // That adds a loop without turning corridors into rooms.
  if (loopCount > 0) {
    const braids: Pos[] = [];
    for (let r = 1; r < R - 1; r++) {
      for (let c = 1; c < C - 1; c++) {
        if (grid[r][c] !== 1) continue;
        const up = grid[r - 1][c] === 0;
        const down = grid[r + 1][c] === 0;
        const left = grid[r][c - 1] === 0;
        const right = grid[r][c + 1] === 0;
        const vertical = up && down && !left && !right;
        const horizontal = left && right && !up && !down;
        if (vertical || horizontal) braids.push({ r, c });
      }
    }
    const picks = shuffle(braids, rand).slice(0, loopCount);
    for (const p of picks) grid[p.r][p.c] = 0;
  }

  const start: Pos = { r: 1, c: 1 };
  const { pos: goal, dist: pathLength } = farthestCell(grid, start);

  return { grid, start, goal, pathLength };
}

function farthestCell(
  grid: Cell[][],
  start: Pos,
): { pos: Pos; dist: number } {
  const R = grid.length;
  const C = grid[0].length;
  const dist: number[][] = Array.from({ length: R }, () =>
    Array.from({ length: C }, () => -1),
  );
  const q: Pos[] = [start];
  dist[start.r][start.c] = 0;
  let far = start;

  while (q.length) {
    const cur = q.shift()!;
    if (dist[cur.r][cur.c] > dist[far.r][far.c]) far = cur;
    for (const [dr, dc] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ] as const) {
      const nr = cur.r + dr;
      const nc = cur.c + dc;
      if (
        nr >= 0 &&
        nr < R &&
        nc >= 0 &&
        nc < C &&
        grid[nr][nc] === 0 &&
        dist[nr][nc] === -1
      ) {
        dist[nr][nc] = dist[cur.r][cur.c] + 1;
        q.push({ r: nr, c: nc });
      }
    }
  }
  return { pos: far, dist: dist[far.r][far.c] };
}

/** Count single-exit floor cells (dead ends), excluding start. */
export function countDeadEnds(grid: Cell[][], start: Pos): number {
  const R = grid.length;
  const C = grid[0].length;
  let n = 0;
  for (let r = 1; r < R - 1; r++) {
    for (let c = 1; c < C - 1; c++) {
      if (grid[r][c] !== 0) continue;
      if (r === start.r && c === start.c) continue;
      let exits = 0;
      if (grid[r - 1][c] === 0) exits++;
      if (grid[r + 1][c] === 0) exits++;
      if (grid[r][c - 1] === 0) exits++;
      if (grid[r][c + 1] === 0) exits++;
      if (exits === 1) n++;
    }
  }
  return n;
}
