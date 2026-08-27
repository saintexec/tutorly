"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import StudentCard from "@/components/student/StudentCard";
import AddStudentModal from "@/components/student/AddStudentModal";
import { UserPlus, Users } from "lucide-react";

export default function StudentsPage() {
  const supabase = createClient();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("tutor_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-[var(--font-display)] text-3xl font-800 text-on-surface tracking-tight">
            Students
          </h1>
          <p className="text-sm text-on-surface-variant font-500">
            Manage your academic atelier and track student progress.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary-container text-white rounded-[var(--radius-lg)] text-sm font-700 shadow-ambient hover:bg-primary transition-all active:scale-95"
        >
          <UserPlus size={20} />
          Add Student
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-surface-container-low animate-pulse" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest rounded-3xl border-2 border-dashed border-outline-variant/30 space-y-6">
          <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant/40">
            <Users size={48} />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-800 text-on-surface tracking-tight">No students yet</h2>
            <p className="text-sm text-on-surface-variant max-w-[280px]">
              Add your first student to start tracking their academic journey and performance.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-8 py-3 bg-primary-container text-white rounded-full text-sm font-800 shadow-ambient hover:bg-primary transition-all"
          >
            <UserPlus size={20} />
            Add Your First Student
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}

      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchStudents}
      />
    </div>
  );
}
