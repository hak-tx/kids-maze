import type { Cell, Pos } from '../types';
import { LEVELS } from '../maze/levels';

const posKey = (pos: Pos) => `${pos.r}:${pos.c}`;

export function coinCountForLevel(levelId: number) {
  return 9 + Math.floor((levelId - 1) / 2);
}

/** 200 coins across the current 16-level adventure. */
export const COINS_PER_FULL_ADVENTURE = LEVELS.reduce(
  (total, level) => total + coinCountForLevel(level.id),
  0,
);

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

function openNeighborCount(grid: Cell[][], pos: Pos) {
  const neighbors = [
    [pos.r - 1, pos.c],
    [pos.r + 1, pos.c],
    [pos.r, pos.c - 1],
    [pos.r, pos.c + 1],
  ];
  return neighbors.filter(([r, c]) => grid[r]?.[c] === 0).length;
}

/** Randomly fills both useful corridors and tempting dead ends on every round. */
export function generateCoins(
  grid: Cell[][],
  start: Pos,
  goal: Pos,
  levelId: number,
) {
  const excluded = new Set([posKey(start), posKey(goal)]);
  const floors: Pos[] = [];

  grid.forEach((row, r) => {
    row.forEach((cell, c) => {
      const pos = { r, c };
      if (cell === 0 && !excluded.has(posKey(pos))) floors.push(pos);
    });
  });

  const count = Math.min(floors.length, coinCountForLevel(levelId));
  const deadEnds = shuffle(floors.filter((pos) => openNeighborCount(grid, pos) === 1));
  const chosen = deadEnds.slice(0, Math.min(2, deadEnds.length));
  const chosenKeys = new Set(chosen.map(posKey));
  const remaining = shuffle(floors.filter((pos) => !chosenKeys.has(posKey(pos))));
  return [...chosen, ...remaining.slice(0, Math.max(0, count - chosen.length))];
}

/**
 * Coins reached by a swimmer's magnet after moving to `from`.
 * Distance follows open maze corridors so magnets never pull through walls.
 */
export function magnetizedCoins(
  grid: Cell[][],
  from: Pos,
  coins: Pos[],
  radius: number,
) {
  const coinKeys = new Set(coins.map(posKey));
  const reachedCoinKeys = new Set<string>();
  const visited = new Set([posKey(from)]);
  const queue: Array<{ pos: Pos; distance: number }> = [
    { pos: from, distance: 0 },
  ];
  const directions: Array<[number, number]> = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentKey = posKey(current.pos);
    if (coinKeys.has(currentKey)) reachedCoinKeys.add(currentKey);
    if (current.distance >= radius) continue;

    for (const [dr, dc] of directions) {
      const next = { r: current.pos.r + dr, c: current.pos.c + dc };
      const nextKey = posKey(next);
      if (grid[next.r]?.[next.c] !== 0 || visited.has(nextKey)) continue;
      visited.add(nextKey);
      queue.push({ pos: next, distance: current.distance + 1 });
    }
  }

  return coins.filter((coin) => reachedCoinKeys.has(posKey(coin)));
}

export { posKey };
