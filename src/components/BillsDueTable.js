import React from "react";
import { html } from "../lib/html.js";
import Card from "./Card.js";
import Badge from "./Badge.js";
import { formatCurrency, formatDate } from "../lib/format.js";

export default function BillsDueTable({ bills, loading }) {
  return html`
    <${Card} title="Bills Due">
      <div style=${{ width: "100%", overflowX: "auto" }}>
        <table>
          <thead>
            <tr style=${{ textAlign: "left", color: "#b3a08f", fontSize: 13 }}>
              <th style=${{ padding: "8px 12px" }}>Vendor</th>
              <th style=${{ padding: "8px 12px" }}>Category</th>
              <th style=${{ padding: "8px 12px" }}>Amount</th>
              <th style=${{ padding: "8px 12px" }}>Due Date</th>
              <th style=${{ padding: "8px 12px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            ${bills.map((bill) => html`
              <tr key=${bill.id} style=${{ borderTop: "1px solid #242424" }}>
                <td style=${{ padding: "10px 12px" }}>${bill.vendor}</td>
                <td style=${{ padding: "10px 12px" }}>${bill.category}</td>
                <td style=${{ padding: "10px 12px" }}>${formatCurrency(bill.amount)}</td>
                <td style=${{ padding: "10px 12px" }}>${formatDate(bill.due_date)}</td>
                <td style=${{ padding: "10px 12px" }}><${Badge} status=${bill.status} /></td>
              </tr>
            `)}
            ${!loading && bills.length === 0 && html`
              <tr>
                <td colSpan=${5} style=${{ padding: "20px 12px", color: "#7a7a7a", textAlign: "center" }}>
                  No bills for this month.
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    <//>
  `;
}
