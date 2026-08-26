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
      aria-label={
        muted
          ? 'Music and sound are off. Turn on'
          : 'Music and sound are on. Turn off'
      }
      title={muted ? 'Music and sound off' : 'Music and sound on'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
