/** Waving start flag — readable even on small cells. */
export function StartFlag({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="start-flag"
    >
      <line x1="7" y1="5" x2="7" y2="28" stroke="#2b2d42" strokeWidth="2.4" strokeLinecap="round" />
      <path className="flag-cloth" d="M8 6 L24 11 L8 17 Z" fill="#2f9e44" />
      <path className="flag-cloth" d="M8 6 L22 11 L8 16 Z" fill="#69db7c" />
      <circle cx="7" cy="5" r="1.6" fill="#ffd43b" />
    </svg>
  );
}

/** Spinning portal + star goal. */
export function GoalPortal({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="goal-portal"
    >
      <circle className="portal-ring" cx="16" cy="16" r="12" fill="none" stroke="#845ef7" strokeWidth="2.4" strokeDasharray="5 3" />
      <circle className="portal-glow" cx="16" cy="16" r="8" fill="#e5dbff" />
      <path
        className="goal-star"
        d="M16 7 L18.2 13.2 L24.8 13.4 L19.6 17.4 L21.6 23.6 L16 19.8 L10.4 23.6 L12.4 17.4 L7.2 13.4 L13.8 13.2 Z"
        fill="#ffd43b"
        stroke="#f59f00"
        strokeWidth="0.8"
      />
    </svg>
  );
}

/** Decorative mini-maze mark used on the home logo. */
export function MazeMark({ size = 72 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      aria-hidden="true"
      className="maze-mark"
    >
      <rect width="72" height="72" rx="20" fill="url(#logo-bg)" />
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4C6EF5" />
          <stop offset="100%" stopColor="#845EF7" />
        </linearGradient>
      </defs>
      <path
        d="M16 16h12v8H24v20h8V28h8v8h8V24h8v32H16V16zm28 28h-8v8h8v-8z"
        fill="#FFE066"
      />
      <circle cx="52" cy="20" r="5" fill="#FF6B6B" />
      <circle cx="24" cy="52" r="4" fill="#69DB7C" />
    </svg>
  );
}
