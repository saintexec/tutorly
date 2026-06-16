"use client";

import { useState } from "react";
import { generateWhatsAppLink, openWhatsAppMessage, generateWhatsAppLinkWithPhone } from "@/lib/whatsapp";

interface SessionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
  student: any;
}

export default function SessionDetailsModal({ isOpen, onClose, session, student }: SessionDetailsModalProps) {
  const [showToast, setShowToast] = useState(false);

  if (!isOpen || !session) return null;

  const handleWhatsAppShare = async () => {
    if (!student.parent_whatsapp) {
      alert("No WhatsApp number found for this student's parent.");
      return;
    }

    try {
      setShowToast(true);

      const studentData = {
        name: student.name,
        studentId: student.id,
        date: formattedDate,
        performance: session.performance,
        sessionNotes: session.notes,
        homeworkAssignments: session.homework,
      };

      // Now generateWhatsAppLinkWithPhone is async
      const { link } = await generateWhatsAppLinkWithPhone(studentData, student.parent_whatsapp);

      // Wait a bit to show the premium toast feedback
      setTimeout(() => {
        setShowToast(false);
        openWhatsAppMessage(link);
      }, 1200);
    } catch (error) {
      console.error('Error sharing to WhatsApp:', error);
      alert('Failed to open WhatsApp. Please try again.');
      setShowToast(false);
    }
  };

  const formattedDate = new Date(session.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* Centered Modal / Bottom Sheet */}
      <div 
        className="bg-white rounded-t-[24px] md:rounded-[16px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-4 duration-300 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-[#1E3A5F] px-6 py-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex flex-col">
            <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Session Review</span>
            <h2 className="text-white font-bold text-lg leading-tight tracking-tight max-w-[200px] truncate">
              {session.topic || "Untitiled Session"}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all text-[#D4AF37]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#F8FAFC]">
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#1E3A5F]/5 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#7F8C8D]">Student</span>
              <p className="text-sm font-bold text-[#1E3A5F]">{student.name}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#1E3A5F]/5 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#7F8C8D]">Date</span>
              <p className="text-sm font-bold text-[#1E3A5F]">{formattedDate}</p>
            </div>
          </div>

          {/* Performance & Status */}
          <div className="flex items-center justify-between bg-white px-5 py-4 rounded-xl border border-[#1E3A5F]/5 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#7F8C8D]">Performance</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span 
                    key={s} 
                    className={`material-symbols-outlined text-[18px] ${s <= (session.performance || 0) ? "text-[#D4AF37] fill-[#D4AF37]" : "text-[#7F8C8D] opacity-20"}`}
                  >
                    grade
                  </span>
                ))}
                <span className="text-xs font-bold text-[#1E3A5F] ml-1">{session.performance}/5</span>
              </div>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
              session.paid 
                ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                : "bg-red-50 text-red-600 border-red-200"
            }`}>
              {session.paid ? "SETTLED" : "PENDING"}
            </div>
          </div>

          {/* Session Notes */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#1E3A5F]">
              <span className="material-symbols-outlined text-[20px]">description</span>
              <h3 className="text-sm font-bold uppercase tracking-widest">Session Notes</h3>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#1E3A5F]/5 shadow-sm min-h-[100px]">
              <p className="text-sm text-[#1E3A5F]/80 leading-relaxed whitespace-pre-wrap">
                {session.notes?.trim() || "Focus on today's exercises"}
              </p>
            </div>
          </div>

          {/* Homework Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#1E3A5F]">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
              <h3 className="text-sm font-bold uppercase tracking-widest">Homework Assignments</h3>
            </div>
            <div className="bg-[#1E3A5F]/5 p-5 rounded-xl border-t-2 border-[#D4AF37] shadow-sm">
              <p className="text-sm text-[#1E3A5F]/80 leading-relaxed whitespace-pre-wrap italic font-medium">
                {session.homework?.trim() || "Focus on today's exercises"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-[#1E3A5F]/5 flex flex-col sm:flex-row gap-3 md:gap-4 shrink-0">
          <button
            onClick={handleWhatsAppShare}
            className="flex-[2] h-14 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-[#25D366]/20"
          >
            <span className="material-symbols-outlined fill-white">share</span>
            SHARE TO WHATSAPP
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-14 border-2 border-[#1E3A5F]/10 text-[#1E3A5F] rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            Close
          </button>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1E3A5F] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in zoom-in-95 duration-300 z-[120]">
            <span className="w-6 h-6 border-2 border-white/30 border-t-[#D4AF37] rounded-full animate-spin" />
            <span className="font-bold text-sm">Opening WhatsApp... 📱</span>
          </div>
        )}
      </div>

      {/* Backdrop overlay listener for closing */}
      <div className="absolute inset-0 z-[-1]" onClick={onClose} />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1E3A5F22;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1E3A5F44;
        }
      `}</style>
    </div>
  );
}
