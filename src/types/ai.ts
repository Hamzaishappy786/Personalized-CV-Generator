export interface AIEnhanceRequest {
  rawText: string;
  context: 'experience' | 'project';
  track: string;
}

export interface AIEnhanceResult {
  enhanced: string[];
  isLoading: boolean;
  error: string | null;
}

export interface HFModel {
  id: string;
  label: string;
  maxTokens: number;
}
