"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateWhatsAppLink, openWhatsAppMessage, generateWhatsAppLinkWithPhone } from "@/lib/whatsapp";

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  studentId?: string;
  sessionRate?: number;
}

interface StudentOption {
  id: string;
  name: string;
  session_rate: number;
  parent_whatsapp: string;
}

export default function QuickLogModal({ isOpen, onClose, onSuccess, studentId, sessionRate }: QuickLogModalProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [error, setError] = useState<{title: string, message: string} | null>(null);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [newFocusArea, setNewFocusArea] = useState("");
  const [shareLink, setShareLink] = useState<string | null>(null);

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerStatus, setTimerStatus] = useState<'idle' | 'running' | 'paused' | 'ended'>('idle');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState({
    studentId: studentId || "",
    sessionRate: sessionRate || 0,
    date: new Date().toISOString().split('T')[0],
    topic: "",
    performance: 5,
    paid: false,
    notes: "",
    homework: "",
    focusAreas: [] as string[],
    durationMinutes: 0,
  });

  // Persistence logic
  useEffect(() => {
    if (isOpen && !studentId) {
      const lastId = localStorage.getItem('lastSelectedStudentId');
      if (lastId) {
        setFormData(prev => ({ ...prev, studentId: lastId }));
        // Also find session rate for this student if possible
      }
    }
  }, [isOpen, studentId]);

  // Timer Logic
  useEffect(() => {
    if (timerStatus === 'running') {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerStatus]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => setTimerStatus('running');
  const handlePauseTimer = () => setTimerStatus('paused');
  const handleEndTimer = () => {
    setTimerStatus('ended');
    const mins = Math.max(1, Math.ceil(timerSeconds / 60));
    setFormData(prev => ({ ...prev, durationMinutes: mins }));
  };

  const handleAddFocusArea = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;
    if (e) e.preventDefault();
    
    if (newFocusArea.trim() && formData.focusAreas.length < 10) {
      setFormData(prev => ({
        ...prev,
        focusAreas: [...prev.focusAreas, newFocusArea.trim()]
      }));
      setNewFocusArea("");
    }
  };

  const handleRemoveFocusArea = (index: number) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.filter((_, i) => i !== index)
    }));
  };

  const generateHomework = async () => {
    if (!formData.notes && formData.focusAreas.length === 0) {
      setError({ title: "Insufficient Information", message: "Please provide either session notes or focus areas first." });
      return;
    }

    setAiGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/homework", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: formData.notes,
          focusAreas: formData.focusAreas,
        }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(text || "Received non-JSON response from AI API");
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to generate homework");
      }
      setFormData(prev => ({ ...prev, homework: data.homework }));
    } catch (err: any) {
      console.error("AI Generation failed:", err);
      setError({ 
        title: "AI Lab Offline", 
        message: err.message || "Ensure your Gemini API key is correct and your internet is connected." 
      });
    } finally {
      setAiGenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen && !studentId) {
      const fetchStudentsData = async () => {
        setFetchingStudents(true);
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error: fetchError } = await supabase
            .from("students")
            .select("id, name, session_rate, parent_whatsapp")
            .eq("tutor_id", user.id)
            .order("name");

          if (fetchError) throw fetchError;
          setStudents(data || []);

          // Update session rate if lastSelectedStudentId was loaded
          const lastId = localStorage.getItem('lastSelectedStudentId');
          if (lastId && !studentId) {
            const selected = data?.find(s => s.id === lastId);
            if (selected) {
              setFormData(prev => ({ ...prev, sessionRate: selected.session_rate }));
            }
          }
        } catch (err: any) {
          console.error("Error fetching students:", err);
        } finally {
          setFetchingStudents(false);
        }
      };
      fetchStudentsData();
    }
  }, [isOpen, studentId, supabase]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      studentId: studentId || prev.studentId,
      sessionRate: sessionRate || prev.sessionRate,
    }));
  }, [studentId, sessionRate]);

  if (!isOpen) return null;

  const handleStudentChange = (id: string) => {
    const selected = students.find(s => s.id === id);
    setFormData({
      ...formData,
      studentId: id,
      sessionRate: selected?.session_rate || 0,
    });
    if (id) {
      localStorage.setItem('lastSelectedStudentId', id);
    }
  };

  const handleFinalizeAndShare = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Get current tutor
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // 2. Save session to database
      const { error: insertError } = await supabase
        .from("sessions")
        .insert({
          student_id: formData.studentId,
          tutor_id: user.id,
          date: formData.date,
          topic: formData.topic,
          performance: formData.performance,
          paid: formData.paid,
          session_rate: formData.sessionRate,
          duration_minutes: formData.durationMinutes,
          notes: formData.notes,
          homework: formData.homework,
          focus_areas: formData.focusAreas,
        });

      if (insertError) throw insertError;

      // 3. Fetch fresh student data (name, parent_whatsapp)
      const { data: studentData, error: fetchError } = await supabase
        .from("students")
        .select("name, parent_whatsapp")
        .eq("id", formData.studentId)
        .single();

      if (fetchError || !studentData) {
        throw new Error("Failed to fetch fresh student data for sharing.");
      }

      // 4. Validate parent WhatsApp exists
      if (!studentData.parent_whatsapp?.trim()) {
        alert("Parent WhatsApp number is not set. Please update the student profile first.");
        onSuccess();
        onClose();
        return;
      }

      // 5. Generate WhatsApp link
      const { link } = await generateWhatsAppLinkWithPhone({
        name: studentData.name,
        studentId: formData.studentId,
        date: formData.date,
        performance: formData.performance,
        focus_areas: formData.focusAreas, // Changed parameter name to match schema/needs
        sessionNotes: formData.notes,
        homeworkAssignments: formData.homework,
      } as any, studentData.parent_whatsapp);

      // Set the generated share link state to trigger the success screen with native anchor
      setShareLink(link);
      onSuccess();
    } catch (err: any) {
      console.error("Error in handleFinalizeAndShare:", err);
      setError({ title: "Sync Error", message: err.message || "Failed to log and share session" });
    } finally {
      setLoading(false);
    }
  };

  // Modify handleSubmit to return success state
  const handleSubmit = async (e?: React.FormEvent): Promise<boolean> => {
    if (e) e.preventDefault();
    if (!formData.studentId) {
      setError({ title: "Validation Error", message: "Please select a student before saving." });
      return false;
    }
    
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: insertError } = await supabase
        .from("sessions")
        .insert({
          student_id: formData.studentId,
          tutor_id: user.id,
          date: formData.date,
          topic: formData.topic,
          performance: formData.performance,
          paid: formData.paid,
          session_rate: formData.sessionRate,
          duration_minutes: formData.durationMinutes,
          notes: formData.notes,
          homework: formData.homework,
          focus_areas: formData.focusAreas,
        });

      if (insertError) throw insertError;

      onSuccess();
      onClose();
      // Reset form (simplified for brevity)
      setTimerSeconds(0);
      setTimerStatus('idle');
      return true;
    } catch (err: any) {
      setError({ title: "Sync Error", message: err.message || "Failed to log session" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const colors = {
    navy: "#1E3A5F",
    gold: "#D4AF37",
    textPrimary: "#1E3A5F",
    textMuted: "#7F8C8D",
    bgLight: "#F8FAFC",
    error: "#E74C3C"
  };

  const labelClass = "text-[12px] font-bold uppercase tracking-wider text-[#7F8C8D] mb-1.5 block";
  const inputClass = "w-full px-4 py-2.5 rounded-[6px] bg-[#F5F5F5] border border-transparent focus:border-[#1a3a52] focus:bg-white outline-none transition-all duration-200 text-[#2C3E50] placeholder:text-[#7F8C8D]/50";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#FFFFFF] rounded-[12px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[95vh] font-['Inter',_sans-serif]">
        
        {/* Header Section */}
        <div style={{ backgroundColor: colors.navy }} className="h-16 px-6 flex items-center justify-between shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#D4AF37]" style={{ fontSize: '24px' }}>auto_stories</span>
            </div>
            <div>
              <h2 className="!text-white font-bold text-lg leading-tight tracking-tight">Academic Atelier</h2>
              <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em]">Session Logger</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all text-[#D4AF37] active:scale-95"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Content Section */}
        {shareLink ? (
          <div className="flex-1 overflow-y-auto p-8 text-center flex flex-col items-center justify-center space-y-6 bg-[#F8FAFC]">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-100">
              <span className="material-symbols-outlined text-emerald-500 text-3xl font-bold">check_circle</span>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-[#1E3A5F] tracking-tight">Session Logged!</h3>
              <p className="text-[#7F8C8D] mt-2 max-w-sm mx-auto text-sm leading-relaxed">
                The session details have been saved successfully to your atelier. You can now share the progress report with the parent.
              </p>
            </div>

            <div className="w-full max-w-sm flex flex-col gap-3 pt-4">
              <a
                href={shareLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  onClose();
                  setShareLink(null);
                  setTimerSeconds(0);
                  setTimerStatus('idle');
                }}
                className="w-full h-14 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-[#25D366]/20"
                style={{ textDecoration: 'none' }}
              >
                <span className="material-symbols-outlined fill-white">share</span>
                SHARE TO WHATSAPP
              </a>
              <button
                onClick={() => {
                  onClose();
                  setShareLink(null);
                  setTimerSeconds(0);
                  setTimerStatus('idle');
                }}
                className="w-full h-14 border-2 border-slate-200 text-[#1E3A5F] rounded-xl font-bold hover:bg-slate-50 transition-all uppercase tracking-[0.15em] text-xs"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[#F8FAFC]">
            
            {/* Section 1: Session Details */}
            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Select Student</label>
              <div className="relative">
                <select
                  required
                  disabled={!!studentId || fetchingStudents}
                  value={formData.studentId}
                  onChange={(e) => handleStudentChange(e.target.value)}
                  className={`${inputClass} appearance-none pr-10 text-[#1a3a52] font-semibold`}
                >
                  {!formData.studentId && <option value="">Select Student...</option>}
                  {studentId ? (
                    <option value={studentId}>Current Student</option>
                  ) : (
                    students.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))
                  )}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#1a3a52]">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Session Date</label>
              <div className="relative">
                <input
                  required
                  type="date"
                  className={`${inputClass} font-semibold`}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#7F8C8D]">
                  <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Circular Timer Card */}
          <div className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-ambient border border-[#1E3A5F]/5">
            <div className="flex items-center gap-6">
              {/* Circular SVG Timer */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="#F1F5F9"
                    strokeWidth="4"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke={colors.gold}
                    strokeWidth="4"
                    strokeDasharray={226.19}
                    strokeDashoffset={226.19 - (Math.min(timerSeconds % 3600, 3600) / 3600) * 226.19}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#1E3A5F] text-[20px] animate-pulse">
                    {timerStatus === 'running' ? 'timer' : 'timer_off'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-0.5">
                <span className="text-[#7F8C8D] text-[10px] font-bold uppercase tracking-widest">Session Time</span>
                <div className="text-3xl font-bold font-mono tracking-wider text-[#1E3A5F]">
                  {formatTime(timerSeconds)}
                </div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={timerStatus === 'running' ? handlePauseTimer : handleStartTimer}
              className={`h-12 px-6 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg ${
                timerStatus === 'running' 
                  ? "bg-slate-100 text-[#1E3A5F] hover:bg-slate-200" 
                  : "bg-[#1E3A5F] text-white hover:opacity-90"
              }`}
            >
              <span className="material-symbols-outlined">{timerStatus === 'running' ? 'pause_circle' : 'play_circle'}</span>
              {timerStatus === 'idle' ? 'Start' : timerStatus === 'running' ? 'Pause' : 'Resume'}
            </button>
          </div>

          {/* Session Content Section */}
          <div className="bg-white rounded-[12px] p-5 shadow-sm border-l-[4px]" style={{ borderLeftColor: colors.gold }}>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className={labelClass}>Topic / Lesson Unit</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Quantum Mechanics - Photoelectric Effect"
                  className={inputClass}
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Detailed Notes</label>
                <textarea
                  className={`${inputClass} min-h-[100px] resize-none leading-relaxed`}
                  placeholder="Summarize the core learnings and student engagement..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Magic Homework Creator Section */}
          <div className="bg-white rounded-2xl p-6 shadow-ambient border border-[#D4AF37]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <span className="material-symbols-outlined text-6xl text-[#D4AF37]">auto_awesome</span>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#D4AF37] text-[18px]">magic_button</span>
                </div>
                <h3 className="text-[#1E3A5F] font-bold tracking-tight">Magic Homework Creator</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setFormData(prev => ({ ...prev, focusAreas: [] }))}
                className="text-[#D4AF37] text-[10px] font-bold hover:underline uppercase tracking-widest"
              >
                Clear All
              </button>
            </div>

            {/* Focus Areas Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {formData.focusAreas.map((area, index) => (
                <div key={index} className="flex items-center gap-2 bg-[#F8FAFC] border border-[#1E3A5F]/10 text-[#1E3A5F] px-4 py-2 rounded-xl text-xs font-bold transition-all hover:border-[#D4AF37]/40">
                  {area}
                  <button type="button" onClick={() => handleRemoveFocusArea(index)} className="text-[#7F8C8D] hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-[14px]">cancel</span>
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2 w-full mt-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Identify a learning hurdle..."
                    className={`${inputClass} !bg-white border-[#1E3A5F]/10 focus:border-[#D4AF37] !text-xs`}
                    value={newFocusArea}
                    onChange={(e) => setNewFocusArea(e.target.value)}
                    onKeyDown={handleAddFocusArea}
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => handleAddFocusArea()}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1E3A5F] text-[#D4AF37] hover:bg-[#1E3A5F]/90 transition-all active:scale-90"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={generateHomework}
              disabled={aiGenerating}
              className="w-full h-14 rounded-xl text-white font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-70 shadow-lg relative overflow-hidden group btn-magic bg-[#1E3A5F]"
            >
              {aiGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-[#D4AF37] rounded-full animate-spin" />
                  <span>Synthesizing Magic...</span>
                </>
              ) : (
                <>
                  <span>GENERATE HOMEWORK</span>
                  <span className="material-symbols-outlined text-[20px] text-[#D4AF37]">auto_awesome</span>
                  <div className="shimmer" />
                </>
              )}
            </button>

            {/* Homework Output */}
            {(formData.homework || error) && (
              <div 
                className={`mt-6 rounded-xl p-5 font-mono text-xs min-h-[140px] bg-[#F8FAFC] border border-[#1E3A5F]/5 transition-all duration-500 ${error ? 'border-l-4 border-l-[#E74C3C]' : 'border-t-2 border-t-[#D4AF37]'}`}
              >
                {error ? (
                  <div className="flex items-start gap-3 text-[#E74C3C]">
                    <span className="material-symbols-outlined">report</span>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold uppercase tracking-wider text-[10px]">{error.title}</span>
                      <span className="leading-relaxed">{error.message}</span>
                    </div>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-[#1E3A5F]/80 leading-relaxed">
                    {formData.homework || "// Your magical session plan awaits..."}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* Session Assessment Section */}
          <div className="bg-white rounded-2xl p-6 shadow-ambient space-y-6 border border-[#1E3A5F]/5">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={labelClass}>Performance</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({ ...formData, performance: s })}
                      className="transition-all duration-300 ease-out hover:scale-125 active:scale-95"
                    >
                      <span className={`material-symbols-outlined text-[28px] transition-colors ${s <= formData.performance ? "text-[#D4AF37] fill-[#D4AF37]" : "text-[#7F8C8D] opacity-20"}`}>
                        grade
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Payment Status</label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paid: !formData.paid })}
                  className={`w-full h-12 flex items-center justify-center gap-2 rounded-xl transition-all duration-300 ease-out border-2 font-bold text-xs tracking-widest ${formData.paid ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-white border-[#1E3A5F]/10 text-[#1E3A5F] hover:border-[#1E3A5F] active:scale-95"}`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {formData.paid ? "verified" : "account_balance_wallet"}
                  </span>
                  {formData.paid ? "SETTLED" : "PENDING"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Sticky Footer */}
        {!shareLink && (
          <div className="sticky bottom-0 px-8 py-6 border-t border-[#1E3A5F]/5 bg-white flex flex-col md:flex-row gap-4 shrink-0 shadow-[0_-10px_40px_-15px_rgba(30,58,95,0.1)]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-14 rounded-xl border-2 border-slate-200 text-[#1E3A5F] font-bold hover:bg-slate-50 transition-all uppercase tracking-[0.15em] text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !formData.studentId}
              style={{ border: `2px solid ${colors.navy}`, color: colors.navy }}
              className="flex-1 h-14 rounded-xl font-bold hover:bg-slate-50 transition-all disabled:opacity-40 uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? "Processing..." : "Finalize & Log"}
            </button>
            <button
              type="button"
              onClick={handleFinalizeAndShare}
              disabled={loading || !formData.studentId}
              style={{ backgroundColor: colors.navy }}
              className="flex-1 h-14 rounded-xl text-white font-bold hover:opacity-95 transition-all disabled:opacity-40 uppercase tracking-[0.15em] text-xs shadow-xl shadow-[#1E3A5F]/20 flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-[#D4AF37] rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Log & Share
                  <span className="material-symbols-outlined text-[18px]" style={{ color: '#25D366' }}>share</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${colors.gold}22;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${colors.gold}44;
        }
        
        .shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(212, 175, 55, 0.2),
            transparent
          );
          transform: translateX(-100%);
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }

        .btn-magic:hover .shimmer {
          animation-duration: 1.5s;
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          position: absolute;
          right: 0;
          width: 100%;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

