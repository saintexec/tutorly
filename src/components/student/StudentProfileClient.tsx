"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { capitalizeAll } from "@/lib/utils";
import PerformanceChart from "@/components/charts/PerformanceChart";
import EditStudentModal from "./EditStudentModal";
import QuickLogModal from "./QuickLogModal";
import SessionDetailsModal from "./SessionDetailsModal";
import Link from "next/link";

import StudentAvatar from "./StudentAvatar";

interface StudentProfileClientProps {
  initialStudent: any;
  initialSessions: any[];
}

export default function StudentProfileClient({ initialStudent, initialSessions }: StudentProfileClientProps) {
  const router = useRouter();
  const supabase = createClient();
  
  // 1. State Management
  const [student, setStudent] = useState(initialStudent);
  const [sessions, setSessions] = useState(initialSessions);
  const [refreshing, setRefreshing] = useState(false);
  
  const [notes, setNotes] = useState(student.notes || "");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Sync state with props if they change (e.g. on navigation)
  useEffect(() => {
    setStudent(initialStudent);
    setNotes(initialStudent.notes || "");
  }, [initialStudent]);

  useEffect(() => {
    setSessions(initialSessions);
  }, [initialSessions]);

  // 2. Async Refresh Function
  const refreshData = async () => {
    setRefreshing(true);
    try {
      // Fetch latest student details
      const { data: updatedStudent, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("id", student.id)
        .single();
      
      if (studentError) throw studentError;
      setStudent(updatedStudent);
      setNotes(updatedStudent.notes || "");

      // Fetch latest sessions
      const { data: updatedSessions, error: sessionsError } = await supabase
        .from("sessions")
        .select("*")
        .eq("student_id", student.id)
        .order("date", { ascending: false });
      
      if (sessionsError) throw sessionsError;
      setSessions(updatedSessions || []);
      
      // Also refresh server context for other components
      router.refresh();
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      // Brief delay for UX feedback visibility
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  // Capitalized Name
  const fullName = capitalizeAll(student.name);

  // Stats Derived from State
  const streak = sessions.length;
  const averageRating = sessions.length > 0
    ? (sessions.reduce((acc, s) => acc + (s.performance ?? 0), 0) / sessions.length).toFixed(1)
    : "0.0";

  // Financial status
  const studentRate = student.session_rate || 0;
  const isPaid = student.payment_status?.toLowerCase() === "paid";
  
  // Real-time Balance Calculations from updated sessions state
  const outstandingBalance = sessions
    .filter(s => !s.paid)
    .reduce((acc, s) => acc + (s.session_rate || studentRate), 0);
    
  const totalRevenue = sessions
    .filter(s => s.paid)
    .reduce((acc, s) => acc + (s.session_rate || studentRate), 0);

  // Save logic for notes
  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      const { error } = await supabase
        .from("students")
        .update({ notes: notes })
        .eq("id", student.id);
      
      if (error) throw error;
      setLastSaved(new Date());
      setIsEditingNotes(false);
    } catch (err) {
      console.error("Error saving notes:", err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleTogglePaid = async (sessionId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("sessions")
        .update({ paid: !currentStatus })
        .eq("id", sessionId);
      
      if (error) throw error;
      
      // Local state update
      setSessions(sessions.map(s => 
        s.id === sessionId ? { ...s, paid: !currentStatus } : s
      ));
    } catch (err) {
      console.error("Error toggling payment status:", err);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return;
    
    try {
      const { error } = await supabase
        .from("sessions")
        .delete()
        .eq("id", sessionId);
      
      if (error) throw error;
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (err) {
      console.error("Error deleting session:", err);
    }
  };

  const handleOpenSessionDetails = (session: any) => {
    setSelectedSession(session);
    setIsSessionModalOpen(true);
  };

  const handleShowInvoices = () => {
    alert("Coming soon!");
  };

  // Chart Data (Individual Sessions) - Re-calculates on session change
  const getPerformanceData = () => {
    if (!sessions || sessions.length === 0) return [];

    // Sort oldest first for the chart "growth"
    const chronologicalSessions = [...sessions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return chronologicalSessions.map((s, index) => ({
      label: `S${index + 1}`,
      rating: s.performance ?? 0,
      tooltipLabel: `Session ${index + 1}: ${s.topic || 'No topic'}`,
      fullDate: new Date(s.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    }));
  };

  const performanceData = getPerformanceData();

  return (
    <div className={`space-y-8 pb-10 transition-opacity duration-300 ${refreshing ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
      {/* Back Button */}
      <div className="flex items-center">
        <Link 
          href="/students" 
          className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors font-600 text-sm"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Students
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <StudentAvatar name={student.name} size="xl" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-800 tracking-tighter text-on-surface">
                {fullName}
              </h1>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-800 tracking-wider uppercase ${
                isPaid ? "bg-[#6bff8f] text-[#005321]" : "bg-error-container text-error"
              }`}>
                {isPaid ? "PAID" : "UNPAID"}
              </span>
            </div>
            <p className="flex items-center gap-2 text-on-surface-variant text-sm font-600">
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              {student.subject} • {student.level}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {refreshing && (
             <div className="flex items-center gap-2 mr-4">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
                <span className="text-[10px] font-800 text-primary-container tracking-widest uppercase">Syncing...</span>
             </div>
          )}
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="px-5 py-2.5 rounded-[var(--radius-lg)] bg-surface-container-lowest border border-outline-variant/30 text-sm font-700 text-on-surface hover:bg-surface-container-low transition-colors shadow-sm"
          >
            Edit Profile
          </button>
          <button 
            onClick={() => setIsQuickLogOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-lg)] bg-primary-container text-white text-sm font-700 hover:bg-primary transition-all shadow-ambient active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">play_circle</span>
            Start Lesson
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          {/* Growth Journey */}
          <div className="bg-[#fff8f1] rounded-[var(--radius-2xl)] p-8 border border-[#ffddb2] relative overflow-hidden shadow-sm">
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#503300] font-800 tracking-tight">
                   <span className="material-symbols-outlined text-[20px]">trending_up</span>
                   Growth Journey
                </div>
                <p className="text-sm text-[#c69b5f] leading-relaxed max-w-[340px]">
                  {sessions.length > 0 
                    ? `You've completed ${sessions.length} sessions with ${fullName}! Keep up the great work.` 
                    : "No sessions recorded yet. Start your first lesson to see progress."}
                </p>
              </div>
              
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur rounded-2xl p-2 px-4 shadow-sm border border-[#ffddb2]">
                 <div className="flex -space-x-1">
                    {[1,2,3].map(i => (
                       <div key={i} className="w-6 h-6 rounded-full bg-[#6bff8f] flex items-center justify-center text-[#005321] text-[12px] border-2 border-white shadow-sm">
                          <span className="material-symbols-outlined text-[14px]">check</span>
                       </div>
                    ))}
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[14px] font-800 text-[#341f00] leading-none">{streak} SESSIONS</span>
                    <span className="text-[10px] font-700 text-[#503300] tracking-widest uppercase opacity-70">TOTAL</span>
                 </div>
              </div>
            </div>

            <div className="mt-12 flex justify-between items-end h-24 px-4 relative">
               <div className="absolute inset-x-0 bottom-4 h-1 bg-[#edbf7f]/20 rounded-full" />
               {sessions.length > 0 ? (
                 sessions.slice(0, 4).reverse().map((s, i) => (
                    <div key={s.id} className="flex flex-col items-center gap-2 relative">
                       <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm bg-[#edbf7f]`} />
                       <div className={`h-10 w-0.5 bg-[#edbf7f] opacity-30`} />
                       <span className="text-[10px] font-700 text-[#c69b5f] uppercase tracking-wider">
                         {new Date(s.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                       </span>
                    </div>
                 ))
               ) : (
                 <div className="absolute inset-x-0 bottom-4 flex justify-between px-4">
                    {[1,2,3,4].map(i => (
                       <div key={i} className="w-3 h-3 rounded-full bg-outline-variant/20 border-2 border-white shadow-sm" />
                    ))}
                 </div>
               )}
            </div>
          </div>

          {/* Academic Performance */}
          <div className="bg-white rounded-[var(--radius-2xl)] p-8 shadow-ambient border border-outline-variant/10">
            <div className="flex items-center justify-between mb-8">
               <div className="space-y-1">
                  <h2 className="text-xl font-800 tracking-tight text-on-surface">Academic Performance</h2>
                  <p className="text-sm text-on-surface-variant">Consistency over the last 6 months</p>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-lg font-800 text-on-surface">{averageRating}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                       <span key={i} className={`material-symbols-outlined text-[20px] ${i <= Math.round(Number(averageRating)) ? "text-[#edbf7f] fill-[#edbf7f]" : "text-outline-variant opacity-30"}`}>star</span>
                    ))}
                  </div>
               </div>
            </div>
            {sessions.length > 0 ? (
              <PerformanceChart data={performanceData} />
            ) : (
              <div className="h-[220px] flex items-center justify-center border-2 border-dashed border-outline-variant/30 rounded-xl text-on-surface-variant font-600 italic">
                No session data to display. Log a session to see performance ratings.
              </div>
            )}
          </div>

          {/* Session History */}
          <div className="bg-white rounded-[var(--radius-2xl)] p-8 shadow-ambient border border-outline-variant/10">
            <h2 className="text-xl font-800 tracking-tight text-on-surface mb-8">Session History</h2>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-outline-variant/30 text-[10px] font-800 uppercase tracking-widest text-on-surface-variant opacity-60">
                        <th className="pb-4 font-800">Date</th>
                        <th className="pb-4 font-800">Topic</th>
                        <th className="pb-4 font-800 text-center">Rating</th>
                        <th className="pb-4 font-800 text-center">Payment Status</th>
                        <th className="pb-4 font-800 text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                     {sessions.length === 0 ? (
                        <tr><td colSpan={5} className="py-8 text-center text-on-surface-variant italic font-600">No sessions yet</td></tr>
                     ) : (
                        sessions.map(s => (
                           <tr 
                             key={s.id} 
                             onClick={() => handleOpenSessionDetails(s)}
                             className="group hover:bg-surface-container-low/30 transition-all duration-200 cursor-pointer"
                           >
                              <td className="py-5 text-sm font-600 text-on-surface">
                                 {new Date(s.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </td>
                              <td className="py-5 text-sm font-700 text-primary-container">
                                 {s.topic}
                              </td>
                              <td className="py-5 text-center">
                                 <div className="flex justify-center gap-0.5">
                                    {[1,2,3,4,5].map(i => (
                                       <span key={i} className={`material-symbols-outlined text-[16px] ${i <= (s.performance ?? 0) ? "text-[#edbf7f] fill-[#edbf7f]" : "text-outline-variant opacity-30"}`}>star</span>
                                    ))}
                                 </div>
                              </td>
                              <td className="py-5 text-center">
                                 <button
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     handleTogglePaid(s.id, !!s.paid);
                                   }}
                                   className={`px-3 py-1 rounded-full text-[10px] font-800 tracking-wider uppercase transition-all active:scale-95 ${
                                     s.paid 
                                       ? "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]" 
                                       : "bg-white text-[#BA1A1A] border border-[#BA1A1A]"
                                   }`}
                                 >
                                   {s.paid ? "PAID" : "UNPAID"}
                                 </button>
                              </td>
                              <td className="py-5 text-right flex items-center justify-end gap-2">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenSessionDetails(s);
                                  }}
                                  className="text-primary-container hover:text-primary transition-colors p-1"
                                >
                                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSession(s.id);
                                  }}
                                  className="text-on-error-container hover:text-error transition-colors p-1"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Private Notes */}
          <div className="bg-[#fff8f1] rounded-[var(--radius-2xl)] p-8 border border-[#ffddb2] shadow-sm flex flex-col gap-4">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 text-[#341f00] font-800 tracking-tight">
                  <span className="material-symbols-outlined text-[20px]">notes</span>
                  Private Notes
               </div>
               {isEditingNotes ? (
                 <button 
                   onClick={handleSaveNotes}
                   disabled={isSavingNotes}
                   className="text-[10px] font-800 text-primary-container hover:underline disabled:opacity-50"
                 >
                   {isSavingNotes ? "SAVING..." : "SAVE"}
                 </button>
               ) : (
                 <button 
                   onClick={() => setIsEditingNotes(true)}
                   className="text-[10px] font-800 text-[#c69b5f] hover:underline"
                 >
                   EDIT
                 </button>
               )}
             </div>
             
             {isEditingNotes ? (
               <textarea 
                 value={notes}
                 onChange={(e) => setNotes(e.target.value)}
                 autoFocus
                 placeholder={`Add private notes about ${student.name.split(' ')[0]}'s progress...`}
                 className="w-full bg-transparent border-none focus:ring-0 text-sm italic text-[#c69b5f] leading-relaxed resize-none min-h-[120px] outline-none"
               />
             ) : (
               <div 
                 onClick={() => setIsEditingNotes(true)}
                 className="w-full text-sm italic text-[#c69b5f] leading-relaxed min-h-[120px] cursor-pointer"
               >
                 {notes || `Add private notes about ${student.name.split(' ')[0]}'s progress...`}
               </div>
             )}

             {lastSaved && !isEditingNotes && (
               <span className="text-[10px] font-800 uppercase tracking-widest text-[#edbf7f]">
                  • Last saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </span>
             )}
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-[var(--radius-2xl)] p-8 shadow-ambient border border-outline-variant/10 space-y-8">
             <div className="space-y-1">
                <h2 className="text-xl font-800 tracking-tight text-on-surface">Financial Summary</h2>
                <p className="text-[10px] font-800 text-on-surface-variant uppercase tracking-widest">Macro Overview</p>
             </div>
             
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-600 text-on-surface-variant">Outstanding Balance</span>
                    <span className="text-sm font-800 text-[#BA1A1A]">RM {outstandingBalance.toFixed(2)}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-600 text-on-surface-variant">Total Revenue</span>
                    <span className="text-sm font-800 text-[#22C55E]">RM {totalRevenue.toFixed(2)}</span>
                 </div>
                 <div className="flex items-center justify-between opacity-50">
                    <span className="text-sm font-600 text-on-surface-variant">Next Invoice Date</span>
                    <span className="text-sm font-800 text-on-surface">TBD</span>
                 </div>
              </div>

             <div className="flex flex-col gap-2">
               <button 
                 onClick={handleShowInvoices}
                 className="w-full py-2.5 rounded-[var(--radius-lg)] bg-surface-container-low text-on-surface font-700 text-sm hover:bg-surface-container transition-colors"
               >
                  View Invoices
               </button>
             </div>
          </div>
        </div>
      </div>

      <EditStudentModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSuccess={refreshData}
        student={student}
      />

      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        onSuccess={refreshData}
        studentId={student.id}
        sessionRate={studentRate}
      />

      <SessionDetailsModal
        isOpen={isSessionModalOpen}
        onClose={() => {
          setIsSessionModalOpen(false);
          setSelectedSession(null);
        }}
        session={selectedSession}
        student={student}
      />
    </div>
  );
}
