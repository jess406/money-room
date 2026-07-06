import React from "react";
import { html } from "../lib/html.js";
import Card from "./Card.js";
import Badge from "./Badge.js";
import { formatCurrency, formatDate } from "../lib/format.js";

export default function ArAgingTable({ invoices, loading }) {
  return html`
    <${Card} title="AR Aging">
      <div style=${{ width: "100%", overflowX: "auto" }}>
        <table>
          <thead>
            <tr style=${{ textAlign: "left", color: "#b3a08f", fontSize: 13 }}>
              <th style=${{ padding: "8px 12px" }}>Client</th>
              <th style=${{ padding: "8px 12px" }}>Invoice #</th>
              <th style=${{ padding: "8px 12px" }}>Amount</th>
              <th style=${{ padding: "8px 12px" }}>Due Date</th>
              <th style=${{ padding: "8px 12px" }}>Days Out</th>
              <th style=${{ padding: "8px 12px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            ${invoices.map((inv) => html`
              <tr key=${inv.id} style=${{ borderTop: "1px solid #242424" }}>
                <td style=${{ padding: "10px 12px" }}>${inv.client_name}</td>
                <td style=${{ padding: "10px 12px" }}>${inv.invoice_num}</td>
                <td style=${{ padding: "10px 12px" }}>${formatCurrency(inv.amount)}</td>
                <td style=${{ padding: "10px 12px" }}>${formatDate(inv.due_date)}</td>
                <td style=${{ padding: "10px 12px" }}>${inv.days_out}</td>
                <td style=${{ padding: "10px 12px" }}><${Badge} status=${inv.status} /></td>
              </tr>
            `)}
            ${!loading && invoices.length === 0 && html`
              <tr>
                <td colSpan=${6} style=${{ padding: "20px 12px", color: "#7a7a7a", textAlign: "center" }}>
                  No invoices for this month.
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    <//>
  `;
}
