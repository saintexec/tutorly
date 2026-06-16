"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import QuickLogModal from "@/components/student/QuickLogModal";
import SessionDetailsModal from "@/components/student/SessionDetailsModal";

type Session = {
  id: string;
  date: string;
  topic: string;
  performance: number;
  paid: boolean;
  payment_status: string;
  notes: string;
  homework: string;
  session_rate: number;
  status: string;
  students: {
    id: string;
    name: string;
    subject: string;
  };
};

type FilterStatus = "all" | "paid" | "unpaid" | "completed" | "scheduled";

export default function SessionsPage() {
  const supabase = createClient();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("sessions")
        .select(`
          id, date, topic, performance, paid, payment_status,
          notes, homework, session_rate, status,
          students!inner(id, name, subject, tutor_id)
        `)
        .eq("students.tutor_id", user.id)
        .order("date", { ascending: false });

      if (error) throw error;
      setSessions((data as any[]) || []);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleTogglePaid = async (sessionId: string, current: boolean) => {
    try {
      await supabase
        .from("sessions")
        .update({ paid: !current, payment_status: !current ? "paid" : "unpaid" })
        .eq("id", sessionId);
      setSessions(prev =>
        prev.map(s => s.id === sessionId ? { ...s, paid: !current, payment_status: !current ? "paid" : "unpaid" } : s)
      );
    } catch (err) {
      console.error("Error toggling payment:", err);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm("Delete this session? This cannot be undone.")) return;
    try {
      await supabase.from("sessions").delete().eq("id", sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    } catch (err) {
      console.error("Error deleting session:", err);
    }
  };

  const filtered = useMemo(() => {
    return sessions.filter(s => {
      const matchSearch =
        !search ||
        s.students?.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.topic?.toLowerCase().includes(search.toLowerCase()) ||
        s.students?.subject?.toLowerCase().includes(search.toLowerCase());

      const isCompleted = s.status === "completed" || s.performance != null;
      const isUnpaid = !s.paid || s.payment_status === "unpaid";

      const matchFilter =
        filterStatus === "all" ||
        (filterStatus === "paid" && s.paid) ||
        (filterStatus === "unpaid" && isUnpaid) ||
        (filterStatus === "completed" && isCompleted) ||
        (filterStatus === "scheduled" && !isCompleted);

      return matchSearch && matchFilter;
    });
  }, [sessions, search, filterStatus]);

  // Stats
  const totalSessions = sessions.length;
  const paidSessions = sessions.filter(s => s.paid).length;
  const unpaidSessions = sessions.filter(s => !s.paid).length;
  const totalRevenue = sessions.filter(s => s.paid).reduce((acc, s) => acc + (s.session_rate || 0), 0);
  const pendingRevenue = sessions.filter(s => !s.paid).reduce((acc, s) => acc + (s.session_rate || 0), 0);
  const avgPerformance = sessions.length > 0
    ? (sessions.reduce((acc, s) => acc + (s.performance || 0), 0) / sessions.length).toFixed(1)
    : "0.0";

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const filters: { key: FilterStatus; label: string }[] = [
    { key: "all", label: "All" },
    { key: "paid", label: "Paid" },
    { key: "unpaid", label: "Unpaid" },
    { key: "completed", label: "Completed" },
    { key: "scheduled", label: "Scheduled" },
  ];

  return (
    <div className="space-y-8 pb-10">

      {/* ── Header ──────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.875rem",
              fontWeight: 800,
              color: "#1a3a52",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Sessions
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
            View, manage, and track every tutoring session across all students.
          </p>
        </div>
        <button
          onClick={() => setIsQuickLogOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            background: "#1a3a52",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(26,58,82,0.25)",
            whiteSpace: "nowrap",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add_circle</span>
          Log Session
        </button>
      </div>

      {/* ── Stat Cards ──────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        {[
          { label: "Total Sessions", value: totalSessions, icon: "event_note", color: "#1a3a52", bg: "rgba(26,58,82,0.08)" },
          { label: "Paid Sessions", value: paidSessions, icon: "check_circle", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
          { label: "Unpaid Sessions", value: unpaidSessions, icon: "pending", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
          { label: "Avg Rating", value: `${avgPerformance}/5`, icon: "grade", color: "#d4af37", bg: "rgba(212,175,55,0.12)" },
        ].map(card => (
          <div
            key={card.label}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "20px 24px",
              boxShadow: "0 4px 20px -4px rgba(2,36,72,0.08)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: card.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "22px", color: card.color }}>{card.icon}</span>
            </div>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9ca3af", margin: "0 0 2px" }}>
                {card.label}
              </p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1a3a52", margin: 0, lineHeight: 1 }}>
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search + Filter Bar ──────────────────────── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 260px", minWidth: "200px" }}>
          <span
            className="material-symbols-outlined"
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "18px",
              color: "#9ca3af",
              pointerEvents: "none",
            }}
          >
            search
          </span>
          <input
            type="text"
            placeholder="Search student or topic…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 42px",
              borderRadius: "10px",
              border: "1.5px solid #e5e7eb",
              fontSize: "14px",
              outline: "none",
              background: "white",
              color: "#1a3a52",
              transition: "border-color 0.2s",
              boxSizing: "border-box",
            }}
            onFocus={e => (e.target.style.borderColor = "#1a3a52")}
            onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
          />
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilterStatus(f.key)}
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                border: "none",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                background: filterStatus === f.key ? "#1a3a52" : "white",
                color: filterStatus === f.key ? "white" : "#6b7280",
                boxShadow: filterStatus === f.key ? "0 4px 12px rgba(26,58,82,0.25)" : "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sessions Table ───────────────────────────── */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 20px -4px rgba(2,36,72,0.08)",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ padding: "64px 32px", textAlign: "center" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid #e5e7eb",
                borderTopColor: "#1a3a52",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <p style={{ color: "#9ca3af", fontSize: "14px" }}>Loading sessions…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "64px 32px", textAlign: "center" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#d1d5db", display: "block", marginBottom: "12px" }}>
              event_busy
            </span>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1a3a52", margin: "0 0 6px" }}>
              {search || filterStatus !== "all" ? "No sessions match your filters" : "No sessions yet"}
            </h3>
            <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 20px" }}>
              {search || filterStatus !== "all"
                ? "Try changing your search or filter."
                : "Log your first session to get started."}
            </p>
            {!search && filterStatus === "all" && (
              <button
                onClick={() => setIsQuickLogOpen(true)}
                style={{
                  padding: "10px 24px",
                  background: "#1a3a52",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Log First Session
              </button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                  {["Date / Time", "Student", "Topic", "Rating", "Payment", "Actions"].map(h => (
                    <th
                      key={h}
                      style={{
                        padding: "14px 20px",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#9ca3af",
                        textAlign: h === "Actions" ? "right" : h === "Rating" || h === "Payment" ? "center" : "left",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const student = s.students || {} as any;
                  const isCompleted = s.status === "completed" || s.performance != null;
                  const initials = student.name
                    ? student.name.substring(0, 2).toUpperCase()
                    : "?";
                  const avatarColors = ["#1a3a52", "#d4af37", "#22c55e", "#8b5cf6", "#ef4444"];
                  const avatarColor = avatarColors[i % avatarColors.length];

                  return (
                    <tr
                      key={s.id}
                      onClick={() => { setSelectedSession(s); setIsSessionModalOpen(true); }}
                      style={{
                        borderBottom: i < filtered.length - 1 ? "1px solid #f9fafb" : "none",
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* Date */}
                      <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "#1a3a52", margin: 0 }}>
                          {formatDate(s.date)}
                        </p>
                        <p style={{ fontSize: "11px", color: "#9ca3af", margin: "2px 0 0" }}>
                          {formatTime(s.date)}
                        </p>
                      </td>

                      {/* Student */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: avatarColor,
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: "13px",
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a3a52", margin: 0 }}>
                              {student.name || "Unknown"}
                            </p>
                            <p style={{ fontSize: "11px", color: "#9ca3af", margin: "1px 0 0" }}>
                              {student.subject || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Topic */}
                      <td style={{ padding: "16px 20px", maxWidth: "200px" }}>
                        <p
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#374151",
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {s.topic || "—"}
                        </p>
                        <p style={{ fontSize: "11px", color: "#9ca3af", margin: "2px 0 0" }}>
                          {isCompleted ? "Completed" : "Scheduled"}
                        </p>
                      </td>

                      {/* Rating */}
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        {s.performance != null ? (
                          <div style={{ display: "flex", justifyContent: "center", gap: "2px" }}>
                            {[1, 2, 3, 4, 5].map(star => (
                              <span
                                key={star}
                                className="material-symbols-outlined"
                                style={{
                                  fontSize: "15px",
                                  color: star <= s.performance ? "#d4af37" : "#e5e7eb",
                                }}
                              >
                                grade
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ fontSize: "12px", color: "#d1d5db" }}>—</span>
                        )}
                      </td>

                      {/* Payment */}
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        <button
                          onClick={e => { e.stopPropagation(); handleTogglePaid(s.id, !!s.paid); }}
                          style={{
                            padding: "4px 12px",
                            borderRadius: "999px",
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            border: "1.5px solid",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            ...(s.paid
                              ? { background: "rgba(34,197,94,0.1)", color: "#16a34a", borderColor: "#22c55e" }
                              : { background: "rgba(239,68,68,0.08)", color: "#dc2626", borderColor: "#ef4444" }),
                          }}
                        >
                          {s.paid ? "PAID" : "UNPAID"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "16px 20px", textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                          <button
                            onClick={e => { e.stopPropagation(); setSelectedSession(s); setIsSessionModalOpen(true); }}
                            title="View details"
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              border: "none",
                              background: "rgba(26,58,82,0.06)",
                              color: "#1a3a52",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(26,58,82,0.12)")}
                            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(26,58,82,0.06)")}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>visibility</span>
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); handleDeleteSession(s.id); }}
                            title="Delete session"
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              border: "none",
                              background: "rgba(239,68,68,0.06)",
                              color: "#ef4444",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.14)")}
                            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.06)")}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Footer Summary */}
            <div
              style={{
                borderTop: "1px solid #f3f4f6",
                padding: "14px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                Showing {filtered.length} of {totalSessions} sessions
              </span>
              <div style={{ display: "flex", gap: "24px" }}>
                <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: 700 }}>
                  Collected: RM {totalRevenue.toFixed(2)}
                </span>
                <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: 700 }}>
                  Pending: RM {pendingRevenue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ─────────────────────────────────── */}
      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        onSuccess={fetchSessions}
      />

      {selectedSession && (
        <SessionDetailsModal
          isOpen={isSessionModalOpen}
          onClose={() => { setIsSessionModalOpen(false); setSelectedSession(null); }}
          session={selectedSession}
          student={selectedSession.students}
        />
      )}
    </div>
  );
}
