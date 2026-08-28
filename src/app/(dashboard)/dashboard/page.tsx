import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Calendar, Users, CheckCircle2, CreditCard, PlusCircle, MoreVertical } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let tutorName = "Tutor";
  let totalStudents = 0;
  let sessionsToday = 0;
  let unpaidSessions = 0;
  let todaysSessions: any[] = [];
  let recentActivity: any[] = [];

  if (user) {
    // 1. Fetch user profile — fallback chain: profile.name → user_metadata.full_name → "Tutor"
    const { data: profile } = await supabase
      .from("users")
      .select("name")
      .eq("id", user.id)
      .single();

    if (profile?.name) {
      tutorName = profile.name.split(" ")[0]; // First name only
    } else if (user.user_metadata?.full_name) {
      tutorName = user.user_metadata.full_name.split(" ")[0];
    } else if (user.user_metadata?.name) {
      tutorName = user.user_metadata.name.split(" ")[0];
    }

    // 2. Fetch total students
    const { count: studentCount } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("tutor_id", user.id);
    totalStudents = studentCount || 0;

    // 3. Fetch unpaid sessions — only completed sessions with payment_status = 'unpaid'
    const { data: unpaidData } = await supabase
      .from("sessions")
      .select(`id, payment_status, status, students!inner(tutor_id)`)
      .eq("students.tutor_id", user.id)
      .eq("payment_status", "unpaid")
      .eq("status", "completed");
    unpaidSessions = unpaidData?.length || 0;

    // 4. Fetch today's sessions
    const todayStr = new Date().toISOString().split("T")[0];
    const { data: todayData } = await supabase
      .from("sessions")
      .select(`
        id, 
        date, 
        topic,
        status,
        payment_status,
        paid,
        performance,
        students!inner(
          id,
          name,
          subject,
          tutor_id
        )
      `)
      .eq("students.tutor_id", user.id)
      .gte("date", todayStr + "T00:00:00")
      .lte("date", todayStr + "T23:59:59")
      .order("date", { ascending: true });

    todaysSessions = todayData || [];
    sessionsToday = todaysSessions.length;

    // 5. Fetch recent activity — exclude obvious test data
    const { data: recentData } = await supabase
      .from("sessions")
      .select(`
        id, 
        topic, 
        created_at,
        paid,
        payment_status,
        status,
        students!inner(name, subject, tutor_id)
      `)
      .eq("students.tutor_id", user.id)
      .not("students.name", "ilike", "%test%")
      .not("students.name", "ilike", "%dick%")
      .not("students.name", "ilike", "%dummy%")
      .not("students.name", "ilike", "%sample%")
      .not("students.name", "ilike", "%quantem%")
      .not("students.name", "ilike", "%chedly%")
      .order("created_at", { ascending: false })
      .limit(5);
    recentActivity = recentData || [];
  }

  // ── Helpers ────────────────────────────────────────────────
  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "TBD";
    }
  };

  const getRelativeTime = (dateString: string) => {
    try {
      const now = new Date();
      const then = new Date(dateString);
      const diffMs = now.getTime() - then.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return "";
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Next session time badge
  const nextSession = todaysSessions.find(
    (s) => s.status !== "completed" && new Date(s.date) > new Date()
  );
  const nextSessionTime = nextSession ? formatTime(nextSession.date) : null;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px 40px" }}>

      {/* ── Header / Greeting ─────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1a3a52", margin: 0, lineHeight: 1.2 }}>
              {getGreeting()}, {tutorName} 👋
            </h1>
            <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
              Welcome back to your atelier. You have{" "}
              <strong
                style={{
                  fontWeight: 700,
                  color: sessionsToday > 0 ? "#22c55e" : "#6b7280",
                  marginLeft: "4px",
                  marginRight: "4px",
                }}
              >
                {sessionsToday} {sessionsToday === 1 ? "session" : "sessions"}
              </strong>{" "}
              scheduled for today.
            </p>
          </div>
          <button className="btn-schedule">
            <Calendar size={18} />
            View Schedule
          </button>
        </div>
      </div>

      {/* ── 3 Stat Cards ──────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>

        {/* Total Students */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          borderLeft: "4px solid #d4af37",
          boxShadow: "0 4px 20px -4px rgba(2,36,72,0.08)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "140px",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "rgba(212,175,55,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Users size={20} color="#d4af37" />
              </div>
            <span style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#d4af37",
              background: "rgba(212,175,55,0.12)",
              padding: "3px 10px",
              borderRadius: "999px",
              letterSpacing: "0.02em",
            }}>
              +2 this month
            </span>
          </div>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7280", margin: "0 0 4px" }}>Total Students</p>
            <p style={{ fontSize: "2.5rem", fontWeight: 700, color: "#1a3a52", margin: 0, lineHeight: 1 }}>{totalStudents}</p>
          </div>
        </div>

        {/* Sessions Today */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          borderLeft: "4px solid #22c55e",
          boxShadow: "0 4px 20px -4px rgba(2,36,72,0.08)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "140px",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "rgba(34,197,94,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <CheckCircle2 size={20} color="#22c55e" />
              </div>
            {nextSessionTime ? (
              <span style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#16a34a",
                background: "rgba(34,197,94,0.1)",
                padding: "3px 10px",
                borderRadius: "999px",
              }}>
                Next: {nextSessionTime}
              </span>
            ) : sessionsToday > 0 ? (
              <span style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#16a34a",
                background: "rgba(34,197,94,0.1)",
                padding: "3px 10px",
                borderRadius: "999px",
              }}>
                All done ✓
              </span>
            ) : null}
          </div>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7280", margin: "0 0 4px" }}>Sessions Today</p>
            <p style={{ fontSize: "2.5rem", fontWeight: 700, color: "#1a3a52", margin: 0, lineHeight: 1 }}>{sessionsToday}</p>
          </div>
        </div>

        {/* Unpaid Sessions */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          borderLeft: "4px solid #ef4444",
          boxShadow: "0 4px 20px -4px rgba(2,36,72,0.08)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "140px",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "rgba(239,68,68,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <CreditCard size={20} color="#ef4444" />
              </div>
            {unpaidSessions > 0 && (
              <span
                title="Tap to review unpaid sessions"
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#dc2626",
                  background: "rgba(239,68,68,0.1)",
                  padding: "3px 10px",
                  borderRadius: "999px",
                  cursor: "pointer",
                }}
              >
                Attention needed
              </span>
            )}
          </div>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7280", margin: "0 0 4px" }}>Unpaid Sessions</p>
            <p style={{ fontSize: "2.5rem", fontWeight: 700, color: "#1a3a52", margin: 0, lineHeight: 1 }}>{unpaidSessions}</p>
            {unpaidSessions > 0 && (
              <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px", fontWeight: 500 }}>Tap to review</p>
            )}
          </div>
        </div>

      </div>

      {/* ── Today's Session List (Full Width) ─────────────── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#1a3a52", margin: 0 }}>Today&apos;s Session List</h2>
          <Link href="/sessions" style={{ fontSize: "12px", fontWeight: 700, color: "#1a3a52", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            View All
          </Link>
        </div>

        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "8px",
          boxShadow: "0 4px 20px -4px rgba(2,36,72,0.08)",
        }}>
          {todaysSessions.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: "rgba(26,58,82,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                  <Calendar size={32} color="#6b7280" />
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1a3a52", margin: "0 0 6px" }}>No sessions today</h3>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 20px", lineHeight: 1.6, maxWidth: "280px", marginLeft: "auto", marginRight: "auto" }}>
                  Your schedule is clear — a good time to follow up with students or generate lesson plans.
                </p>
                <button className="btn-log-cta">
                  <PlusCircle size={16} />
                  Log a Past Session
                </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {todaysSessions.map((session, i) => {
                const student = session.students || {};
                const isCompleted = session.status === "completed" || session.performance != null;
                const isUnpaid = session.payment_status === "unpaid" || (!session.paid && isCompleted);
                const avatarColor = ["#1a3a52", "#d4af37", "#22c55e", "#8b5cf6", "#ef4444"][i % 5];

                return (
                  <div key={session.id || i} className="session-row">
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: avatarColor,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "15px",
                        flexShrink: 0,
                      }}>
                        {student.name ? student.name.substring(0, 2).toUpperCase() : "?"}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: "#1a3a52", margin: 0, fontSize: "14px" }}>{student.name || "Unknown Student"}</p>
                        <p style={{ fontSize: "12px", color: "#6b7280", margin: "2px 0 0", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>{student.subject || session.topic || "Subject"}</span>
                          <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#d1d5db", display: "inline-block" }} />
                          <span>{session.date ? formatTime(session.date) : "N/A"}</span>
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{
                        padding: "4px 12px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: 600,
                        ...(isUnpaid
                          ? { background: "rgba(239,68,68,0.1)", color: "#dc2626" }
                          : isCompleted
                          ? { background: "rgba(34,197,94,0.1)", color: "#16a34a" }
                          : { background: "rgba(26,58,82,0.08)", color: "#1a3a52" }),
                      }}>
                        {isUnpaid ? "Unpaid" : isCompleted ? "Completed" : "Scheduled"}
                      </span>
                      <button className="btn-kebab">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Floating Action Button removed for cleaner UI ─────────────────────────── */}

    </div>
  );
}
