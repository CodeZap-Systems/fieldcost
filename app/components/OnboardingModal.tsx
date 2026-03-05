"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface OnboardingModalProps {
  isOpen: boolean;
  onExploreDemo: () => void;
  onStayInWorkspace: () => void;
  isLoading?: boolean;
}

/**
 * OnboardingModal
 * Displayed after signup when user's workspace is empty.
 * Offers choice to explore demo with sample data or stay in empty workspace.
 */
export function OnboardingModal({
  isOpen,
  onExploreDemo,
  onStayInWorkspace,
  isLoading = false,
}: OnboardingModalProps) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
          <h2
            id="onboarding-title"
            className="text-2xl font-bold mb-2"
          >
            Welcome to FieldCost!
          </h2>
          <p className="text-blue-100">
            Your workspace is ready. Let's explore how it works.
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-8 space-y-6">
          {/* Illustration/Icon area */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>

          {/* Question */}
          <div className="text-center">
            <p className="text-gray-700 font-medium">
              Want to see how this works with sample data?
            </p>
          </div>

          {/* Demo showcase benefits */}
          <div className="bg-orange-50 rounded-lg p-4 space-y-2 border border-orange-100">
            <p className="text-sm font-semibold text-gray-900">
              Try the Demo Workspace:
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>See projects, tasks, and invoices</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Explore all features risk-free</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Switch to your workspace anytime</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onExploreDemo}
              disabled={isLoading}
              className="w-full px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Explore Demo"}
            </button>
            <button
              onClick={onStayInWorkspace}
              disabled={isLoading}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Stay in My Workspace
            </button>
          </div>

          {/* Footer note */}
          <p className="text-xs text-center text-gray-500">
            You can switch between demo and your workspace anytime from the sidebar.
          </p>
        </div>
      </div>
    </div>
  );
}

export default OnboardingModal;
