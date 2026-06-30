import { useAuthStore } from '../store/authStore';
import { generateCodeVerifier, generateCodeChallenge, generateState, buildAuthUrl, exchangeCodeForToken } from '../utils/oauth';

const CLIENT_ID = import.meta.env.VITE_HF_CLIENT_ID ?? '';
const REDIRECT_URI = `${window.location.origin}/callback`;
const SCOPES = 'inference-api read-repos';

const VERIFIER_KEY = 'hf_pkce_verifier';
const STATE_KEY = 'hf_oauth_state';

export function useHuggingFaceAuth() {
  const { token, isConnected, isLoading, error, method, setToken, clearToken, setLoading, setError } = useAuthStore();

  const loginWithOAuth = async () => {
    if (!CLIENT_ID) {
      setError('No HF Client ID configured. Use manual token entry instead.');
      return;
    }
    try {
      const verifier = await generateCodeVerifier();
      const challenge = await generateCodeChallenge(verifier);
      const state = generateState();

      localStorage.setItem(VERIFIER_KEY, verifier);
      localStorage.setItem(STATE_KEY, state);

      window.location.href = buildAuthUrl(CLIENT_ID, REDIRECT_URI, challenge, state, SCOPES);
    } catch {
      setError('Failed to start OAuth flow. Please use manual token entry.');
    }
  };

  const handleOAuthCallback = async (code: string, returnedState: string) => {
    const storedState = localStorage.getItem(STATE_KEY);
    const verifier = localStorage.getItem(VERIFIER_KEY);

    if (returnedState !== storedState) {
      setError('State mismatch — possible CSRF. Please try again.');
      return;
    }
    if (!verifier) {
      setError('PKCE verifier missing. Please try again.');
      return;
    }

    setLoading(true);
    try {
      const accessToken = await exchangeCodeForToken(code, verifier, CLIENT_ID, REDIRECT_URI);
      setToken(accessToken, 'oauth');
    } catch (err) {
      setError('Token exchange failed. Try pasting your token manually.');
    } finally {
      localStorage.removeItem(VERIFIER_KEY);
      localStorage.removeItem(STATE_KEY);
      setLoading(false);
    }
  };

  const loginWithToken = (rawToken: string) => {
    const trimmed = rawToken.trim();
    if (!trimmed) {
      setError('Please enter a valid Hugging Face token.');
      return;
    }
    setToken(trimmed, 'manual');
  };

  const logout = () => clearToken();

  return { token, isConnected, isLoading, error, method, loginWithOAuth, handleOAuthCallback, loginWithToken, logout };
}
