"use client";

import { getInitials } from "@/lib/utils";

interface StudentAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-[12px]",
  md: "w-10 h-10 text-[14px]",
  lg: "w-14 h-14 text-[18px]",
  xl: "w-20 h-20 text-[24px]",
};

export default function StudentAvatar({ name, size = "md", className = "" }: StudentAvatarProps) {
  const initials = getInitials(name);
  const sizeStyle = sizeClasses[size];

  return (
    <div 
      className={`${sizeStyle} rounded-[var(--radius-2xl)] bg-[#1E3A5F] flex items-center justify-center font-800 text-white shadow-ambient shrink-0 ${className}`}
    >
      {initials}
    </div>
  );
}
