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

const STEP_DIRS: [number, number][] = [
  [-2, 0],
  [2, 0],
  [0, -2],
  [0, 2],
];

export interface GenerateOptions {
  widenPasses?: number;
  /** Number of single-width loop openings (braids). Never creates rooms. */
  loopCount?: number;
  /**
   * Growing-tree random-pick chance (0 = recursive backtracker rivers,
   * 1 = Prim-like bushy trees). High values create more dead ends and
   * left/right choices.
   */
  randomPick?: number;
}

export interface MazeStats {
  deadEnds: number;
  junctions: number;
  /** Solution-path cells that have a wrong-way branch. */
  pathChoices: number;
  pathLength: number;
}

export interface GeneratedMaze {
  grid: Cell[][];
  start: Pos;
  goal: Pos;
  /** Shortest-path length from start to goal (in steps). */
  pathLength: number;
  stats: MazeStats;
}

/**
 * Perfect maze via growing tree on an odd×odd grid.
 *
 * High randomPick (default 0.62) prefers Prim-style expansion so the tree
 * is bushy: many junctions and cul-de-sacs, not one long guided corridor.
 * Outer border stays wall. Goal is the farthest floor cell — always solvable.
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
  const randomPick = options.randomPick ?? 0.62;

  const R = rows % 2 === 0 ? rows + 1 : rows;
  const C = cols % 2 === 0 ? cols + 1 : cols;
  const rand = mulberry32(seed);

  const grid: Cell[][] = Array.from({ length: R }, () =>
    Array.from({ length: C }, () => 1 as Cell),
  );

  const inBounds = (r: number, c: number) =>
    r > 0 && r < R - 1 && c > 0 && c < C - 1;

  const unvisitedNeighbors = (r: number, c: number): [number, number][] => {
    const next: [number, number][] = [];
    for (const [dr, dc] of STEP_DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (inBounds(nr, nc) && grid[nr][nc] === 1) next.push([nr, nc]);
    }
    return next;
  };

  // Growing tree: mix newest-cell (rivers) and random-cell (branches).
  const frontier: Pos[] = [{ r: 1, c: 1 }];
  grid[1][1] = 0;

  while (frontier.length) {
    const pickNewest = rand() >= randomPick;
    const idx = pickNewest
      ? frontier.length - 1
      : Math.floor(rand() * frontier.length);
    const cur = frontier[idx]!;
    const optionsN = unvisitedNeighbors(cur.r, cur.c);
    if (optionsN.length === 0) {
      frontier.splice(idx, 1);
      continue;
    }
    const [nr, nc] = optionsN[Math.floor(rand() * optionsN.length)]!;
    grid[(cur.r + nr) / 2][(cur.c + nc) / 2] = 0;
    grid[nr][nc] = 0;
    frontier.push({ r: nr, c: nc });
  }

  // Optional widening — unused by the current curve (creates open rooms).
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

  // Sparse braids: open a wall between two opposite floors only.
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
  const stats = analyzeMaze(grid, start, goal, pathLength);

  return { grid, start, goal, pathLength, stats };
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

function floorExits(grid: Cell[][], r: number, c: number): number {
  let n = 0;
  if (grid[r - 1]?.[c] === 0) n++;
  if (grid[r + 1]?.[c] === 0) n++;
  if (grid[r][c - 1] === 0) n++;
  if (grid[r][c + 1] === 0) n++;
  return n;
}

function shortestPathCells(
  grid: Cell[][],
  start: Pos,
  goal: Pos,
): Set<string> {
  const R = grid.length;
  const C = grid[0].length;
  const key = (p: Pos) => `${p.r},${p.c}`;
  const prev = new Map<string, Pos | null>();
  const q: Pos[] = [start];
  prev.set(key(start), null);

  while (q.length) {
    const cur = q.shift()!;
    if (cur.r === goal.r && cur.c === goal.c) {
      const onPath = new Set<string>();
      let p: Pos | null = cur;
      while (p) {
        onPath.add(key(p));
        p = prev.get(key(p)) ?? null;
      }
      return onPath;
    }
    for (const [dr, dc] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ] as const) {
      const n = { r: cur.r + dr, c: cur.c + dc };
      if (
        n.r >= 0 &&
        n.r < R &&
        n.c >= 0 &&
        n.c < C &&
        grid[n.r][n.c] === 0 &&
        !prev.has(key(n))
      ) {
        prev.set(key(n), cur);
        q.push(n);
      }
    }
  }
  return new Set();
}

export function analyzeMaze(
  grid: Cell[][],
  start: Pos,
  goal: Pos,
  pathLength: number,
): MazeStats {
  const R = grid.length;
  const C = grid[0].length;
  let deadEnds = 0;
  let junctions = 0;

  for (let r = 1; r < R - 1; r++) {
    for (let c = 1; c < C - 1; c++) {
      if (grid[r][c] !== 0) continue;
      const exits = floorExits(grid, r, c);
      if (exits === 1 && !(r === start.r && c === start.c)) deadEnds++;
      if (exits >= 3) junctions++;
    }
  }

  const onPath = shortestPathCells(grid, start, goal);
  let pathChoices = 0;
  for (const token of onPath) {
    const [rs, cs] = token.split(',');
    const r = Number(rs);
    const c = Number(cs);
    if (r === goal.r && c === goal.c) continue;
    const exits = floorExits(grid, r, c);
    if (exits >= 3) pathChoices++;
  }

  return { deadEnds, junctions, pathChoices, pathLength };
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
      if (floorExits(grid, r, c) === 1) n++;
    }
  }
  return n;
}
