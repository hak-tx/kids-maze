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

/** Five stubby cartoon arms — used for fill and a slightly larger outline. */
function StarfishBody({ fill }: { fill: string }) {
  return (
    <>
      <ellipse cx="16" cy="10.6" rx="3.7" ry="5.3" fill={fill} />
      <ellipse cx="16" cy="10.6" rx="3.7" ry="5.3" fill={fill} transform="rotate(72 16 16)" />
      <ellipse cx="16" cy="10.6" rx="3.7" ry="5.3" fill={fill} transform="rotate(144 16 16)" />
      <ellipse cx="16" cy="10.6" rx="3.7" ry="5.3" fill={fill} transform="rotate(216 16 16)" />
      <ellipse cx="16" cy="10.6" rx="3.7" ry="5.3" fill={fill} transform="rotate(288 16 16)" />
      <circle cx="16" cy="16" r="5.4" fill={fill} />
    </>
  );
}

/** Spinning portal + cartoon starfish goal. */
export function GoalPortal({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      overflow="visible"
      aria-hidden="true"
      className="goal-portal"
    >
      <defs>
        <radialGradient
          id="starfish-fill"
          gradientUnits="userSpaceOnUse"
          cx="13"
          cy="12"
          r="14"
        >
          <stop offset="0%" stopColor="#ffe066" />
          <stop offset="48%" stopColor="#ff922b" />
          <stop offset="100%" stopColor="#f76707" />
        </radialGradient>
      </defs>
      <circle
        className="portal-ring"
        cx="16"
        cy="16"
        r="13"
        fill="none"
        stroke="#22b8cf"
        strokeWidth="2.2"
        strokeDasharray="5 3"
      />
      <circle className="portal-glow" cx="16" cy="16" r="9.2" fill="#fff4c2" />
      <g className="goal-star">
        <g transform="translate(16 16) scale(1.07) translate(-16 -16)">
          <StarfishBody fill="#d9480f" />
        </g>
        <StarfishBody fill="url(#starfish-fill)" />
        <ellipse cx="16" cy="16.6" rx="4.3" ry="4" fill="#ffe8cc" opacity="0.9" />
        <circle cx="16" cy="11.4" r="0.85" fill="#e8590c" opacity="0.55" />
        <circle cx="20.4" cy="14.6" r="0.7" fill="#e8590c" opacity="0.48" />
        <circle cx="11.6" cy="14.6" r="0.7" fill="#e8590c" opacity="0.48" />
        <circle cx="13.55" cy="15.5" r="1.35" fill="#fff" />
        <circle cx="18.45" cy="15.5" r="1.35" fill="#fff" />
        <circle cx="13.8" cy="15.7" r="0.72" fill="#1a2340" />
        <circle cx="18.7" cy="15.7" r="0.72" fill="#1a2340" />
        <path
          d="M13.9 18.15 Q16 20.05 18.1 18.15"
          fill="none"
          stroke="#c92a2a"
          strokeWidth="0.85"
          strokeLinecap="round"
        />
      </g>
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
