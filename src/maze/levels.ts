import type { LevelConfig } from '../types';

/**
 * 15 progressive levels: easy (wide/short) → medium → harder.
 * Seeds fixed so mazes are deterministic and always solvable.
 */
export const LEVELS: LevelConfig[] = [
  { id: 1, name: 'Sunny Path', rows: 7, cols: 7, seed: 101, difficulty: 'easy', widenPasses: 3 },
  { id: 2, name: 'Little Loop', rows: 7, cols: 9, seed: 202, difficulty: 'easy', widenPasses: 3 },
  { id: 3, name: 'Garden Walk', rows: 9, cols: 9, seed: 303, difficulty: 'easy', widenPasses: 2 },
  { id: 4, name: 'Bunny Trail', rows: 9, cols: 11, seed: 404, difficulty: 'easy', widenPasses: 2 },
  { id: 5, name: 'Rainbow Road', rows: 11, cols: 11, seed: 505, difficulty: 'medium', widenPasses: 2 },
  { id: 6, name: 'Wiggle Way', rows: 11, cols: 13, seed: 606, difficulty: 'medium', widenPasses: 1 },
  { id: 7, name: 'Forest Fork', rows: 13, cols: 13, seed: 707, difficulty: 'medium', widenPasses: 1 },
  { id: 8, name: 'Zigzag Zoo', rows: 13, cols: 15, seed: 808, difficulty: 'medium', widenPasses: 1 },
  { id: 9, name: 'Crystal Cave', rows: 15, cols: 15, seed: 909, difficulty: 'hard', widenPasses: 0 },
  { id: 10, name: 'Starry Spiral', rows: 15, cols: 17, seed: 1010, difficulty: 'hard', widenPasses: 0 },
  { id: 11, name: 'Thunder Track', rows: 17, cols: 17, seed: 1111, difficulty: 'hard', widenPasses: 0 },
  { id: 12, name: 'Moon Maze', rows: 17, cols: 19, seed: 1212, difficulty: 'hard', widenPasses: 0 },
  { id: 13, name: 'Dragon Den', rows: 19, cols: 19, seed: 1313, difficulty: 'hard', widenPasses: 0 },
  { id: 14, name: 'Galaxy Gate', rows: 19, cols: 21, seed: 1414, difficulty: 'hard', widenPasses: 0 },
  { id: 15, name: 'Champion Cup', rows: 21, cols: 21, seed: 1515, difficulty: 'hard', widenPasses: 0 },
];

export function getLevel(id: number): LevelConfig | undefined {
  return LEVELS.find((l) => l.id === id);
}
