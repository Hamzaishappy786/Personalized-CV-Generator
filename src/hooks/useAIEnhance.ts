import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useResumeStore } from '../store/resumeStore';
import { createHFClient, buildEnhancePrompt, FALLBACK_MODELS } from '../services/hfClient';

export function useAIEnhance() {
  const token = useAuthStore((s) => s.token);
  const track = useResumeStore((s) => s.track);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enhance = async (
    rawText: string,
    context: 'experience' | 'project'
  ): Promise<string[]> => {
    if (!token) {
      setError('Connect Hugging Face first to use AI enhancement.');
      return [];
    }
    if (!rawText.trim()) {
      setError('Enter some text to enhance.');
      return [];
    }

    setIsLoading(true);
    setError(null);

    const client = createHFClient(token);
    const prompt = buildEnhancePrompt(rawText, context, track);

    for (const model of FALLBACK_MODELS) {
      try {
        const result = await client.chatCompletion({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 512,
          temperature: 0.7,
        });

        const text = result.choices?.[0]?.message?.content ?? '';
        const bullets = text
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l.startsWith('•'))
          .map((l) => l.replace(/^•\s*/, '').trim())
          .filter(Boolean);

        setIsLoading(false);
        return bullets.length > 0 ? bullets : [text.trim()].filter(Boolean);
      } catch {
        // try next model
      }
    }

    setError('All models failed. Check your token or try again.');
    setIsLoading(false);
    return [];
  };

  return { enhance, isLoading, error, isConnected: !!token };
}
