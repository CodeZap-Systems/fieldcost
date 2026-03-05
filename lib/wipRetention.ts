/**
 * Calculate WIP and retention amounts based on contract metrics
 */

export interface WipCalculation {
  earnedValue: number;
  wipAmount: number;
  retentionAmount: number;
  netClaimable: number;
}

export interface WipInput {
  contractValue: number;
  percentComplete: number;
  billedToDate: number;
  retentionPercent: number;
}

/**
 * Calculate WIP, retention, and net claimable amounts
 * 
 * Formulas:
 * - Earned Value = Contract Value × (% Complete / 100)
 * - WIP = Earned Value - Billed to Date
 * - Retention = WIP × (Retention % / 100)
 * - Net Claimable = WIP - Retention
 */
export function calculateWipRetention(input: WipInput): WipCalculation {
  const { contractValue, percentComplete, billedToDate, retentionPercent } = input;

  // Calculate Earned Value
  const earnedValue = (contractValue * percentComplete) / 100;

  // Calculate WIP (Earned Value - Billed to Date)
  const wipAmount = earnedValue - billedToDate;

  // Calculate Retention
  const retentionAmount = (wipAmount * retentionPercent) / 100;

  // Calculate Net Claimable (WIP - Retention)
  const netClaimable = wipAmount - retentionAmount;

  return {
    earnedValue: parseFloat(earnedValue.toFixed(2)),
    wipAmount: parseFloat(wipAmount.toFixed(2)),
    retentionAmount: parseFloat(retentionAmount.toFixed(2)),
    netClaimable: parseFloat(netClaimable.toFixed(2)),
  };
}
