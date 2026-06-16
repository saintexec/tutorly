import React from 'react';

interface Student {
  name: string;
  subject: string;
  level: string;
}

interface Props {
  student: Student;
}

export default function StudentHeaderSection({ student }: Props) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#1a3a52] flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">
              {student.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1E3A5F] tracking-tight">{student.name}</h1>
            <p className="text-[#7F8C8D] font-medium">
              {student.subject} • {student.level}
            </p>
          </div>
        </div>
        <p className="text-[#7F8C8D] text-sm italic font-medium opacity-80">Your learning journey with Tutorly</p>
      </div>
    </div>
  );
}
