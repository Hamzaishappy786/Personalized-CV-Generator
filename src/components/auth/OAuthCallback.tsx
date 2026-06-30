import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHuggingFaceAuth } from '../../hooks/useHuggingFaceAuth';
import { Loader2 } from 'lucide-react';

export function OAuthCallback() {
  const navigate = useNavigate();
  const { handleOAuthCallback, error, isConnected } = useHuggingFaceAuth();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (!code || !state) {
      navigate('/builder', { replace: true });
      return;
    }

    handleOAuthCallback(code, state).then(() => {
      navigate('/builder', { replace: true });
    });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-red-500 font-medium">OAuth failed</p>
        <p className="text-sm text-gray-500">{error}</p>
        <button
          onClick={() => navigate('/builder', { replace: true })}
          className="text-sm text-indigo-600 underline"
        >
          Go back
        </button>
      </div>
    );
  }

  if (isConnected) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-gray-500">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      <p className="text-sm">Completing sign-in…</p>
    </div>
  );
}
