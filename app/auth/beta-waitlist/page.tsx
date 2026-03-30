/**
 * Beta Waitlist Page
 * Shown to authenticated users who are not yet on the beta_access allowlist.
 */

import Link from "next/link";

export default function BetaWaitlistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-bold text-indigo-600">FC</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FieldCost Beta</h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Beta Access Required
          </h2>
          <p className="text-gray-600 mb-6">
            Your account is not yet approved for the FieldCost internal beta.
            Please contact your administrator to request access.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left text-sm text-gray-700">
            <p className="font-semibold mb-1">To get access:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Contact your FieldCost administrator</li>
              <li>
                Provide your email address or Microsoft account used to sign in
              </li>
              <li>They will add you to the beta allowlist</li>
              <li>Sign in again once approved</li>
            </ol>
          </div>

          <Link
            href="/auth/login"
            className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
