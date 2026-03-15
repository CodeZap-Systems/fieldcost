/**
 * Back Button Component
 * Simple navigation button to go back to previous page
 */

'use client';

import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
      aria-label="Go back"
    >
      Back
    </button>
  );
}
