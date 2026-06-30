import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { WelcomeScreen } from './components/onboarding/WelcomeScreen';
import { SkillsScreen } from './components/onboarding/SkillsScreen';
import { OAuthCallback } from './components/auth/OAuthCallback';
import { BuilderScreen } from './components/builder/BuilderScreen';
import { TemplatePicker } from './components/preview/TemplatePicker';
import { ResumePreviewPage } from './components/preview/ResumePreviewPage';
import { PageTransition } from './components/ui/PageTransition';

const router = createBrowserRouter([
  { path: '/',          element: <PageTransition><WelcomeScreen /></PageTransition> },
  { path: '/skills',    element: <PageTransition><SkillsScreen /></PageTransition> },
  { path: '/builder',   element: <PageTransition><BuilderScreen /></PageTransition> },
  { path: '/callback',  element: <PageTransition><OAuthCallback /></PageTransition> },
  { path: '/templates', element: <PageTransition><TemplatePicker /></PageTransition> },
  { path: '/preview',   element: <PageTransition><ResumePreviewPage /></PageTransition> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
