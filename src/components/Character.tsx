import { getCharacter } from '../game/characters';
import type { CharacterId } from '../types';

export function Character({
  id = 'goldfish',
  size = 40,
  celebrating = false,
}: {
  id?: CharacterId;
  size?: number;
  celebrating?: boolean;
}) {
  const character = getCharacter(id);
  const row = Math.floor(character.spriteIndex / 4);
  const sheetWidth = 1536;
  const cropHeight = 512;
  const backgroundWidth = (sheetWidth / character.spriteWidth) * 100;
  const horizontalPosition = (character.spriteLeft / (sheetWidth - character.spriteWidth)) * 100;

  return (
    <span
      className={`aquarium-character${celebrating ? ' celebrating' : ''}`}
      style={{
        width: size,
        height: size,
        backgroundSize: `${backgroundWidth}% ${(1024 / cropHeight) * 100}%`,
        backgroundPosition: `${horizontalPosition}% ${row * 100}%`,
      }}
      role="img"
      aria-label={character.name}
    />
  );
}
