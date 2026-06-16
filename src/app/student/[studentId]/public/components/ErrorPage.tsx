import React from 'react';
import Link from 'next/link';

interface Props {
  error: string;
}

export default function ErrorPage({ error }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 font-['Inter',_sans-serif]">
      <div className="bg-white rounded-[24px] shadow-2xl p-10 text-center max-w-md w-full border border-slate-100 animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="material-symbols-outlined text-red-500 text-4xl">error</span>
        </div>
        
        <h1 className="text-2xl font-bold text-[#1E3A5F] mb-3 tracking-tight">Access Link Issue</h1>
        <p className="text-[#7F8C8D] mb-8 leading-relaxed font-medium">{error}</p>
        
        <div className="space-y-3">
          <Link
            href="https://tutorly.app"
            className="block w-full bg-[#1E3A5F] hover:bg-[#1a3a52] text-white font-bold py-4 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-[#1E3A5F]/20"
          >
            Visit Tutorly
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#7F8C8D] opacity-40">
            Please contact your tutor for a new access link.
          </p>
        </div>
      </div>
    </div>
  );
}
