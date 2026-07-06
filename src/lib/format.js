const MONTH_INDEX = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

export function formatCurrency(value) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value + "T00:00:00");
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Parses labels like "Apr-26" into a sortable Date.
export function monthLabelToDate(label) {
  const [mon, yy] = label.split("-");
  const monthIndex = MONTH_INDEX[mon] ?? 0;
  const year = 2000 + parseInt(yy, 10);
  return new Date(year, monthIndex, 1);
}

export function sortByMonthLabel(rows) {
  return [...rows].sort(
    (a, b) => monthLabelToDate(a.month_label) - monthLabelToDate(b.month_label)
  );
}
