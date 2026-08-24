interface MuteButtonProps {
  muted: boolean;
  onToggle: () => void;
  className?: string;
}

export function MuteButton({ muted, onToggle, className = '' }: MuteButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn-ghost btn-icon mute-btn ${className}`}
      onClick={onToggle}
      aria-label={muted ? 'Sound is off. Turn on' : 'Sound is on. Turn off'}
      title={muted ? 'Sound off' : 'Sound on'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
