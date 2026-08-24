/** Cute simple SVG buddy — colorful blob with eyes. */
export function Character({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="character-svg"
    >
      <ellipse cx="32" cy="36" rx="22" ry="20" fill="#FF6B6B" />
      <ellipse cx="32" cy="38" rx="16" ry="12" fill="#FF8E8E" opacity="0.5" />
      <circle cx="24" cy="30" r="5" fill="#fff" />
      <circle cx="40" cy="30" r="5" fill="#fff" />
      <circle cx="25" cy="31" r="2.5" fill="#2D3436" />
      <circle cx="41" cy="31" r="2.5" fill="#2D3436" />
      <path
        d="M26 42 Q32 48 38 42"
        stroke="#2D3436"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="14" cy="22" r="4" fill="#FFD93D" />
      <circle cx="50" cy="22" r="4" fill="#6BCB77" />
    </svg>
  );
}
