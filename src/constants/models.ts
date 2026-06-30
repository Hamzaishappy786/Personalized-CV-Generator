import type { HFModel } from '../types/ai';

export const HF_MODELS: HFModel[] = [
  {
    id: 'mistralai/Mistral-7B-Instruct-v0.3',
    label: 'Mistral 7B Instruct',
    maxTokens: 512,
  },
  {
    id: 'meta-llama/Meta-Llama-3-8B-Instruct',
    label: 'Llama 3 8B Instruct',
    maxTokens: 512,
  },
  {
    id: 'HuggingFaceH4/zephyr-7b-beta',
    label: 'Zephyr 7B Beta',
    maxTokens: 512,
  },
];

export const DEFAULT_MODEL = HF_MODELS[0];

export const HF_OAUTH_CLIENT_ID = import.meta.env.VITE_HF_CLIENT_ID ?? '';
export const HF_OAUTH_REDIRECT_URI = `${window.location.origin}/callback`;
export const HF_OAUTH_SCOPES = 'inference-api';
