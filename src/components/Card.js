import React from "react";
import { html } from "../lib/html.js";

export default function Card({ title, children, style }) {
  return html`
    <div style=${{ background: "#1a1a1a", borderRadius: 10, padding: 20, ...(style || {}) }}>
      ${title && html`<div style=${{ fontSize: 14, fontWeight: 600, color: "#b3a08f", marginBottom: 14 }}>${title}</div>`}
      ${children}
    </div>
  `;
}
