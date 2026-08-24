/** Animated explorer fox — full body, idle bounce + blink. */
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
      <ellipse cx="32" cy="58" rx="13" ry="3.4" fill="rgba(0,0,0,0.2)" />
      <ellipse cx="22" cy="54" rx="5" ry="3.2" fill="#E8590C" />
      <ellipse cx="42" cy="54" rx="5" ry="3.2" fill="#E8590C" />
      <ellipse cx="32" cy="46" rx="16" ry="13" fill="#F76707" />
      <ellipse cx="32" cy="48" rx="10" ry="8" fill="#FFE8CC" />
      <path d="M14 22 L8 6 L26 16 Z" fill="#E8590C" />
      <path d="M50 22 L56 6 L38 16 Z" fill="#E8590C" />
      <path d="M16 20 L12 10 L25 17 Z" fill="#FFD8A8" />
      <path d="M48 20 L52 10 L39 17 Z" fill="#FFD8A8" />
      <circle cx="32" cy="30" r="18" fill="#F76707" />
      <circle cx="32" cy="33" r="12" fill="#FFE8CC" />
      <circle cx="25" cy="28" r="5.6" fill="#fff" />
      <circle cx="39" cy="28" r="5.6" fill="#fff" />
      <circle cx="26.2" cy="29" r="2.6" fill="#212529" />
      <circle cx="40.2" cy="29" r="2.6" fill="#212529" />
      <circle cx="27.2" cy="27.8" r="0.9" fill="#fff" />
      <circle cx="41.2" cy="27.8" r="0.9" fill="#fff" />
      <rect className="blink-lid" x="19.5" y="22.5" width="11" height="11" rx="5.5" fill="#F76707" />
      <rect className="blink-lid" x="33.5" y="22.5" width="11" height="11" rx="5.5" fill="#F76707" />
      <ellipse cx="32" cy="35" rx="3.4" ry="2.5" fill="#C2255C" />
      <path
        d="M26 40 Q32 45 38 40"
        stroke="#C2255C"
        strokeWidth="2.3"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="22" cy="36" r="2.4" fill="#FF8787" opacity="0.9" />
      <circle cx="42" cy="36" r="2.4" fill="#FF8787" opacity="0.9" />
      <path
        d="M20 16 Q32 5 44 16 Q39 11 32 10 Q25 11 20 16 Z"
        fill="#F59F00"
        stroke="#E67700"
        strokeWidth="1.3"
      />
      <rect x="28.5" y="7" width="7" height="6" rx="1.6" fill="#F59F00" />
      <circle cx="32" cy="9" r="1.3" fill="#FFD43B" />
      <path
        d="M44 18 Q53 22 54 30"
        className="tail-wag"
        stroke="#F59F00"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
