"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  label?: string;
  className?: string;
}

export function BackButton({ label = "← Back", className = "" }: BackButtonProps) {
  const router = useRouter();
  
  return (
    <button
      onClick={() => router.back()}
      className={`
        inline-flex items-center gap-2 px-4 py-2 
        bg-gray-100 hover:bg-gray-200 
        text-gray-700 rounded-lg 
        font-medium transition-colors
        ${className}
      `}
    >
      {label}
    </button>
  );
}
