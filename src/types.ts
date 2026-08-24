export type Cell = 0 | 1; // 0 = floor, 1 = wall

export interface Pos {
  r: number;
  c: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface LevelConfig {
  id: number;
  name: string;
  rows: number;
  cols: number;
  seed: number;
  difficulty: Difficulty;
  /** Extra carving passes to widen corridors (kids-friendly). */
  widenPasses: number;
}

export type Screen = 'home' | 'levels' | 'howto' | 'play';

export interface Progress {
  unlocked: number;
  completed: number[];
}
