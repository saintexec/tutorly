"use client";

interface CircularProgressProps {
  percentage: number;
  label?: string;
}

export default function CircularProgress({ percentage, label = "COMPLETE" }: CircularProgressProps) {
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 relative">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="#1e3a5f" // container background contrast
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="opacity-20"
        />
        <circle
          stroke="#6bff8f" // secondary container / green progress
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <span className="text-3xl font-800 text-white tracking-tighter">{percentage}%</span>
        {label && (
          <span className="text-[10px] font-700 tracking-widest text-on-primary-container text-center opacity-70 uppercase leading-none">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
