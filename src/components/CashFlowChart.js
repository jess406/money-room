import React from "react";
import { html } from "../lib/html.js";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import Card from "./Card.js";
import { formatCurrency } from "../lib/format.js";

const tooltipContentStyle = { background: "#1a1a1a", border: "1px solid #2c2c2c", borderRadius: 8, color: "#f7f5f1" };
const tooltipLabelStyle = { color: "#f7f5f1" };
const labelFormatter = (v) => `Week ${v}`;
const valueFormatter = (value) => formatCurrency(value);
const yTickFormatter = (v) => `$${v / 1000}k`;
const xTickFormatter = (v) => `Wk ${v}`;

export default function CashFlowChart({ data }) {
  return html`
    <${Card} title="13-Week Cash Flow">
      <div style=${{ width: "100%", height: 300 }}>
        <${ResponsiveContainer} width="100%" height="100%">
          <${LineChart} data=${data} margin=${{ top: 4, right: 8, left: 8, bottom: 0 }}>
            <${CartesianGrid} stroke="#2c2c2c" vertical=${false} />
            <${XAxis} dataKey="week_number" stroke="#b3a08f" fontSize=${12} tickFormatter=${xTickFormatter} />
            <${YAxis} stroke="#b3a08f" fontSize=${12} tickFormatter=${yTickFormatter} />
            <${Tooltip}
              contentStyle=${tooltipContentStyle}
              labelStyle=${tooltipLabelStyle}
              labelFormatter=${labelFormatter}
              formatter=${valueFormatter}
            />
            <${ReferenceLine} y=${150000} stroke="#e05a4e" strokeDasharray="6 4" />
            <${Line} type="monotone" dataKey="ending_cash" name="Ending Cash" stroke="#55624e" strokeWidth=${2} dot=${{ r: 3 }} />
          <//>
        <//>
      </div>
    <//>
  `;
}
