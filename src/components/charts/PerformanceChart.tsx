"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PerformanceData {
  label: string;
  rating: number;
  tooltipLabel?: string;
  fullDate?: string;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  // Take only the last 10 sessions for a cleaner chart
  const recentData = data.slice(-10);

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={recentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f2f5" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#74777f", fontWeight: 700 }}
            dy={8}
            padding={{ left: 15, right: 15 }}
          />
          <YAxis 
            domain={[0, 5]} 
            ticks={[1, 2, 3, 4, 5]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#74777f", fontWeight: 600 }}
          />
          <Tooltip
            labelStyle={{ fontWeight: 800, color: "#1e3a5f", marginBottom: "4px" }}
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              border: "1px solid rgba(0,0,0,0.05)",
              fontSize: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              padding: "12px"
            }}
            formatter={(value: any) => [`${value} / 5 Stars`, "Performance"]}
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0) {
                const item = payload[0].payload;
                return (
                  <span className="flex flex-col">
                    <span className="text-[#1e3a5f] font-800">{item.tooltipLabel || label}</span>
                    <span className="text-[#74777f] text-[10px] uppercase font-600 tracking-wider mt-1">{item.fullDate}</span>
                  </span>
                );
              }
              return label;
            }}
          />
          <Line
            type="monotone"
            dataKey="rating"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 5, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 7, fill: "#1d4ed8", strokeWidth: 0 }}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
