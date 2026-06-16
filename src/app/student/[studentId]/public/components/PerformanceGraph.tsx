'use client';

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface PerformanceData {
  week: string;
  rating: number;
}

interface Props {
  data: PerformanceData[];
}

export default function PerformanceGraph({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
        <span className="material-symbols-outlined text-gray-300 text-5xl mb-4">analytics</span>
        <p className="text-[#7F8C8D] font-medium">No performance data captured yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-[#1E3A5F] tracking-tight mb-1">
            Academic Performance
          </h2>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#7F8C8D] opacity-60">Consistency over time</p>
        </div>
        <div className="bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-1.5 rounded-full text-[10px] font-800 tracking-widest uppercase">
          Learning Curve
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="week" 
              stroke="#94a3b8" 
              fontSize={10}
              fontWeight={700}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              domain={[0, 5]} 
              stroke="#94a3b8" 
              fontSize={10}
              fontWeight={700}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                padding: '12px'
              }}
              labelStyle={{ color: '#1E3A5F', fontWeight: 800, fontSize: '12px' }}
              itemStyle={{ color: '#D4AF37', fontWeight: 700, fontSize: '12px' }}
              formatter={(value: any) => [`${value} / 5`, "Rating"]}
            />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="#D4AF37"
              strokeWidth={3}
              dot={{ fill: '#1E3A5F', r: 4, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#1E3A5F', stroke: '#fff', strokeWidth: 2 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
