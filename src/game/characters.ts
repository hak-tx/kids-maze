import type { CharacterId } from '../types';

export interface AquariumCharacter {
  id: CharacterId;
  name: string;
  price: number;
  spriteIndex: number;
  spriteLeft: number;
  spriteWidth: number;
  description: string;
}

/**
 * Original aquarium species and prices. No franchise characters or likenesses.
 * A full adventure contains 200 coins; buying every upgrade costs 515 coins.
 * This makes early rewards quick, the octopus just beyond one saved run, and
 * the complete collection achievable in about 2.6 thorough playthroughs.
 */
export const AQUARIUM_CHARACTERS: AquariumCharacter[] = [
  {
    id: 'goldfish',
    name: 'Goldfish',
    price: 0,
    spriteIndex: 0,
    spriteLeft: 10,
    spriteWidth: 390,
    description: 'Bright, brave, and ready to explore.',
  },
  {
    id: 'neon-guppy',
    name: 'Neon Guppy',
    price: 15,
    spriteIndex: 1,
    spriteLeft: 400,
    spriteWidth: 410,
    description: 'A tiny speedster with electric colors.',
  },
  {
    id: 'rainbow-angelfish',
    name: 'Rainbow Angelfish',
    price: 30,
    spriteIndex: 2,
    spriteLeft: 820,
    spriteWidth: 365,
    description: 'Graceful fins in every color of the reef.',
  },
  {
    id: 'seahorse',
    name: 'Seahorse',
    price: 50,
    spriteIndex: 3,
    spriteLeft: 1190,
    spriteWidth: 346,
    description: 'A curious coral-garden adventurer.',
  },
  {
    id: 'sea-turtle',
    name: 'Sea Turtle',
    price: 80,
    spriteIndex: 4,
    spriteLeft: 0,
    spriteWidth: 450,
    description: 'Cool, calm, and always keeps swimming.',
  },
  {
    id: 'jellyfish',
    name: 'Jellyfish',
    price: 120,
    spriteIndex: 5,
    spriteLeft: 450,
    spriteWidth: 380,
    description: 'A glowing deep-sea maze dancer.',
  },
  {
    id: 'big-daddy-octopus',
    name: 'Big Daddy Octopus',
    price: 220,
    spriteIndex: 6,
    spriteLeft: 835,
    spriteWidth: 575,
    description: 'The legendary eight-armed maze master.',
  },
];

export function getCharacter(id: CharacterId) {
  return AQUARIUM_CHARACTERS.find((character) => character.id === id)!;
}
