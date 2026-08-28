import React from 'react';
import { Star, History } from 'lucide-react';

interface Session {
  id: string;
  date: string;
  topic: string;
  performance: number;
}

interface Props {
  sessions: Session[];
}

export default function RecentSessionsList({ sessions }: Props) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star 
            key={i} 
            size={18} 
            className={i <= rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-200'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-[#1E3A5F]/5 flex items-center justify-center">
          <History className="text-[#1E3A5F]" size={20} />
        </div>
        <h2 className="text-xl font-bold text-[#1E3A5F] tracking-tight">Recent Learning History</h2>
      </div>
      
      <div className="space-y-4">
        {sessions.map((session) => (
          <div 
            key={session.id} 
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group gap-4"
          >
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-[#7F8C8D] opacity-60 mb-1">
                {formatDate(session.date)}
              </p>
              <h3 className="font-bold text-[#1E3A5F] group-hover:text-primary transition-colors">
                {session.topic || "Untitled Session"}
              </h3>
            </div>
            <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
              {renderStars(session.performance)}
              <span className="text-xs font-bold text-[#1E3A5F] opacity-40">{session.performance}/5</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
