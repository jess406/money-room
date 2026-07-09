import React from "react";
import { html } from "../lib/html.js";
import Card from "./Card.js";
import Badge from "./Badge.js";
import { formatCurrency, formatDate } from "../lib/format.js";

export default function WeeklyForecastTable({ data }) {
  return html`
    <${Card} title="Weekly Forecast">
      <div style=${{ width: "100%", overflowX: "auto" }}>
        <table>
          <thead>
            <tr style=${{ textAlign: "left", color: "#b3a08f", fontSize: 13 }}>
              <th style=${{ padding: "8px 12px" }}>Week</th>
              <th style=${{ padding: "8px 12px" }}>Start</th>
              <th style=${{ padding: "8px 12px" }}>End</th>
              <th style=${{ padding: "8px 12px" }}>Cash In</th>
              <th style=${{ padding: "8px 12px" }}>Cash Out</th>
              <th style=${{ padding: "8px 12px" }}>Ending Cash</th>
              <th style=${{ padding: "8px 12px" }}>Runway (days)</th>
              <th style=${{ padding: "8px 12px" }}>Alert Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.map((row) => html`
              <tr key=${row.id} style=${{ borderTop: "1px solid #242424" }}>
                <td style=${{ padding: "10px 12px" }}>${row.week_number}</td>
                <td style=${{ padding: "10px 12px" }}>${formatDate(row.week_start)}</td>
                <td style=${{ padding: "10px 12px" }}>${formatDate(row.week_end)}</td>
                <td style=${{ padding: "10px 12px" }}>${formatCurrency(row.cash_in)}</td>
                <td style=${{ padding: "10px 12px" }}>${formatCurrency(row.cash_out)}</td>
                <td style=${{ padding: "10px 12px" }}>${formatCurrency(row.ending_cash)}</td>
                <td style=${{ padding: "10px 12px" }}>${row.runway_days}</td>
                <td style=${{ padding: "10px 12px" }}><${Badge} status=${row.alert_status} /></td>
              </tr>
            `)}
            ${data.length === 0 && html`
              <tr>
                <td colSpan=${8} style=${{ padding: "20px 12px", color: "#7a7a7a", textAlign: "center" }}>
                  No forecast data.
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    <//>
  `;
}
