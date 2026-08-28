import { useCallback, useState } from 'react';
import type { Screen } from './types';
import { useProgress } from './hooks/useProgress';
import { useMute } from './hooks/useMute';
import { useEconomy } from './hooks/useEconomy';
import { Home } from './components/Home';
import { LevelSelect } from './components/LevelSelect';
import { HowTo } from './components/HowTo';
import { Game } from './components/Game';
import { AquariumBackground } from './components/AquariumBackground';
import { CharacterShop } from './components/CharacterShop';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [levelId, setLevelId] = useState(1);
  const { progress, completeLevel, isUnlocked } = useProgress();
  const { muted, toggleMuted } = useMute();
  const { economy, addCoins, buyCharacter, equipCharacter } = useEconomy();

  const playLevel = useCallback(
    (id: number) => {
      if (!isUnlocked(id)) return;
      setLevelId(id);
      setScreen('play');
    },
    [isUnlocked],
  );

  const playCurrent = () => playLevel(progress.unlocked);

  return (
    <div className="app-shell">
      <AquariumBackground />
      {screen === 'home' && (
        <Home
          unlocked={progress.unlocked}
          onPlay={playCurrent}
          onLevels={() => setScreen('levels')}
          onHowTo={() => setScreen('howto')}
          muted={muted}
          onToggleMute={toggleMuted}
          coins={economy.coins}
          characterId={economy.equipped}
          onShop={() => setScreen('shop')}
        />
      )}
      {screen === 'levels' && (
        <LevelSelect
          unlocked={progress.unlocked}
          completed={progress.completed}
          onSelect={playLevel}
          onBack={() => setScreen('home')}
        />
      )}
      {screen === 'howto' && <HowTo onBack={() => setScreen('home')} />}
      {screen === 'shop' && (
        <CharacterShop
          economy={economy}
          onBack={() => setScreen('home')}
          onBuy={buyCharacter}
          onEquip={equipCharacter}
        />
      )}
      {screen === 'play' && (
        <Game
          levelId={levelId}
          onWin={completeLevel}
          onHome={() => setScreen('home')}
          onSelectLevel={playLevel}
          muted={muted}
          onToggleMute={toggleMuted}
          coinTotal={economy.coins}
          characterId={economy.equipped}
          onCollectCoin={addCoins}
          onShop={() => setScreen('shop')}
        />
      )}
    </div>
  );
}
