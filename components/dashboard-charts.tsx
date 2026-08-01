"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const tooltipStyle = { border: 0, borderRadius: 12, boxShadow: "0 12px 30px rgba(3,21,46,.14)", fontSize: 13 };

export function DailyChart({ data }: { data: Array<{ date: string; responses: number }> }) {
  if (!data.length) return <div className="chart-empty">O gráfico aparecerá após as primeiras respostas.</div>;
  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: -28, bottom: 0 }}>
          <CartesianGrid stroke="#e8e6e0" vertical={false} />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#718096", fontSize: 11 }} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#718096", fontSize: 11 }} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(215,155,36,.09)" }} />
          <Bar dataKey="responses" name="Respostas" fill="#d79b24" radius={[6, 6, 0, 0]} maxBarSize={34} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
