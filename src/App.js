// Auto-push test
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { html } from "./lib/html.js";
import { supabase } from "./supabaseClient.js";
import { sortByMonthLabel } from "./lib/format.js";
import Header from "./components/Header.js";
import KpiCards from "./components/KpiCards.js";
import InsightBar from "./components/InsightBar.js";
import MonthlyCharts from "./components/MonthlyCharts.js";
import ArAgingBuckets from "./components/ArAgingBuckets.js";
import ArAgingTable from "./components/ArAgingTable.js";
import BillsDueTable from "./components/BillsDueTable.js";
import CashFlowChart from "./components/CashFlowChart.js";
import WeeklyForecastTable from "./components/WeeklyForecastTable.js";
import PhaseToggle from "./components/PhaseToggle.js";
import { computeForecastPhase } from "./lib/forecastPhases.js";

export default function App() {
  const [monthlySummaries, setMonthlySummaries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [arInvoices, setArInvoices] = useState([]);
  const [apBills, setApBills] = useState([]);
  const [cashForecast, setCashForecast] = useState([]);
  const [forecastArInvoices, setForecastArInvoices] = useState([]);
  const [forecastApBills, setForecastApBills] = useState([]);
  const [error, setError] = useState(null);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [forecastPhase, setForecastPhase] = useState("current");

  // Load monthly_summary (drives dropdown + trend charts) and the
  // month-independent 13-week cash forecast once on mount. Also load ALL
  // AR invoices and AP bills here (unfiltered by month_label) -- the
  // Aggressive/Conservative forecast re-buckets by due_date across the
  // full 13-week window, which spans multiple month_labels, so it can't
  // reuse the month-scoped arInvoices/apBills state below.
  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      const [summaryRes, forecastRes, allArRes, allApRes] = await Promise.all([
        supabase.from("monthly_summary").select("*"),
        supabase.from("cash_forecast").select("*").order("week_number", { ascending: true }),
        supabase.from("ar_invoices").select("*"),
        supabase.from("ap_bills").select("*"),
      ]);

      if (cancelled) return;

      if (summaryRes.error) {
        setError(summaryRes.error.message);
        return;
      }
      if (forecastRes.error) {
        setError(forecastRes.error.message);
        return;
      }
      if (allArRes.error) {
        setError(allArRes.error.message);
        return;
      }
      if (allApRes.error) {
        setError(allApRes.error.message);
        return;
      }

      const sorted = sortByMonthLabel(summaryRes.data || []);
      setMonthlySummaries(sorted);
      setCashForecast(forecastRes.data || []);
      setForecastArInvoices(allArRes.data || []);
      setForecastApBills(allApRes.data || []);

      if (sorted.length > 0) {
        const now = new Date();
        const currentLabel = sorted.find((row) => {
          const d = new Date(row.month_label.replace(/^([A-Za-z]+)-(\d+)$/, (_, m, y) => `${m} 1, 20${y}`));
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
        setSelectedMonth((currentLabel || sorted[sorted.length - 1]).month_label);
      }
    }

    loadInitial();
    return () => { cancelled = true; };
  }, []);

  // Reload AR invoices + AP bills whenever the selected month changes.
  useEffect(() => {
    if (!selectedMonth) return;
    let cancelled = false;

    async function loadForMonth() {
      setLoadingMonth(true);
      const [arRes, apRes] = await Promise.all([
        supabase.from("ar_invoices").select("*").eq("month_label", selectedMonth),
        supabase.from("ap_bills").select("*").eq("month_label", selectedMonth),
      ]);

      if (cancelled) return;

      if (arRes.error) setError(arRes.error.message);
      else setArInvoices(arRes.data || []);

      if (apRes.error) setError(apRes.error.message);
      else setApBills(apRes.data || []);

      setLoadingMonth(false);
    }

    loadForMonth();
    return () => { cancelled = true; };
  }, [selectedMonth]);

  const selectedSummary = useMemo(
    () => monthlySummaries.find((row) => row.month_label === selectedMonth) || null,
    [monthlySummaries, selectedMonth]
  );

  const arTotal = useMemo(
    () => arInvoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0),
    [arInvoices]
  );

  const phaseForecast = useMemo(
    () => computeForecastPhase(cashForecast, forecastArInvoices, forecastApBills, forecastPhase),
    [cashForecast, forecastArInvoices, forecastApBills, forecastPhase]
  );

  // Shared y-axis domain across all three phases -- computed from all of
  // them regardless of which tab is selected, so switching to Conservative
  // doesn't auto-rescale the chart to its own smaller numbers and hide how
  // much worse it is relative to Current/Aggressive.
  const cashFlowYDomain = useMemo(() => {
    const CASH_THRESHOLD = 150000;
    const allEndingCash = ["current", "aggressive", "conservative"].flatMap((phase) =>
      computeForecastPhase(cashForecast, forecastArInvoices, forecastApBills, phase).map((w) => w.ending_cash)
    );
    if (allEndingCash.length === 0) return undefined;

    const min = Math.min(...allEndingCash, CASH_THRESHOLD, 0);
    const max = Math.max(...allEndingCash, CASH_THRESHOLD);
    const padding = (max - min) * 0.08;
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [cashForecast, forecastArInvoices, forecastApBills]);

  const handleMonthChange = useCallback((label) => {
    setSelectedMonth(label);
  }, []);

  return html`
    <div style=${{ width: "100%", minHeight: "100vh" }}>
      <${Header}
        months=${monthlySummaries.map((row) => row.month_label)}
        selectedMonth=${selectedMonth}
        onChange=${handleMonthChange}
      />

      <main style=${{ width: "100%", padding: "24px 32px 64px", display: "flex", flexDirection: "column", gap: 24 }}>
        ${error && html`
          <div style=${{ background: "#3a1f1f", color: "#f7f5f1", padding: 16, borderRadius: 8 }}>
            Error loading data: ${error}
          </div>
        `}

        <${KpiCards} summary=${selectedSummary} arTotal=${arTotal} />

        ${selectedSummary && html`<${InsightBar} text=${selectedSummary.insight_text} />`}

        <${MonthlyCharts} data=${monthlySummaries} />

        <${ArAgingBuckets} invoices=${arInvoices} />

        <${ArAgingTable} invoices=${arInvoices} loading=${loadingMonth} />

        <${BillsDueTable} bills=${apBills} loading=${loadingMonth} />

        <div style=${{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style=${{ margin: 0, fontSize: 16, fontWeight: 700, color: "#f7f5f1" }}>
            13-Week Cash Flow Forecast
          </h2>
          <${PhaseToggle} value=${forecastPhase} onChange=${setForecastPhase} />
        </div>

        <${CashFlowChart} data=${phaseForecast} />

        <${WeeklyForecastTable} data=${phaseForecast} />
      </main>
    </div>
  `;
}
