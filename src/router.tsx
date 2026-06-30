import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { WelcomeScreen } from './components/onboarding/WelcomeScreen';
import { SkillsScreen } from './components/onboarding/SkillsScreen';
import { OAuthCallback } from './components/auth/OAuthCallback';
import { BuilderScreen } from './components/builder/BuilderScreen';
import { TemplatePicker } from './components/preview/TemplatePicker';
import { ResumePreviewPage } from './components/preview/ResumePreviewPage';

const router = createBrowserRouter([
  { path: '/',           element: <WelcomeScreen /> },
  { path: '/skills',     element: <SkillsScreen /> },
  { path: '/builder',    element: <BuilderScreen /> },
  { path: '/callback',   element: <OAuthCallback /> },
  { path: '/templates',  element: <TemplatePicker /> },
  { path: '/preview',    element: <ResumePreviewPage /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
