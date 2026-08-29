import type { CharacterId } from '../types';

export type CharacterRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'mythic'
  | 'legendary';

export interface AquariumCharacter {
  id: CharacterId;
  name: string;
  price: number;
  rarity: CharacterRarity;
  spriteIndex?: number;
  spriteLeft?: number;
  spriteWidth?: number;
  imageSrc?: string;
  /** Number of walkable maze steps from which this swimmer can pull in a coin. */
  magnetRadius: number;
  description: string;
}

/**
 * Original aquarium species and prices. No franchise characters or likenesses.
 * A full adventure contains 200 coins. Early swimmers unlock quickly, while
 * Big Daddy Octopus takes about 1.75 thorough playthroughs if purchased alone.
 * Players may skip characters, so no upgrade is a mandatory prerequisite.
 */
export const AQUARIUM_CHARACTERS: AquariumCharacter[] = [
  {
    id: 'goldfish',
    name: 'Goldfish',
    price: 0,
    rarity: 'common',
    spriteIndex: 0,
    spriteLeft: 10,
    spriteWidth: 390,
    magnetRadius: 0,
    description: 'Bright, brave, and ready to explore.',
  },
  {
    id: 'coral-clownfish',
    name: 'Coral Clownfish',
    price: 8,
    rarity: 'common',
    imageSrc: '/aquarium/characters/coral-clownfish.png',
    magnetRadius: 1,
    description: 'A cheerful reef scout with a bold little stripe.',
  },
  {
    id: 'neon-guppy',
    name: 'Neon Guppy',
    price: 18,
    rarity: 'common',
    spriteIndex: 1,
    spriteLeft: 400,
    spriteWidth: 410,
    magnetRadius: 2,
    description: 'A tiny speedster with electric colors.',
  },
  {
    id: 'pufferfish',
    name: 'Pufferfish',
    price: 32,
    rarity: 'uncommon',
    imageSrc: '/aquarium/characters/pufferfish.png',
    magnetRadius: 3,
    description: 'Puffs up with courage when treasure is near.',
  },
  {
    id: 'rainbow-angelfish',
    name: 'Rainbow Angelfish',
    price: 50,
    rarity: 'uncommon',
    spriteIndex: 2,
    spriteLeft: 820,
    spriteWidth: 365,
    magnetRadius: 4,
    description: 'Graceful fins in every color of the reef.',
  },
  {
    id: 'seahorse',
    name: 'Seahorse',
    price: 75,
    rarity: 'rare',
    spriteIndex: 3,
    spriteLeft: 1190,
    spriteWidth: 346,
    magnetRadius: 5,
    description: 'A curious coral-garden adventurer.',
  },
  {
    id: 'manta-ray',
    name: 'Manta Ray',
    price: 105,
    rarity: 'rare',
    imageSrc: '/aquarium/characters/manta-ray.png',
    magnetRadius: 6,
    description: 'Glides over long corridors like an ocean kite.',
  },
  {
    id: 'sea-turtle',
    name: 'Sea Turtle',
    price: 140,
    rarity: 'rare',
    spriteIndex: 4,
    spriteLeft: 0,
    spriteWidth: 450,
    magnetRadius: 7,
    description: 'Cool, calm, and always keeps swimming.',
  },
  {
    id: 'jellyfish',
    name: 'Jellyfish',
    price: 180,
    rarity: 'epic',
    spriteIndex: 5,
    spriteLeft: 450,
    spriteWidth: 380,
    magnetRadius: 8,
    description: 'A glowing deep-sea maze dancer.',
  },
  {
    id: 'hammerhead-shark',
    name: 'Hammerhead Shark',
    price: 225,
    rarity: 'epic',
    imageSrc: '/aquarium/characters/hammerhead-shark.png',
    magnetRadius: 9,
    description: 'A fearless treasure tracker with a wide view.',
  },
  {
    id: 'narwhal',
    name: 'Narwhal',
    price: 280,
    rarity: 'mythic',
    imageSrc: '/aquarium/characters/narwhal.png',
    magnetRadius: 10,
    description: 'A sparkling deep-sea wonder with mighty pull.',
  },
  {
    id: 'big-daddy-octopus',
    name: 'Big Daddy Octopus',
    price: 350,
    rarity: 'legendary',
    spriteIndex: 6,
    spriteLeft: 835,
    spriteWidth: 575,
    magnetRadius: 11,
    description: 'The legendary eight-armed maze master.',
  },
];

export function getCharacter(id: CharacterId) {
  return AQUARIUM_CHARACTERS.find((character) => character.id === id)!;
}
