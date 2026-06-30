import { InferenceClient } from '@huggingface/inference';

export function createHFClient(token: string) {
  return new InferenceClient(token);
}

export function buildEnhancePrompt(
  rawText: string,
  context: 'experience' | 'project',
  track: string
): string {
  return `You are a professional resume writer for ${track} developers.

Rewrite the following rough notes into 3-5 polished, high-impact resume bullets using the XYZ formula: "Accomplished X as measured by Y by doing Z."

Rules:
- Begin every bullet with a strong action verb (Built, Architected, Reduced, Increased, Shipped, Designed, Led, Optimized, Migrated)
- Include concrete metrics wherever possible
- Each bullet: one to two lines max
- Focus on technical impact and business outcomes
- Output ONLY the bullets, one per line, each starting with •
- No explanations, no headers, no markdown

Context: ${context === 'experience' ? 'Work Experience' : 'Project Description'}
Developer Track: ${track}

Raw notes:
${rawText}

Polished resume bullets:`;
}

export const FALLBACK_MODELS = [
  'mistralai/Mistral-7B-Instruct-v0.3',
  'meta-llama/Meta-Llama-3-8B-Instruct',
  'HuggingFaceH4/zephyr-7b-beta',
];
