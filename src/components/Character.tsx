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
  if (character.imageSrc) {
    return (
      <img
        className={`aquarium-character generated-character${celebrating ? ' celebrating' : ''}`}
        src={character.imageSrc}
        alt={character.name}
        width={size}
        height={size}
      />
    );
  }

  const spriteIndex = character.spriteIndex!;
  const spriteLeft = character.spriteLeft!;
  const spriteWidth = character.spriteWidth!;
  const row = Math.floor(spriteIndex / 4);
  const sheetWidth = 1536;
  const cropHeight = 512;
  const backgroundWidth = (sheetWidth / spriteWidth) * 100;
  const horizontalPosition = (spriteLeft / (sheetWidth - spriteWidth)) * 100;

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
