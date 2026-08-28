export type Cell = 0 | 1; // 0 = floor, 1 = wall

export interface Pos {
  r: number;
  c: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

/** Visual theme for walls, floors, and accents. */
export type MazeTheme =
  | 'meadow'
  | 'hedge'
  | 'orchard'
  | 'river'
  | 'forest'
  | 'canyon'
  | 'sunset'
  | 'tide'
  | 'crystal'
  | 'lava'
  | 'storm'
  | 'aurora'
  | 'moon'
  | 'dragon'
  | 'galaxy'
  | 'champion';

export interface LevelConfig {
  id: number;
  name: string;
  rows: number;
  cols: number;
  seed: number;
  difficulty: Difficulty;
  theme: MazeTheme;
  /** Extra carving passes to widen corridors. Keep 0 for real mazes. */
  widenPasses: number;
  /** Sparse opposite-wall knock-downs that add loops (not open rooms). */
  loopCount: number;
}

export type CharacterId =
  | 'goldfish'
  | 'neon-guppy'
  | 'rainbow-angelfish'
  | 'seahorse'
  | 'sea-turtle'
  | 'jellyfish'
  | 'big-daddy-octopus';

export interface Economy {
  coins: number;
  owned: CharacterId[];
  equipped: CharacterId;
}

export type Screen = 'home' | 'levels' | 'howto' | 'play' | 'shop';

export interface Progress {
  unlocked: number;
  completed: number[];
}
