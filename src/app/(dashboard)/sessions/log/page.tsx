"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

function SessionLogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get("student_id");
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(5);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (isStarted && !session?.completed) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted, session]);

  // Fetch student details
  useEffect(() => {
    if (!studentId) {
      router.push("/students");
      return;
    }

    const fetchStudent = async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", studentId)
        .single();
      
      if (error || !data) {
        router.push("/students");
        return;
      }
      setStudent(data);
      setLoading(false);
    };

    fetchStudent();
  }, [studentId, supabase, router]);

  const handleStartLesson = async () => {
    if (!student) return;
    
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("sessions")
        .insert({
          student_id: studentId,
          tutor_id: user.id,
          date: new Date().toISOString(),
          session_rate: student.session_rate || 0,
          performance: rating,
          paid: false
        })
        .select()
        .single();

      if (error) throw error;
      setSession(data);
      setIsStarted(true);
    } catch (err: any) {
      console.error("Supabase Session Insert Error:", {
        message: err.message,
        details: err.details,
        hint: err.hint,
        code: err.code
      });
      alert(`Failed to start lesson: ${err.message || "Please check your database connection or RLS policies."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishLesson = async () => {
    setLoading(true);
    console.log("Saving session with performance:", rating); // Debugging
    try {
      const { error } = await supabase
        .from("sessions")
        .update({
          topic,
          notes,
          performance: rating,
        })
        .eq("id", session.id);

      if (error) throw error;
      router.push(`/students/${studentId}`);
    } catch (err: any) {
      console.error("Supabase Session Update Error:", {
        message: err.message,
        details: err.details,
        hint: err.hint
      });
      alert(`Failed to save session: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
        <p className="text-on-surface-variant font-600">Loading student details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-10 px-4">
      {/* Header */}
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-3xl font-[var(--font-display)] font-800 text-on-surface tracking-tight">
          {isStarted ? "Lesson in Progress" : "Log New Session"}
        </h1>
        <p className="text-on-surface-variant font-600 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[20px]">person</span>
          Student: {student.name} • {student.subject}
        </p>
      </div>

      {!isStarted ? (
        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-ambient border border-outline-variant/30 text-center space-y-6">
          <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center text-white mx-auto shadow-lg">
            <span className="material-symbols-outlined text-[40px]">play_arrow</span>
          </div>
          <div className="space-y-1">
             <p className="text-sm font-700 text-on-surface-variant uppercase tracking-widest">Snapshot Rate</p>
             <p className="text-2xl font-800 text-on-surface">RM {student.session_rate?.toFixed(2)} / Session</p>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed px-4">
            Create a session entry for this lesson. The fixed rate above will be applied for financial records.
          </p>
          <button
            onClick={handleStartLesson}
            className="w-full bg-primary-container text-white py-4 rounded-2xl font-800 text-lg shadow-ambient hover:bg-primary transition-all active:scale-[0.98]"
          >
            Confirm Start Lesson
          </button>
          <Link 
            href={`/students/${studentId}`}
            className="block text-sm font-700 text-on-surface-variant hover:text-on-surface"
          >
            Cancel and Go Back
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Timer Card */}
          <div className="bg-[#1e3a5f] rounded-3xl p-10 text-white text-center shadow-lg relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
             <p className="text-[12px] font-800 uppercase tracking-[0.2em] opacity-60 mb-2">Duration</p>
             <p className="text-6xl font-mono font-800 tracking-tighter tabular-nums">{formatTime(seconds)}</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-8 shadow-ambient border border-outline-variant/10 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-800 uppercase tracking-widest text-on-surface-variant ml-1">Learning Topic</label>
              <input
                type="text"
                placeholder="e.g. Quadratic Equations"
                className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-2 border-transparent focus:border-primary-container focus:bg-white transition-all outline-none font-600"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-800 uppercase tracking-widest text-on-surface-variant ml-1">Private Notes</label>
              <textarea
                placeholder="Student struggles with fractions..."
                className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-2 border-transparent focus:border-primary-container focus:bg-white transition-all outline-none font-600 min-h-[120px] resize-none"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-800 uppercase tracking-widest text-on-surface-variant ml-1">Today's Performance</label>
              <div className="flex justify-center gap-2 bg-surface-container-low p-4 rounded-2xl">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setRating(s)}
                    className="transition-all active:scale-95"
                  >
                    <span className={`material-symbols-outlined text-4xl ${s <= rating ? "text-[#edbf7f] fill-[#edbf7f]" : "text-outline-variant opacity-30"}`}>
                      star
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleFinishLesson}
              className="w-full bg-[#6bff8f] text-[#005321] py-4 rounded-2xl font-800 text-lg shadow-sm hover:opacity-90 transition-all active:scale-[0.98] mt-4"
            >
              Finish Lesson
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SessionLogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SessionLogContent />
    </Suspense>
  );
}
