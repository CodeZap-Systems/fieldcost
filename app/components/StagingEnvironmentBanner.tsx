'use client';

import { isStagingEnvironment } from '@/lib/runtimeEnvironment';

export default function StagingEnvironmentBanner() {
  if (!isStagingEnvironment()) {
    return null;
  }

  return (
    <div className="w-full bg-orange-500 text-white px-4 py-2 text-center text-sm font-semibold">
      ⚠️ STAGING ENVIRONMENT - Changes may not persist
    </div>
  );
}
