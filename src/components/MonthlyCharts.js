import React from "react";
import { html } from "../lib/html.js";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import Card from "./Card.js";
import { formatCurrency } from "../lib/format.js";

const AXIS_COLOR = "#b3a08f";
const GRID_COLOR = "#2c2c2c";
const ACCENT = "#55624e";
const SECONDARY = "#b3a08f";

const tooltipContentStyle = { background: "#1a1a1a", border: "1px solid #2c2c2c", borderRadius: 8, color: "#f7f5f1" };
const tooltipLabelStyle = { color: "#f7f5f1" };
const tooltipFormatter = (value) => formatCurrency(value);
const yTickFormatter = (v) => `$${v / 1000}k`;

export default function MonthlyCharts({ data }) {
  return html`
    <div style=${{ width: "100%", display: "flex", gap: 20, flexWrap: "wrap" }}>
      <${Card} title="Revenue vs Expenses" style=${{ flex: "1 1 320px", minWidth: 320 }}>
        <div style=${{ width: "100%", height: 260 }}>
          <${ResponsiveContainer} width="100%" height="100%">
            <${BarChart} data=${data} margin=${{ top: 4, right: 8, left: 8, bottom: 0 }}>
              <${CartesianGrid} stroke=${GRID_COLOR} vertical=${false} />
              <${XAxis} dataKey="month_label" stroke=${AXIS_COLOR} fontSize=${12} />
              <${YAxis} stroke=${AXIS_COLOR} fontSize=${12} tickFormatter=${yTickFormatter} />
              <${Tooltip} contentStyle=${tooltipContentStyle} labelStyle=${tooltipLabelStyle} formatter=${tooltipFormatter} />
              <${Legend} wrapperStyle=${{ fontSize: 12, color: SECONDARY }} />
              <${Bar} dataKey="revenue" name="Revenue" fill=${ACCENT} radius=${[4, 4, 0, 0]} />
              <${Bar} dataKey="total_expenses" name="Expenses" fill=${SECONDARY} radius=${[4, 4, 0, 0]} />
            <//>
          <//>
        </div>
      <//>

      <${Card} title="Net Profit Trend" style=${{ flex: "1 1 320px", minWidth: 320 }}>
        <div style=${{ width: "100%", height: 260 }}>
          <${ResponsiveContainer} width="100%" height="100%">
            <${LineChart} data=${data} margin=${{ top: 4, right: 8, left: 8, bottom: 0 }}>
              <${CartesianGrid} stroke=${GRID_COLOR} vertical=${false} />
              <${XAxis} dataKey="month_label" stroke=${AXIS_COLOR} fontSize=${12} />
              <${YAxis} stroke=${AXIS_COLOR} fontSize=${12} tickFormatter=${yTickFormatter} />
              <${Tooltip} contentStyle=${tooltipContentStyle} labelStyle=${tooltipLabelStyle} formatter=${tooltipFormatter} />
              <${Line} type="monotone" dataKey="net_profit" name="Net Profit" stroke=${ACCENT} strokeWidth=${2} dot=${{ r: 3 }} />
            <//>
          <//>
        </div>
      <//>

      <${Card} title="Cash Balance Trend" style=${{ flex: "1 1 320px", minWidth: 320 }}>
        <div style=${{ width: "100%", height: 260 }}>
          <${ResponsiveContainer} width="100%" height="100%">
            <${LineChart} data=${data} margin=${{ top: 4, right: 8, left: 8, bottom: 0 }}>
              <${CartesianGrid} stroke=${GRID_COLOR} vertical=${false} />
              <${XAxis} dataKey="month_label" stroke=${AXIS_COLOR} fontSize=${12} />
              <${YAxis} stroke=${AXIS_COLOR} fontSize=${12} tickFormatter=${yTickFormatter} />
              <${Tooltip} contentStyle=${tooltipContentStyle} labelStyle=${tooltipLabelStyle} formatter=${tooltipFormatter} />
              <${ReferenceLine} y=${150000} stroke="#e05a4e" strokeDasharray="6 4" />
              <${Line} type="monotone" dataKey="cash_balance" name="Cash Balance" stroke=${ACCENT} strokeWidth=${2} dot=${{ r: 3 }} />
            <//>
          <//>
        </div>
      <//>
    </div>
  `;
}
