// Single source of truth for AR aging classification, driven purely by
// days_out. Both the bucket cards and the table badges must call this so
// they can never disagree with each other.
export function arAgingBucket(daysOut) {
  const d = Number(daysOut) || 0;
  if (d <= 30) return "current";
  if (d <= 60) return "aging";
  return "overdue";
}

export const AR_AGING_BADGE_LABEL = {
  current: "Open",
  aging: "Aging",
  overdue: "Overdue",
};
