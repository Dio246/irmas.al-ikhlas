import React, { useState, useEffect } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error('Captured window error:', event.error);
      setHasError(true);
      setErrorMessage(event.error?.message || event.message || 'Unknown error');
    };

    const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      console.error('Captured unhandled rejection:', event.reason);
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', unhandledRejectionHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', unhandledRejectionHandler);
    };
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-xl border border-rose-100 text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Terjadi Gangguan Tampilan</h2>
          <p className="text-sm text-slate-600 mb-4">
            Silakan muat ulang halaman untuk memperbarui tampilan.
          </p>
          {errorMessage && (
            <p className="text-xs bg-slate-100 p-2.5 rounded-lg text-slate-500 font-mono text-left overflow-auto max-h-24 mb-4">
              {errorMessage}
            </p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition cursor-pointer shadow-sm"
          >
            Muat Ulang Halaman
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
