import type { ReactElement } from 'react';
import type { TemplateProps } from '../../types/jsonresume';
import { ModernClassicTemplate } from './templates/ModernClassicTemplate';
import { DeveloperMonoTemplate } from './templates/DeveloperMonoTemplate';
import { SidebarTemplate } from './templates/SidebarTemplate';

export interface TemplateEntry {
  id: string;
  label: string;
  description: string;
  accent: string;
  component: (props: TemplateProps) => ReactElement;
}

export const TEMPLATES: TemplateEntry[] = [
  {
    id: 'modern-classic',
    label: 'Modern Classic',
    description: 'Clean two-column header, blue accents, boxed skills grid.',
    accent: 'bg-blue-600',
    component: ModernClassicTemplate,
  },
  {
    id: 'developer-mono',
    label: 'Developer Mono',
    description: 'JetBrains Mono font, arrow bullets, dark code-block skills.',
    accent: 'bg-indigo-600',
    component: DeveloperMonoTemplate,
  },
  {
    id: 'sidebar',
    label: 'Sidebar',
    description: 'Dark navy sidebar, timeline experience, great for print.',
    accent: 'bg-slate-800',
    component: SidebarTemplate,
  },
];

export function getTemplate(id: string): TemplateEntry {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
