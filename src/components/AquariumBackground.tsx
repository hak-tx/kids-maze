import type { CharacterId } from '../types';
import { Character } from './Character';

const SWIMMERS: { id: CharacterId; className: string; size: number }[] = [
  { id: 'neon-guppy', className: 'swimmer-a', size: 78 },
  { id: 'rainbow-angelfish', className: 'swimmer-b', size: 96 },
  { id: 'seahorse', className: 'swimmer-c', size: 72 },
  { id: 'sea-turtle', className: 'swimmer-d', size: 112 },
  { id: 'jellyfish', className: 'swimmer-e', size: 88 },
  { id: 'goldfish', className: 'swimmer-f', size: 68 },
  { id: 'big-daddy-octopus', className: 'swimmer-g', size: 128 },
  { id: 'coral-clownfish', className: 'swimmer-h', size: 76 },
  { id: 'pufferfish', className: 'swimmer-i', size: 74 },
  { id: 'manta-ray', className: 'swimmer-j', size: 118 },
  { id: 'hammerhead-shark', className: 'swimmer-k', size: 112 },
  { id: 'narwhal', className: 'swimmer-l', size: 102 },
];

export function AquariumBackground() {
  return (
    <div className="aquarium-background" aria-hidden="true">
      <div className="water-rays" />
      <div className="bubble-field">
        {Array.from({ length: 22 }, (_, index) => (
          <span
            key={index}
            className="bubble"
            style={{
              left: `${3 + ((index * 17) % 94)}%`,
              width: `${8 + (index % 5) * 4}px`,
              height: `${8 + (index % 5) * 4}px`,
              animationDelay: `${-(index * 1.3)}s`,
              animationDuration: `${8 + (index % 6) * 1.4}s`,
            }}
          />
        ))}
      </div>
      {SWIMMERS.map(({ id, className, size }) => (
        <div key={className} className={`aquarium-swimmer ${className}`}>
          <Character id={id} size={size} />
        </div>
      ))}
    </div>
  );
}
