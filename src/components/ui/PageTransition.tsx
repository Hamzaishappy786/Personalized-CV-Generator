import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function PageTransition({ children }: Props) {
  return <div className="page-enter">{children}</div>;
}
