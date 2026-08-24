import { GoalPortal, StartFlag } from './Markers';

interface HowToProps {
  onBack: () => void;
}

export function HowTo({ onBack }: HowToProps) {
  return (
    <div className="screen howto-screen">
      <header className="screen-header">
        <button type="button" className="btn btn-ghost btn-icon" onClick={onBack} aria-label="Back">
          ←
        </button>
        <h2>How to Play</h2>
        <span className="spacer" />
      </header>

      <ol className="howto-list">
        <li>
          <span className="howto-icon howto-svgs" aria-hidden="true">
            <StartFlag size={28} />
            <GoalPortal size={28} />
          </span>
          <div>
            <strong>Start</strong> at the green flag. Race to the{' '}
            <strong>glowing star portal</strong>!
          </div>
        </li>
        <li>
          <span className="howto-icon" aria-hidden="true">
            👆
          </span>
          <div>
            <strong>Drag</strong> your finger along the path, or <strong>tap</strong> a
            square next to you.
          </div>
        </li>
        <li>
          <span className="howto-icon" aria-hidden="true">
            ⌨️
          </span>
          <div>
            On a computer, use <strong>arrow keys</strong> or <strong>WASD</strong>.
          </div>
        </li>
        <li>
          <span className="howto-icon" aria-hidden="true">
            💡
          </span>
          <div>
            Stuck? Tap <strong>Hint</strong> — the next turn will glow.
          </div>
        </li>
        <li>
          <span className="howto-icon" aria-hidden="true">
            🧱
          </span>
          <div>
            Paths are skinny — don&apos;t bump the patterned walls!
          </div>
        </li>
      </ol>

      <button type="button" className="btn btn-primary btn-lg" onClick={onBack}>
        Got it!
      </button>
    </div>
  );
}
