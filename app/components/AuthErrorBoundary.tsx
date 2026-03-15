/**
 * Authentication Error Boundary
 * Catches and displays authentication errors gracefully
 */

'use client';

import { ReactNode, useState, useEffect } from 'react';

interface AuthErrorBoundaryProps {
  children: ReactNode;
}

export function AuthErrorBoundary({ children }: AuthErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes('auth') || event.message.includes('unauthorized')) {
        setHasError(true);
        setError(event.message);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="p-8 rounded-lg border border-red-300 bg-red-50">
        <h2 className="text-lg font-semibold text-red-900 mb-2">Authentication Error</h2>
        <p className="text-red-800">{error || 'An authentication error occurred. Please try logging in again.'}</p>
      </div>
    );
  }

  return <>{children}</>;
}
