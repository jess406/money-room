import React, { useMemo } from "react";
import { html } from "../lib/html.js";
import Card from "./Card.js";
import { formatCurrency } from "../lib/format.js";
import { arAgingBucket } from "../lib/arAging.js";

export default function ArAgingBuckets({ invoices }) {
  const buckets = useMemo(() => {
    const result = {
      current: { count: 0, total: 0 },
      aging: { count: 0, total: 0 },
      overdue: { count: 0, total: 0 },
    };
    for (const inv of invoices) {
      const key = arAgingBucket(inv.days_out);
      result[key].count += 1;
      result[key].total += Number(inv.amount) || 0;
    }
    return result;
  }, [invoices]);

  const items = [
    { key: "current", label: "Current", sub: "0–30 days", accent: "#7fd48a" },
    { key: "aging", label: "Aging", sub: "31–60 days", accent: "#f2c94c" },
    { key: "overdue", label: "Overdue", sub: "60+ days", accent: "#f28b82" },
  ];

  return html`
    <div style=${{ width: "100%", display: "flex", gap: 20 }}>
      ${items.map(({ key, label, sub, accent }) => html`
        <${Card} key=${key} style=${{ flex: 1 }}>
          <div style=${{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <span style=${{ fontSize: 14, fontWeight: 600, color: "#b3a08f" }}>
              ${label} <span style=${{ color: "#7a7a7a", fontWeight: 400 }}>(${sub})</span>
            </span>
          </div>
          <div style=${{ fontSize: 26, fontWeight: 700, marginTop: 10, color: accent }}>
            ${formatCurrency(buckets[key].total)}
          </div>
          <div style=${{ fontSize: 13, color: "#7a7a7a", marginTop: 4 }}>
            ${buckets[key].count} invoice${buckets[key].count === 1 ? "" : "s"}
          </div>
        <//>
      `)}
    </div>
  `;
}
