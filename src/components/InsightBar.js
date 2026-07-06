import React from "react";
import { html } from "../lib/html.js";

export default function InsightBar({ text }) {
  return html`
    <div
      style=${{
        width: "100%",
        background: "#55624e",
        color: "#f7f5f1",
        borderRadius: 10,
        padding: "18px 24px",
        fontSize: 15,
        lineHeight: 1.5,
      }}
    >${text}</div>
  `;
}
