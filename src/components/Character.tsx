/** Animated explorer fox — idle bounce + blink. */
export function Character({
  size = 40,
  celebrating = false,
}: {
  size?: number;
  celebrating?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={`character-svg${celebrating ? ' celebrating' : ''}`}
    >
      <ellipse cx="32" cy="54" rx="14" ry="4" fill="rgba(0,0,0,0.18)" />
      <path d="M16 22 L10 8 L24 16 Z" fill="#E8590C" />
      <path d="M48 22 L54 8 L40 16 Z" fill="#E8590C" />
      <path d="M18 20 L13 11 L24 17 Z" fill="#FFD8A8" />
      <path d="M46 20 L51 11 L40 17 Z" fill="#FFD8A8" />
      <ellipse cx="32" cy="34" rx="20" ry="19" fill="#F76707" />
      <ellipse cx="32" cy="38" rx="13" ry="12" fill="#FFE8CC" />
      <circle cx="24" cy="30" r="5.2" fill="#fff" />
      <circle cx="40" cy="30" r="5.2" fill="#fff" />
      <circle cx="25.2" cy="31" r="2.4" fill="#212529" />
      <circle cx="41.2" cy="31" r="2.4" fill="#212529" />
      <circle cx="26.2" cy="30" r="0.8" fill="#fff" />
      <circle cx="42.2" cy="30" r="0.8" fill="#fff" />
      <rect className="blink-lid" x="19" y="25" width="10" height="10" rx="5" fill="#F76707" />
      <rect className="blink-lid" x="35" y="25" width="10" height="10" rx="5" fill="#F76707" />
      <ellipse cx="32" cy="36.5" rx="3.2" ry="2.4" fill="#C2255C" />
      <path
        d="M27 42 Q32 47 37 42"
        stroke="#C2255C"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="22" cy="38" r="2.2" fill="#FF8787" opacity="0.85" />
      <circle cx="42" cy="38" r="2.2" fill="#FF8787" opacity="0.85" />
      <path
        d="M22 18 Q32 8 42 18 Q38 14 32 13 Q26 14 22 18 Z"
        fill="#F59F00"
        stroke="#E67700"
        strokeWidth="1.2"
      />
      <rect x="29" y="10" width="6" height="5" rx="1.5" fill="#F59F00" />
      <path d="M42 18 Q50 20 52 26" stroke="#F59F00" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
