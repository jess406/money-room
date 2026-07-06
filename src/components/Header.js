import React from "react";
import { html } from "../lib/html.js";

const asOfDate = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export default function Header({ months, selectedMonth, onChange }) {
  return html`
    <header
      style=${{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "24px 32px",
        borderBottom: "1px solid #242424",
      }}
    >
      <div style=${{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          style=${{
            fontSize: 12,
            fontWeight: 600,
            color: "#b3a08f",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >The Backend Architect</span>
        <h1 style=${{ margin: 0, fontSize: 26, fontWeight: 700 }}>The Money Room</h1>
      </div>

      <div style=${{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style=${{ fontSize: 13, color: "#b3a08f" }}>As of ${asOfDate}</span>

        <select
          value=${selectedMonth || ""}
          onChange=${(e) => onChange(e.target.value)}
          style=${{
            background: "#1a1a1a",
            color: "#f7f5f1",
            border: "1px solid #2c2c2c",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 14,
            fontFamily: "inherit",
            cursor: "pointer",
          }}
        >
          ${months.map((label) => html`<option key=${label} value=${label}>${label}</option>`)}
        </select>
      </div>
    </header>
  `;
}
