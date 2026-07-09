import React from "react";
import { html } from "../lib/html.js";

const PHASES = [
  { key: "current", label: "Current" },
  { key: "aggressive", label: "Aggressive" },
  { key: "conservative", label: "Conservative" },
];

export default function PhaseToggle({ value, onChange }) {
  return html`
    <div
      style=${{
        display: "inline-flex",
        background: "#1a1a1a",
        borderRadius: 8,
        padding: 4,
        gap: 4,
      }}
    >
      ${PHASES.map(
        ({ key, label }) => html`
          <button
            key=${key}
            onClick=${() => onChange(key)}
            style=${{
              border: "none",
              borderRadius: 6,
              padding: "8px 16px",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
              background: value === key ? "#55624e" : "transparent",
              color: value === key ? "#f7f5f1" : "#b3a08f",
            }}
          >
            ${label}
          </button>
        `
      )}
    </div>
  `;
}
