import type { ReactElement } from 'react';

interface IconProps { className?: string }
type IconFn = (p: IconProps) => ReactElement;

const cls = (extra = '') => `w-full h-full ${extra}`;

const WebFrontendIcon: IconFn = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cls(className)}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <polyline points="8 21 12 17 16 21" />
    <line x1="9" y1="9" x2="15" y2="9" />
    <line x1="9" y1="12" x2="13" y2="12" />
  </svg>
);

const WebBackendIcon: IconFn = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cls(className)}>
    <rect x="2" y="3" width="20" height="5" rx="1" />
    <rect x="2" y="10" width="20" height="5" rx="1" />
    <rect x="2" y="17" width="20" height="4" rx="1" />
    <circle cx="6" cy="5.5" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="6" cy="12.5" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="6" cy="19.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

const FullstackIcon: IconFn = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cls(className)}>
    <rect x="2" y="3" width="9" height="8" rx="1.5" />
    <rect x="13" y="3" width="9" height="8" rx="1.5" />
    <rect x="2" y="13" width="9" height="8" rx="1.5" />
    <rect x="13" y="13" width="9" height="8" rx="1.5" />
  </svg>
);

const ReactNativeIcon: IconFn = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cls(className)}>
    <rect x="7" y="2" width="10" height="20" rx="2" />
    <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
    <ellipse cx="12" cy="10" rx="4" ry="1.6" />
    <ellipse cx="12" cy="10" rx="4" ry="1.6" transform="rotate(60 12 10)" />
    <ellipse cx="12" cy="10" rx="4" ry="1.6" transform="rotate(120 12 10)" />
  </svg>
);

const FlutterIcon: IconFn = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cls(className)}>
    <polyline points="12 2 20 10 16 14 8 6" />
    <polyline points="8 14 12 18 20 10" />
    <polyline points="4 18 8 14 12 18 8 22" />
  </svg>
);

const AndroidKotlinIcon: IconFn = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cls(className)}>
    <path d="M5 16a7 7 0 0 1 14 0" />
    <rect x="8" y="16" width="8" height="6" rx="1" />
    <circle cx="9.5" cy="13.5" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="13.5" r="0.8" fill="currentColor" stroke="none" />
    <line x1="9" y1="5" x2="7" y2="2" />
    <line x1="15" y1="5" x2="17" y2="2" />
  </svg>
);

const AndroidJavaIcon: IconFn = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cls(className)}>
    <path d="M8 14c0-2.5 1.5-4 4-4s4 1.5 4 4" />
    <path d="M7 14v4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4" />
    <path d="M9 6c0-2 1.5-3 3-3s3 1 3 3v3H9V6z" />
    <path d="M10 8h4" />
  </svg>
);

const IOSSwiftIcon: IconFn = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cls(className)}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M17 9c-1.5-2-5-3-7.5-1.5 3 0 4.5 2 4.5 3.5s-1 3-2.5 3.5C13 16 17 14.5 17 9z" />
    <path d="M8 17c1 .5 2 .5 3 0" />
  </svg>
);

const IOSObjCIcon: IconFn = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cls(className)}>
    <polyline points="7 4 3 12 7 20" />
    <polyline points="17 4 21 12 17 20" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const DevOpsIcon: IconFn = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cls(className)}>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const CloudIcon: IconFn = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cls(className)}>
    <path d="M18 10a6 6 0 0 0-11.88-1A4 4 0 0 0 6 17h12a4 4 0 0 0 0-8z" />
    <path d="M10 17v3M14 17v3M8 20h8" />
  </svg>
);

const DataEngineerIcon: IconFn = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cls(className)}>
    <ellipse cx="12" cy="5" rx="8" ry="2.5" />
    <path d="M4 5v5c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5V5" />
    <path d="M4 10v5c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5v-5" />
    <path d="M4 15v4c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5v-4" />
  </svg>
);

const MLAIIcon: IconFn = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cls(className)}>
    <circle cx="12" cy="12" r="3" />
    <circle cx="4" cy="7" r="1.5" />
    <circle cx="20" cy="7" r="1.5" />
    <circle cx="4" cy="17" r="1.5" />
    <circle cx="20" cy="17" r="1.5" />
    <circle cx="12" cy="3" r="1.5" />
    <circle cx="12" cy="21" r="1.5" />
    <line x1="9" y1="12" x2="5.5" y2="7" />
    <line x1="15" y1="12" x2="18.5" y2="7" />
    <line x1="9" y1="12" x2="5.5" y2="17" />
    <line x1="15" y1="12" x2="18.5" y2="17" />
    <line x1="12" y1="9" x2="12" y2="4.5" />
    <line x1="12" y1="15" x2="12" y2="19.5" />
  </svg>
);

const BlockchainIcon: IconFn = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cls(className)}>
    <rect x="2" y="8" width="5" height="4" rx="1" />
    <rect x="9.5" y="5" width="5" height="4" rx="1" />
    <rect x="9.5" y="15" width="5" height="4" rx="1" />
    <rect x="17" y="8" width="5" height="4" rx="1" />
    <line x1="7" y1="10" x2="9.5" y2="7" />
    <line x1="7" y1="10" x2="9.5" y2="17" />
    <line x1="14.5" y1="7" x2="17" y2="10" />
    <line x1="14.5" y1="17" x2="17" y2="10" />
  </svg>
);

const GameDevIcon: IconFn = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cls(className)}>
    <rect x="2" y="8" width="20" height="10" rx="3" />
    <line x1="8" y1="12" x2="8" y2="12" />
    <line x1="6" y1="14" x2="10" y2="14" />
    <line x1="8" y1="12" x2="8" y2="16" />
    <circle cx="16" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="18" cy="14" r="1" fill="currentColor" stroke="none" />
    <path d="M5 8V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2" />
  </svg>
);

const EmbeddedIcon: IconFn = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cls(className)}>
    <rect x="7" y="7" width="10" height="10" rx="1" />
    <line x1="9" y1="7" x2="9" y2="4" />
    <line x1="12" y1="7" x2="12" y2="4" />
    <line x1="15" y1="7" x2="15" y2="4" />
    <line x1="9" y1="17" x2="9" y2="20" />
    <line x1="12" y1="17" x2="12" y2="20" />
    <line x1="15" y1="17" x2="15" y2="20" />
    <line x1="7" y1="9" x2="4" y2="9" />
    <line x1="7" y1="12" x2="4" y2="12" />
    <line x1="7" y1="15" x2="4" y2="15" />
    <line x1="17" y1="9" x2="20" y2="9" />
    <line x1="17" y1="12" x2="20" y2="12" />
    <line x1="17" y1="15" x2="20" y2="15" />
  </svg>
);

export const TRACK_ICONS: Record<string, IconFn> = {
  'Web Frontend':      WebFrontendIcon,
  'Web Backend':       WebBackendIcon,
  'Fullstack':         FullstackIcon,
  'React Native':      ReactNativeIcon,
  'Flutter':           FlutterIcon,
  'Android (Kotlin)':  AndroidKotlinIcon,
  'Android (Java)':    AndroidJavaIcon,
  'iOS (Swift)':       IOSSwiftIcon,
  'iOS (Objective-C)': IOSObjCIcon,
  'DevOps / SRE':      DevOpsIcon,
  'Cloud Engineer':    CloudIcon,
  'Data Engineer':     DataEngineerIcon,
  'ML / AI Engineer':  MLAIIcon,
  'Blockchain / Web3': BlockchainIcon,
  'Game Developer':    GameDevIcon,
  'Embedded / IoT':    EmbeddedIcon,
};
