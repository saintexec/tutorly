import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import StudentProfileClient from "@/components/student/StudentProfileClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentProfilePage(props: PageProps) {
  const params = await props.params;
  const studentId = params.id;
  const supabase = await createClient();

  // 1. Fetch student detail
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("*")
    .eq("id", studentId)
    .single();

  if (studentError || !student) {
    return notFound();
  }

  // 2. Fetch sessions for history & performance
  const { data: sessions, error: sessionsError } = await supabase
    .from("sessions")
    .select("*")
    .eq("student_id", studentId)
    .order("date", { ascending: false });

  return (
    <StudentProfileClient 
      initialStudent={student} 
      initialSessions={sessions || []} 
    />
  );
}
