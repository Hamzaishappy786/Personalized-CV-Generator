import { X, Zap, CheckCircle, LogOut } from 'lucide-react';
import { useHuggingFaceAuth } from '../../hooks/useHuggingFaceAuth';
import { TokenInput } from './TokenInput';

interface Props { onClose: () => void }

export function HFConnectModal({ onClose }: Props) {
  const { isConnected, isLoading, error, method, loginWithOAuth, loginWithToken, logout } = useHuggingFaceAuth();
  const hasClientId = !!import.meta.env.VITE_HF_CLIENT_ID;

  if (isConnected) {
    return (
      <ModalShell onClose={onClose}>
        <div className="text-center py-4">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Connected!</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Using {method === 'oauth' ? 'Hugging Face OAuth' : 'manual token'}.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">AI bullet-point enhancement is ready.</p>
          <button onClick={() => logout()} className="flex items-center gap-2 mx-auto text-sm text-red-500 hover:text-red-600">
            <LogOut size={14} /> Disconnect
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-center gap-2 mb-1">
        <Zap size={18} className="text-indigo-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Connect Hugging Face</h3>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
        Enable AI-powered bullet enhancements for your experience and projects.
      </p>

      {hasClientId && (
        <>
          <button
            onClick={loginWithOAuth}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 text-sm font-medium rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 disabled:opacity-40 transition-colors mb-4"
          >
            <img src="/logo.svg" className="w-4 h-4" alt="" />
            Connect with Hugging Face
          </button>
          <div className="flex items-center gap-3 mb-4">
            <hr className="flex-1 border-gray-200 dark:border-gray-700" />
            <span className="text-xs text-gray-400 dark:text-gray-500">or</span>
            <hr className="flex-1 border-gray-200 dark:border-gray-700" />
          </div>
        </>
      )}

      <TokenInput onSubmit={loginWithToken} isLoading={isLoading} />

      {error && (
        <p className="mt-3 text-xs text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </ModalShell>
  );
}

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}
