import React from 'react';

interface Metrics {
  totalSessions: number;
  averageRating: number;
  currentStreak: number;
}

interface Props {
  metrics: Metrics;
}

export default function MetricsCards({ metrics }: Props) {
  const cards = [
    {
      icon: '📚',
      value: metrics.totalSessions,
      label: 'Sessions Completed',
      bg: 'bg-blue-50/50'
    },
    {
      icon: '⭐',
      value: metrics.averageRating.toFixed(1),
      label: 'Average Rating',
      bg: 'bg-yellow-50/50'
    },
    {
      icon: '🔥',
      value: `${metrics.currentStreak} weeks`,
      label: 'Active Streak',
      bg: 'bg-orange-50/50'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-100 transition-all hover:shadow-md ${card.bg}`}
        >
          <div className="text-4xl mb-4 transform transition-transform hover:scale-110 duration-300">{card.icon}</div>
          <div className="text-3xl font-bold text-[#1E3A5F] mb-1">{card.value}</div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#7F8C8D] opacity-70">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
