import { useState } from 'react';
import { Key, Eye, EyeOff } from 'lucide-react';

interface Props {
  onSubmit: (token: string) => void;
  isLoading: boolean;
}

export function TokenInput({ onSubmit, isLoading }: Props) {
  const [value, setValue] = useState('');
  const [visible, setVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Paste your Hugging Face Access Token
      </label>

      <div className="relative">
        <Key size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="hf_xxxxxxxxxxxxxxxxxxxx"
          className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 font-mono"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          tabIndex={-1}
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>

      <p className="text-xs text-gray-400">
        Create one at{' '}
        <a
          href="https://huggingface.co/settings/tokens"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-500 underline underline-offset-2"
        >
          huggingface.co/settings/tokens
        </a>{' '}
        Read access is enough.
      </p>

      <button
        type="submit"
        disabled={!value.trim() || isLoading}
        className="w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Saving…' : 'Save Token'}
      </button>
    </form>
  );
}
