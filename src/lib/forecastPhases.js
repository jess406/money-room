// Pure calculation: derives Aggressive/Conservative 13-week forecasts from
// Current's real cash_in/cash_out by moving only the itemized ar_invoices/
// ap_bills line items to their phase-adjusted week. The non-itemized portion
// of Current's cash flow (baseline recurring revenue/opex not captured in
// either table) is extracted once and left untouched in every phase.
//
// No AI, no network calls -- takes already-fetched rows, returns a plain
// array shaped like cash_forecast.

const DISCRETIONARY_CATEGORIES = new Set(["Marketing", "Advisory"]);
const AGGRESSIVE_DISCRETIONARY_DISCOUNT = 0.05;
const CONSERVATIVE_COLLECTION_DELAY_DAYS = 18;

// Guardrail thresholds for the derived phases. Current's own alert_status
// values aren't reconstructable from a formula (see step-1 notes), so this
// only applies to Aggressive/Conservative, using Current's per-week implied
// daily burn (ending_cash / runway_days) to stay consistent with the
// existing dashboard without guessing Current's exact model.
const RUNWAY_CRITICAL_DAYS = 60;
const RUNWAY_WATCH_DAYS = 120;

function parseLocalDate(dateStr) {
  return new Date(dateStr + "T00:00:00");
}

function addDays(dateStr, days) {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + days);
  return d;
}

function dedupeBills(apBills) {
  const seen = new Map();
  for (const bill of apBills) {
    const key = `${bill.vendor}|${bill.category}|${bill.amount}|${bill.due_date}|${bill.status}`;
    if (!seen.has(key)) seen.set(key, bill);
  }
  return [...seen.values()];
}

function weekIndexForDate(weeks, date) {
  return weeks.findIndex((w) => {
    const start = parseLocalDate(w.week_start);
    const end = parseLocalDate(w.week_end);
    return date >= start && date <= end;
  });
}

export function computeForecastPhase(cashForecast, arInvoices, apBills, phase) {
  const weeks = [...cashForecast].sort((a, b) => a.week_number - b.week_number);

  if (phase === "current") return weeks;
  if (weeks.length === 0) return [];

  const dedupedBills = dedupeBills(apBills);

  // Extract the non-itemized baseline: Current's real cash_in/cash_out minus
  // the itemized AR/AP amounts, bucketed at their RAW due_date. This is the
  // portion of cash flow this feature intentionally does not touch.
  const baselineIn = weeks.map((w) => Number(w.cash_in) || 0);
  const baselineOut = weeks.map((w) => Number(w.cash_out) || 0);

  for (const inv of arInvoices) {
    const idx = weekIndexForDate(weeks, parseLocalDate(inv.due_date));
    if (idx >= 0) baselineIn[idx] -= Number(inv.amount) || 0;
  }
  for (const bill of dedupedBills) {
    const idx = weekIndexForDate(weeks, parseLocalDate(bill.due_date));
    if (idx >= 0) baselineOut[idx] -= Number(bill.amount) || 0;
  }

  // Re-bucket AR at the phase-adjusted collection date. Invoices whose
  // adjusted date falls outside the 13-week window are dropped -- their
  // cash isn't visible within this forecast horizon, not an error.
  const phaseIn = new Array(weeks.length).fill(0);
  for (const inv of arInvoices) {
    const collectDate =
      phase === "aggressive"
        ? parseLocalDate(inv.due_date)
        : addDays(inv.due_date, CONSERVATIVE_COLLECTION_DELAY_DAYS);
    const idx = weekIndexForDate(weeks, collectDate);
    if (idx >= 0) phaseIn[idx] += Number(inv.amount) || 0;
  }

  // Re-bucket AP at its raw due_date in every phase (never shifted).
  // Discretionary categories (Marketing, Advisory) get a 5% trim only for
  // Aggressive. Payroll/Rent/fixed categories are never adjusted.
  const phaseOut = new Array(weeks.length).fill(0);
  for (const bill of dedupedBills) {
    const idx = weekIndexForDate(weeks, parseLocalDate(bill.due_date));
    if (idx < 0) continue;
    let amount = Number(bill.amount) || 0;
    if (phase === "aggressive" && DISCRETIONARY_CATEGORIES.has(bill.category)) {
      amount *= 1 - AGGRESSIVE_DISCRETIONARY_DISCOUNT;
    }
    phaseOut[idx] += amount;
  }

  // Roll beginning -> ending cash week over week, starting from Current's
  // real week-1 beginning_cash (that number is real and doesn't change
  // based on assumptions).
  let beginningCash = Number(weeks[0].beginning_cash) || 0;

  return weeks.map((w, i) => {
    const cash_in = Math.round(baselineIn[i] + phaseIn[i]);
    const cash_out = Math.round(baselineOut[i] + phaseOut[i]);
    const beginning_cash = Math.round(beginningCash);
    const ending_cash = Math.round(beginning_cash + cash_in - cash_out);
    beginningCash = ending_cash;

    const impliedDailyBurn = w.runway_days > 0 ? (Number(w.ending_cash) || 0) / w.runway_days : null;
    const runway_days = impliedDailyBurn ? Math.max(0, Math.round(ending_cash / impliedDailyBurn)) : null;
    const alert_status =
      runway_days === null
        ? w.alert_status
        : runway_days < RUNWAY_CRITICAL_DAYS
        ? "Critical"
        : runway_days < RUNWAY_WATCH_DAYS
        ? "Watch"
        : "Healthy";

    return {
      id: `${phase}-${w.week_number}`,
      week_number: w.week_number,
      week_start: w.week_start,
      week_end: w.week_end,
      beginning_cash,
      cash_in,
      cash_out,
      ending_cash,
      runway_days,
      alert_status,
    };
  });
}
