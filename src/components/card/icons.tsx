export function FlagDE({ className = "flag" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 5 3" aria-hidden="true">
      <rect width="5" height="1" fill="oklch(0 0 0)" />
      <rect y="1" width="5" height="1" fill="oklch(0.55 0.22 29)" />
      <rect y="2" width="5" height="1" fill="oklch(0.86 0.17 90)" />
    </svg>
  );
}

export function FlagGB({ className = "flag" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 36" aria-hidden="true">
      <rect width="60" height="36" fill="oklch(0.3 0.13 265)" />
      <path d="M0 0l60 36M60 0L0 36" stroke="oklch(1 0 0)" strokeWidth="7" />
      <path d="M0 0l60 36M60 0L0 36" stroke="oklch(0.5 0.2 25)" strokeWidth="3" />
      <path d="M30 0v36M0 18h60" stroke="oklch(1 0 0)" strokeWidth="12" />
      <path d="M30 0v36M0 18h60" stroke="oklch(0.5 0.2 25)" strokeWidth="7" />
    </svg>
  );
}

const HAND = [
  "M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2",
  "M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2",
  "M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8",
  "M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",
];

/** Sign-language symbol: two signing hands with motion arcs. */
export function SignLanguageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Gebärdensprache"
    >
      <g transform="translate(25 12) scale(1.05)">
        {HAND.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g transform="translate(23 6) scale(-1.05 1.05)">
        {HAND.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <path d="M20 3.5a6 6 0 0 1 8 0" />
      <path d="M17 1a10 10 0 0 1 14 0" opacity=".55" />
    </svg>
  );
}
