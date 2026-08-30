import { useCallback, useState } from 'react';
import { AQUARIUM_CHARACTERS, getCharacter } from '../game/characters';
import type { CharacterId, Economy } from '../types';

const KEY = 'kids-maze-aquarium-economy-v1';
const DEFAULT_ECONOMY: Economy = {
  coins: 0,
  owned: ['goldfish'],
  equipped: 'goldfish',
};

function loadEconomy(): Economy {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_ECONOMY;
    const parsed = JSON.parse(raw) as Partial<Economy>;
    const validIds = new Set(AQUARIUM_CHARACTERS.map(({ id }) => id));
    const owned = Array.isArray(parsed.owned)
      ? parsed.owned.filter((id): id is CharacterId => validIds.has(id as CharacterId))
      : [];
    if (!owned.includes('goldfish')) owned.unshift('goldfish');
    const equipped =
      parsed.equipped && owned.includes(parsed.equipped) ? parsed.equipped : 'goldfish';
    return {
      coins: Math.max(0, Math.floor(Number(parsed.coins) || 0)),
      owned,
      equipped,
    };
  } catch {
    return DEFAULT_ECONOMY;
  }
}

function saveEconomy(economy: Economy) {
  try {
    localStorage.setItem(KEY, JSON.stringify(economy));
  } catch {
    /* Progress remains in memory when storage is unavailable. */
  }
}

export function useEconomy() {
  const [economy, setEconomy] = useState<Economy>(loadEconomy);

  const update = useCallback((change: (current: Economy) => Economy) => {
    setEconomy((current) => {
      const next = change(current);
      saveEconomy(next);
      return next;
    });
  }, []);

  const addCoins = useCallback(
    (amount = 1) => {
      update((current) => ({ ...current, coins: current.coins + Math.max(0, amount) }));
    },
    [update],
  );

  const buyCharacter = useCallback(
    (id: CharacterId) => {
      update((current) => {
        if (current.owned.includes(id)) return { ...current, equipped: id };
        const character = getCharacter(id);
        if (current.coins < character.price) return current;
        return {
          coins: current.coins - character.price,
          owned: [...current.owned, id],
          equipped: id,
        };
      });
    },
    [update],
  );

  const equipCharacter = useCallback(
    (id: CharacterId) => {
      update((current) =>
        current.owned.includes(id) ? { ...current, equipped: id } : current,
      );
    },
    [update],
  );

  return { economy, addCoins, buyCharacter, equipCharacter };
}
