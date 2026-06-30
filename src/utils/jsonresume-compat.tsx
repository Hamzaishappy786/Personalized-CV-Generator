import React from 'react';

interface BaseProps {
  children?: React.ReactNode;
  className?: string;
}

// Passthrough wrappers so styled(X) works in adapted themes
export const Section = ({ children, className }: BaseProps) =>
  <div className={className}>{children}</div>;

export const SectionTitle = ({ children, className }: BaseProps) =>
  <h2 className={className}>{children}</h2>;

export const ListItem = ({ children, className }: BaseProps) =>
  <li className={className}>{children}</li>;

export const Badge = ({ children, className }: BaseProps) =>
  <span className={className}>{children}</span>;

export const BadgeList = ({ children, className }: BaseProps) =>
  <div className={className}>{children}</div>;

interface ContactInfoProps extends BaseProps {
  type?: string;
}
export const ContactInfo = ({ children, className }: ContactInfoProps) =>
  <span className={className}>{children}</span>;

interface LinkProps extends BaseProps {
  href?: string;
  target?: string;
  rel?: string;
}
export const Link = ({ href, children, target, rel, className }: LinkProps) =>
  <a href={href} target={target} rel={rel} className={className}>{children}</a>;

// DateRange component — handles "MMM YYYY – MMM YYYY" / "Present"
interface DateRangeProps extends BaseProps {
  startDate?: string;
  endDate?: string;
}

function fmtDate(d?: string): string {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
}

export function DateRange({ startDate, endDate, className }: DateRangeProps) {
  const start = fmtDate(startDate);
  const end = endDate ? fmtDate(endDate) : 'Present';
  return <span className={className}>{start}{start ? ` – ${end}` : end}</span>;
}

// Utility functions
export function safeUrl(url: string): string {
  if (!url) return '#';
  if (url.startsWith('javascript:')) return '#';
  if (!url.startsWith('http') && !url.startsWith('mailto:') && !url.startsWith('/')) {
    return `https://${url}`;
  }
  return url;
}

export function getLinkRel(url: string, external?: boolean): string {
  return external || url.startsWith('http') ? 'noopener noreferrer' : '';
}

export function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}
