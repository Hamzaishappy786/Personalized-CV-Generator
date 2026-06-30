export type AuthMethod = 'oauth' | 'manual' | null;

export interface HFAuthState {
  token: string | null;
  method: AuthMethod;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface PKCEChallenge {
  codeVerifier: string;
  codeChallenge: string;
  state: string;
}

export interface OAuthCallbackParams {
  code: string;
  state: string;
}

export interface HFTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}
