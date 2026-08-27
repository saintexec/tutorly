"use client";

import Link from "next/link";
import StudentAvatar from "./StudentAvatar";
import { BookOpen, ArrowRight } from "lucide-react";

interface StudentCardProps {
  student: {
    id: string;
    name: string;
    subject: string;
    level: string;
    session_rate: number;
    payment_status: string;
  };
}

export default function StudentCard({ student }: StudentCardProps) {
  const isPaid = student.payment_status?.toLowerCase() === "paid" || student.payment_status?.toLowerCase() === "cleared";

  return (
    <Link
      href={`/students/${student.id}`}
      className="group bg-surface-container-lowest rounded-2xl p-6 shadow-ambient border border-outline-variant/30 hover:border-primary-container/30 hover:shadow-ambient-lg transition-all duration-300"
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <StudentAvatar 
            name={student.name} 
            size="lg" 
            className="group-hover:scale-105 transition-transform duration-300" 
          />
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-800 tracking-wider uppercase ${
            isPaid ? "bg-secondary-container text-on-secondary-container" : "bg-error-container text-on-error-container"
          }`}>
            {isPaid ? "PAID" : "UNPAID"}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="font-800 text-lg text-on-surface tracking-tight group-hover:text-primary transition-colors">
            {student.name}
          </h3>
          <p className="flex items-center gap-1.5 text-on-surface-variant text-xs font-600">
            <BookOpen size={16} />
            {student.subject} • {student.level}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
           <div className="flex flex-col">
              <span className="text-[10px] font-700 tracking-widest text-on-surface-variant uppercase opacity-60">Session Rate</span>
              <span className="text-sm font-800 text-on-surface">RM {student.session_rate?.toFixed(2) || "0.00"}</span>
           </div>
            <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant group-hover:bg-primary-container group-hover:text-white transition-all">
               <ArrowRight size={18} />
            </div>
        </div>
      </div>
    </Link>
  );
}
