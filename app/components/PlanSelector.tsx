'use client';

import { useState } from 'react';
import { subscriptionPlans } from '@/lib/paymentProviders';

interface PlanSelectorProps {
  selectedPlan: string;
  onPlanSelect: (planId: string) => void;
  onStartTrial: (planId: string) => Promise<void>;
  isLoading?: boolean;
}

export function PlanSelector({
  selectedPlan,
  onPlanSelect,
  onStartTrial,
  isLoading,
}: PlanSelectorProps) {
  const [isStartingTrial, setIsStartingTrial] = useState(false);
  const [trialError, setTrialError] = useState('');

  const handleStartTrial = async (planId: string) => {
    setTrialError('');
    setIsStartingTrial(true);
    try {
      await onStartTrial(planId);
    } catch (error) {
      setTrialError(
        error instanceof Error
          ? error.message
          : 'Failed to start trial'
      );
    } finally {
      setIsStartingTrial(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h3>
        <p className="text-gray-600 mb-6">
          Start with a 14-day free trial. No credit card required.
        </p>
      </div>

      {trialError && (
        <div className="p-3 bg-red-100 border border-red-400 rounded text-red-700 text-sm">
          {trialError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(subscriptionPlans).map(([planId, plan]) => (
          <div
            key={planId}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedPlan === planId
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
            onClick={() => onPlanSelect(planId)}
          >
            {/* Plan Header */}
            <div className="mb-4">
              <h4 className="text-lg font-bold text-gray-900">
                {plan.name}
              </h4>
              <div className="flex items-baseline mt-2">
                <span className="text-3xl font-bold text-gray-900">
                  R{(plan.price / 100).toFixed(2)}
                </span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {plan.trialDays}-day free trial
              </p>
            </div>

            {/* Features List */}
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start text-sm text-gray-700"
                >
                  <span className="text-indigo-600 mr-3 font-bold">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            {/* Trial Button */}
            <button
              type="button"
              onClick={() => handleStartTrial(planId)}
              disabled={isLoading || isStartingTrial}
              className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                selectedPlan === planId
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isStartingTrial ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                  Starting Trial...
                </span>
              ) : (
                `Start ${plan.trialDays}-Day Trial`
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
        <p className="font-semibold text-blue-900 mb-2">
          Trial includes all features
        </p>
        <ul className="space-y-1 text-blue-900">
          <li>✓ Full access to all features</li>
          <li>✓ No credit card required</li>
          <li>✓ Cancel anytime</li>
          <li>✓ Auto-upgrade to paid plan after trial (optional)</li>
        </ul>
      </div>
    </div>
  );
}
