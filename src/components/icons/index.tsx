type P = { className?: string };

export const HomeWrench = ({ className }: P) => (
  <svg viewBox="0 0 28 24" className={className} fill="none">
    <path d="M3 12 L11 5 L19 12 M5.5 10.5 V19 H16.5 V10.5" stroke="#fff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <rect x="9.5" y="14" width="3" height="5" fill="#fff" />
    <path d="M24.5 8.5a3 3 0 0 1-3.9 3.3l-3.4 3.4-1.4-1.4 3.4-3.4a3 3 0 0 1 3.3-3.9l-1.6 1.6.5 1.5 1.5.5z" fill="#fff" />
  </svg>
);

export const Pencil = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className}>
    <g transform="rotate(45 12 12)">
      <rect x="9" y="1" width="6" height="4" rx="1" fill="#f59ab5" />
      <rect x="9" y="5" width="6" height="1.5" fill="#bbb" />
      <rect x="9" y="6.5" width="6" height="11" fill="#f7d23a" />
      <rect x="9" y="6.5" width="2" height="11" fill="#e6b82a" />
      <path d="M9 17.5 L12 23 L15 17.5Z" fill="#f2d7a8" />
      <path d="M11 21 L12 23 L13 21Z" fill="#333" />
    </g>
  </svg>
);

export const Friends = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" fill="#f28a1e" />
    <circle cx="12" cy="12" r="7" fill="#fff" />
    <circle cx="9.5" cy="10.5" r="1.1" fill="#f28a1e" />
    <circle cx="14.5" cy="10.5" r="1.1" fill="#f28a1e" />
    <path d="M8.8 13.5 Q12 16.8 15.2 13.5" stroke="#f28a1e" strokeWidth="1.4" fill="none" strokeLinecap="round" />
  </svg>
);

export const Chat = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" fill="#3cb54a" />
    <path d="M5.5 6.5h13a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-8l-3.5 3v-3h-1.5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z" fill="#fff" />
    <path d="M8 9h8M8 11h8M8 13h5" stroke="#3cb54a" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

export const Globe = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className}>
    <circle cx="12" cy="12" r="10" fill="#2f86e0" />
    <g stroke="#fff" strokeWidth="1.2" fill="none">
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="12" rx="4.5" ry="10" />
      <path d="M2 12h20M4 7h16M4 17h16M12 2v20" />
    </g>
  </svg>
);

export const Community = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className}>
    <circle cx="12" cy="12" r="10.5" fill="#52c25a" />
    <g fill="#fff">
      <circle cx="12" cy="8.5" r="2.4" />
      <path d="M7.8 16.5a4.2 4.2 0 0 1 8.4 0z" />
      <circle cx="6.8" cy="10.5" r="1.8" />
      <path d="M3.8 16.5a3 3 0 0 1 5.4-1.8l-.6 1.8z" />
      <circle cx="17.2" cy="10.5" r="1.8" />
      <path d="M20.2 16.5a3 3 0 0 0-5.4-1.8l.6 1.8z" />
    </g>
  </svg>
);

export const SingleView = ({ className }: P) => (
  <svg viewBox="0 0 16 16" className={className}>
    <rect x="3" y="3" width="10" height="10" rx="2" fill="none" stroke="#fff" strokeWidth="1.6" />
  </svg>
);

export const GridView = ({ className }: P) => (
  <svg viewBox="0 0 16 16" className={className} fill="#fff">
    <rect x="2" y="2" width="5" height="5" rx="1" />
    <rect x="9" y="2" width="5" height="5" rx="1" />
    <rect x="2" y="9" width="5" height="5" rx="1" />
    <rect x="9" y="9" width="5" height="5" rx="1" />
  </svg>
);

export const Camera = ({ className }: P) => (
  <svg viewBox="0 0 16 12" className={className} fill="none" stroke="#fff" strokeWidth="1.3">
    <path d="M1.5 3.5h3l1.2-1.8h4.6l1.2 1.8h3v7h-13z" strokeLinejoin="round" />
    <circle cx="8" cy="7" r="2.2" />
  </svg>
);

export const InfoGlyph = ({ className }: P) => (
  <svg viewBox="0 0 18 18" className={className}>
    <rect x="1" y="1" width="16" height="16" rx="4" fill="#3d9be9" stroke="#bfe3ff" strokeWidth="1" />
    <circle cx="6.5" cy="5.5" r="1.3" fill="#fff" />
    <rect x="5.4" y="7.5" width="2.2" height="6" rx="1" fill="#fff" />
    <path d="M10 13 a4 4 0 0 1 4-4 M10 10.5 a1.6 1.6 0 0 1 1.6-1.6" stroke="#fff" strokeWidth="1.3" fill="none" strokeLinecap="round" transform="translate(-0.5 -3)" />
  </svg>
);

export const Coin = ({ className }: P) => (
  <svg viewBox="0 0 18 18" className={className}>
    <circle cx="9" cy="9" r="8" fill="#f6c832" stroke="#b8860b" strokeWidth="1" />
    <circle cx="9" cy="9" r="5.6" fill="#e5ad1c" stroke="#c99512" strokeWidth=".8" />
    <circle cx="9.6" cy="5.6" r="1.1" fill="#fff6c8" />
    <path d="M9.4 7.2l-1 3 1.6 1-0.6 2.4M8.6 8.6l-1.8 1M10 8.4l1.6 1.2M8.4 10.2l-1.4 2.6" stroke="#fff6c8" strokeWidth="1" strokeLinecap="round" fill="none" />
  </svg>
);

export const House = ({ className }: P) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M2.5 8 L8 3 L13.5 8 M4 7 V13 H12 V7" />
  </svg>
);

export const Volume = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

export const VolumeMute = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

