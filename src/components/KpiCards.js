import React from "react";
import { html } from "../lib/html.js";
import Card from "./Card.js";
import { formatCurrency } from "../lib/format.js";

function Dot({ healthy }) {
  return html`
    <span
      style=${{
        display: "inline-block",
        width: 9,
        height: 9,
        borderRadius: "50%",
        background: healthy ? "#7fd48a" : "#f2c94c",
      }}
    />
  `;
}

function KpiCard({ label, value, healthy }) {
  return html`
    <${Card} style=${{ flex: 1 }}>
      <div style=${{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style=${{ fontSize: 14, color: "#b3a08f", fontWeight: 600 }}>${label}</span>
        <${Dot} healthy=${healthy} />
      </div>
      <div style=${{ fontSize: 28, fontWeight: 700, marginTop: 10 }}>
        ${value === null || value === undefined ? "—" : formatCurrency(value)}
      </div>
    <//>
  `;
}

export default function KpiCards({ summary, arTotal }) {
  return html`
    <div style=${{ width: "100%", display: "flex", gap: 20 }}>
      <${KpiCard}
        label="Cash Balance"
        value=${summary ? summary.cash_balance : null}
        healthy=${summary ? !summary.runway_alert : true}
      />
      <${KpiCard}
        label="Revenue"
        value=${summary ? summary.revenue : null}
        healthy=${summary ? !summary.profit_alert : true}
      />
      <${KpiCard}
        label="Accounts Receivable"
        value=${arTotal}
        healthy=${summary ? !summary.ar_alert : true}
      />
      <${KpiCard}
        label="Net Profit"
        value=${summary ? summary.net_profit : null}
        healthy=${summary ? !summary.profit_alert : true}
      />
    </div>
  `;
}
