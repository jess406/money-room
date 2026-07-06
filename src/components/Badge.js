import React from "react";
import { html } from "../lib/html.js";

const COLOR_MAP = {
  overdue: { bg: "#4a1f1f", fg: "#f28b82" },
  open: { bg: "#2c2c2c", fg: "#b3a08f" },
  aging: { bg: "#4a3f1a", fg: "#f2c94c" },
  due: { bg: "#4a3f1a", fg: "#f2c94c" },
  scheduled: { bg: "#1a2a3f", fg: "#7fb3f2" },
  paid: { bg: "#1f3a24", fg: "#7fd48a" },
};

export default function Badge({ status }) {
  const key = (status || "").toLowerCase();
  const colors = COLOR_MAP[key] || { bg: "#2c2c2c", fg: "#b3a08f" };

  return html`
    <span
      style=${{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: colors.bg,
        color: colors.fg,
        whiteSpace: "nowrap",
      }}
    >${status}</span>
  `;
}
