/** Animated explorer tiger — full body, idle bounce + blink. */
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

      <g className="tail-wag">
        <path
          d="M45 44 Q56 43 58 33"
          stroke="#E8590C"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M45 44 Q56 43 58 33"
          stroke="#F76707"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M50.2 42.4 L52.4 40.4"
          stroke="#2B1810"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M55.2 36.6 L56.8 33.8"
          stroke="#2B1810"
          strokeWidth="5.6"
          strokeLinecap="round"
        />
        <circle cx="58" cy="32.2" r="2.2" fill="#FFF4E6" />
      </g>

      <ellipse cx="22" cy="54" rx="5" ry="3.2" fill="#E8590C" />
      <ellipse cx="42" cy="54" rx="5" ry="3.2" fill="#E8590C" />
      <ellipse cx="32" cy="46" rx="16" ry="13" fill="#F76707" />
      <ellipse cx="32" cy="48" rx="10" ry="8" fill="#FFE8CC" />
      <path d="M19 49 L22 54" stroke="#2B1810" strokeWidth="3.6" strokeLinecap="round" />
      <path d="M45 49 L42 54" stroke="#2B1810" strokeWidth="3.6" strokeLinecap="round" />

      <ellipse cx="16.5" cy="16" rx="6.4" ry="7.2" fill="#E8590C" />
      <ellipse cx="47.5" cy="16" rx="6.4" ry="7.2" fill="#E8590C" />
      <ellipse cx="17.3" cy="17.2" rx="3.2" ry="3.8" fill="#FFF4E6" />
      <ellipse cx="46.7" cy="17.2" rx="3.2" ry="3.8" fill="#FFF4E6" />
      <path d="M14.2 13 L16.2 18.2" stroke="#2B1810" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M49.8 13 L47.8 18.2" stroke="#2B1810" strokeWidth="2.4" strokeLinecap="round" />

      <circle cx="32" cy="30" r="18" fill="#F76707" />
      <path d="M32 13 L32 22.5" stroke="#2B1810" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M24 15.2 L26.4 23" stroke="#2B1810" strokeWidth="3.8" strokeLinecap="round" />
      <path d="M40 15.2 L37.6 23" stroke="#2B1810" strokeWidth="3.8" strokeLinecap="round" />
      <path d="M15.6 31.5 L21 34.2" stroke="#2B1810" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M48.4 31.5 L43 34.2" stroke="#2B1810" strokeWidth="3.2" strokeLinecap="round" />

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
    </svg>
  );
}
