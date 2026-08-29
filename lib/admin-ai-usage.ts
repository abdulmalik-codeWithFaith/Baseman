/* ---------------------------------------------------------------
   Platform-wide AI usage data for the admin panel. Mock for now —
   replace with real numbers from your AI service module's usage
   tracker once it's logging actual calls and token costs.
   Cost figures here are illustrative placeholders, not derived
   from a real provider rate — set your actual per-token pricing
   before treating these numbers as real billing data.
---------------------------------------------------------------- */

export interface AiOperation {
  name: string;
  calls: number;
  avgCostPerCall: number; // USD, placeholder rate
}

export const AI_OPERATIONS: AiOperation[] = [
  { name: "Job matching", calls: 5210, avgCostPerCall: 0.006 },
  { name: "Resume optimization", calls: 1840, avgCostPerCall: 0.021 },
  { name: "Job parsing (AI import)", calls: 312, avgCostPerCall: 0.014 },
  { name: "Interview question generation", calls: 940, avgCostPerCall: 0.018 },
  { name: "Interview answer evaluation", calls: 610, avgCostPerCall: 0.024 },
];

// Calls per day, most recent 14 days, oldest first
export const DAILY_CALLS: number[] = [312, 298, 340, 355, 410, 388, 402, 375, 420, 460, 445, 480, 512, 495];

export function totalCalls() {
  return AI_OPERATIONS.reduce((sum, op) => sum + op.calls, 0);
}

export function totalCost() {
  return AI_OPERATIONS.reduce((sum, op) => sum + op.calls * op.avgCostPerCall, 0);
}