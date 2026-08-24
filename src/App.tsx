import { useCallback, useState } from 'react';
import type { Screen } from './types';
import { useProgress } from './hooks/useProgress';
import { Home } from './components/Home';
import { LevelSelect } from './components/LevelSelect';
import { HowTo } from './components/HowTo';
import { Game } from './components/Game';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [levelId, setLevelId] = useState(1);
  const { progress, completeLevel, isUnlocked } = useProgress();

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
      {screen === 'home' && (
        <Home
          unlocked={progress.unlocked}
          onPlay={playCurrent}
          onLevels={() => setScreen('levels')}
          onHowTo={() => setScreen('howto')}
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
      {screen === 'play' && (
        <Game
          levelId={levelId}
          onWin={completeLevel}
          onHome={() => setScreen('home')}
          onSelectLevel={playLevel}
        />
      )}
    </div>
  );
}
