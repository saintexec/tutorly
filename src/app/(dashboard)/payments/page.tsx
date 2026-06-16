"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type PaymentRecord = {
  id: string;
  date: string;
  topic: string;
  paid: boolean;
  payment_status: string;
  session_rate: number;
  students: {
    id: string;
    name: string;
    subject: string;
    level: string;
  };
};

type FilterType = "all" | "paid" | "unpaid";

export default function PaymentsPage() {
  const supabase = createClient();
  const [records, setRecords] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [markingAll, setMarkingAll] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("sessions")
        .select(`
          id, date, topic, paid, payment_status, session_rate,
          students!inner(id, name, subject, level, tutor_id)
        `)
        .eq("students.tutor_id", user.id)
        .order("date", { ascending: false });

      if (error) throw error;
      setRecords((data as any[]) || []);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleTogglePaid = async (id: string, current: boolean) => {
    try {
      await supabase
        .from("sessions")
        .update({ paid: !current, payment_status: !current ? "paid" : "unpaid" })
        .eq("id", id);
      setRecords(prev =>
        prev.map(r => r.id === id ? { ...r, paid: !current, payment_status: !current ? "paid" : "unpaid" } : r)
      );
    } catch (err) {
      console.error("Error toggling payment:", err);
    }
  };

  // Group unpaid sessions by student for "Mark All Paid" workflow
  const handleMarkStudentPaid = async (studentId: string) => {
    setMarkingAll(true);
    try {
      await supabase
        .from("sessions")
        .update({ paid: true, payment_status: "paid" })
        .eq("student_id", studentId)
        .eq("paid", false);
      setRecords(prev =>
        prev.map(r =>
          r.students.id === studentId ? { ...r, paid: true, payment_status: "paid" } : r
        )
      );
    } catch (err) {
      console.error("Error marking all paid:", err);
    } finally {
      setMarkingAll(false);
    }
  };

  // ── Derived stats ──────────────────────────────
  const totalRevenue = records.filter(r => r.paid).reduce((a, r) => a + (r.session_rate || 0), 0);
  const outstandingRevenue = records.filter(r => !r.paid).reduce((a, r) => a + (r.session_rate || 0), 0);
  const paidCount = records.filter(r => r.paid).length;
  const unpaidCount = records.filter(r => !r.paid).length;
  const collectionRate = records.length > 0
    ? Math.round((paidCount / records.length) * 100)
    : 0;

  // ── Filter + Search ───────────────────────────
  const filtered = useMemo(() => {
    return records.filter(r => {
      const matchSearch =
        !search ||
        r.students?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.topic?.toLowerCase().includes(search.toLowerCase());

      const matchFilter =
        filter === "all" ||
        (filter === "paid" && r.paid) ||
        (filter === "unpaid" && !r.paid);

      return matchSearch && matchFilter;
    });
  }, [records, filter, search]);

  // ── Group by student for outstanding view ─────
  const studentGroups = useMemo(() => {
    const groups: Record<string, { student: PaymentRecord["students"]; sessions: PaymentRecord[] }> = {};
    records
      .filter(r => !r.paid)
      .forEach(r => {
        const sid = r.students.id;
        if (!groups[sid]) groups[sid] = { student: r.students, sessions: [] };
        groups[sid].sessions.push(r);
      });
    return Object.values(groups).sort((a, b) => b.sessions.length - a.sessions.length);
  }, [records]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const avatarColors = ["#1a3a52", "#d4af37", "#22c55e", "#8b5cf6", "#ef4444", "#f97316"];

  return (
    <div className="space-y-8 pb-10">

      {/* ── Header ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
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
            Payments
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0" }}>
            Track session fees, outstanding balances, and collection history.
          </p>
        </div>
      </div>

      {/* ── Summary Cards ──────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
        {[
          {
            label: "Total Collected",
            value: `RM ${totalRevenue.toFixed(2)}`,
            icon: "account_balance_wallet",
            color: "#22c55e",
            bg: "rgba(34,197,94,0.1)",
            border: "#22c55e",
          },
          {
            label: "Outstanding",
            value: `RM ${outstandingRevenue.toFixed(2)}`,
            icon: "pending_actions",
            color: "#ef4444",
            bg: "rgba(239,68,68,0.08)",
            border: "#ef4444",
          },
          {
            label: "Paid Sessions",
            value: String(paidCount),
            icon: "check_circle",
            color: "#1a3a52",
            bg: "rgba(26,58,82,0.08)",
            border: "#1a3a52",
          },
          {
            label: "Collection Rate",
            value: `${collectionRate}%`,
            icon: "bar_chart",
            color: "#d4af37",
            bg: "rgba(212,175,55,0.12)",
            border: "#d4af37",
          },
        ].map(card => (
          <div
            key={card.label}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "20px 24px",
              borderLeft: `4px solid ${card.border}`,
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
              <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9ca3af", margin: "0 0 2px" }}>
                {card.label}
              </p>
              <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1a3a52", margin: 0, lineHeight: 1 }}>
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Outstanding By Student ──────────────────── */}
      {studentGroups.length > 0 && (
        <div
          style={{
            background: "linear-gradient(135deg, #1a3a52 0%, #2d5478 100%)",
            borderRadius: "16px",
            padding: "24px 28px",
            color: "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#d4af37" }}>warning</span>
            <h2 style={{ fontSize: "15px", fontWeight: 800, margin: 0, color: "white" }}>
              Outstanding Balances
            </h2>
            <span
              style={{
                padding: "2px 10px",
                borderRadius: "999px",
                background: "rgba(239,68,68,0.25)",
                color: "#fca5a5",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              {studentGroups.length} student{studentGroups.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {studentGroups.map((group, i) => {
              const balance = group.sessions.reduce((a, s) => a + (s.session_rate || 0), 0);
              const avatarColor = avatarColors[i % avatarColors.length];
              return (
                <div
                  key={group.student.id}
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: "12px",
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: avatarColor,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "14px",
                      flexShrink: 0,
                    }}
                  >
                    {group.student.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: "120px" }}>
                    <p style={{ fontWeight: 700, fontSize: "14px", margin: 0, color: "white" }}>
                      {group.student.name}
                    </p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: "2px 0 0" }}>
                      {group.sessions.length} unpaid session{group.sessions.length !== 1 ? "s" : ""} • {group.student.subject}
                    </p>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: "16px", color: "#fca5a5" }}>
                    RM {balance.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleMarkStudentPaid(group.student.id)}
                    disabled={markingAll}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      background: "#d4af37",
                      color: "#1a3a52",
                      border: "none",
                      fontSize: "11px",
                      fontWeight: 800,
                      cursor: "pointer",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      transition: "opacity 0.2s",
                    }}
                  >
                    Mark All Paid
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Search + Filter ─────────────────────────── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 260px", minWidth: "200px" }}>
          <span
            className="material-symbols-outlined"
            style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "18px", color: "#9ca3af", pointerEvents: "none" }}
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
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={e => (e.target.style.borderColor = "#1a3a52")}
            onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
          />
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {(["all", "paid", "unpaid"] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 18px",
                borderRadius: "999px",
                border: "none",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                textTransform: "capitalize",
                transition: "all 0.2s",
                background: filter === f ? "#1a3a52" : "white",
                color: filter === f ? "white" : "#6b7280",
                boxShadow: filter === f ? "0 4px 12px rgba(26,58,82,0.25)" : "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              {f === "all" ? `All (${records.length})` : f === "paid" ? `Paid (${paidCount})` : `Unpaid (${unpaidCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* ── Payments Table ──────────────────────────── */}
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
            <p style={{ color: "#9ca3af", fontSize: "14px" }}>Loading payment records…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "64px 32px", textAlign: "center" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#d1d5db", display: "block", marginBottom: "12px" }}>
              receipt_long
            </span>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1a3a52", margin: "0 0 6px" }}>
              {search || filter !== "all" ? "No records match" : "No payment records yet"}
            </h3>
            <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>
              {search || filter !== "all"
                ? "Try adjusting your search or filter."
                : "Log your first session to start tracking payments."}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                  {["Date", "Student", "Topic", "Rate (RM)", "Status", "Action"].map(h => (
                    <th
                      key={h}
                      style={{
                        padding: "14px 20px",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#9ca3af",
                        textAlign: h === "Rate (RM)" || h === "Status" || h === "Action" ? "center" : "left",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const student = r.students || ({} as any);
                  const initials = student.name ? student.name.substring(0, 2).toUpperCase() : "?";
                  const avatarColor = avatarColors[i % avatarColors.length];
                  return (
                    <tr
                      key={r.id}
                      style={{
                        borderBottom: i < filtered.length - 1 ? "1px solid #f9fafb" : "none",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* Date */}
                      <td style={{ padding: "14px 20px", whiteSpace: "nowrap", fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                        {formatDate(r.date)}
                      </td>

                      {/* Student */}
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "50%",
                              background: avatarColor,
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: "12px",
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <Link
                              href={`/students/${student.id}`}
                              onClick={e => e.stopPropagation()}
                              style={{ fontSize: "13px", fontWeight: 700, color: "#1a3a52", textDecoration: "none" }}
                            >
                              {student.name}
                            </Link>
                            <p style={{ fontSize: "11px", color: "#9ca3af", margin: "1px 0 0" }}>
                              {student.subject} • {student.level}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Topic */}
                      <td
                        style={{
                          padding: "14px 20px",
                          fontSize: "13px",
                          color: "#374151",
                          maxWidth: "180px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.topic || "—"}
                      </td>

                      {/* Rate */}
                      <td style={{ padding: "14px 20px", textAlign: "center", fontSize: "14px", fontWeight: 800, color: "#1a3a52" }}>
                        {(r.session_rate || 0).toFixed(2)}
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: "14px 20px", textAlign: "center" }}>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: "999px",
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            ...(r.paid
                              ? { background: "rgba(34,197,94,0.1)", color: "#16a34a" }
                              : { background: "rgba(239,68,68,0.08)", color: "#dc2626" }),
                          }}
                        >
                          {r.paid ? "PAID" : "UNPAID"}
                        </span>
                      </td>

                      {/* Toggle Button */}
                      <td style={{ padding: "14px 20px", textAlign: "center" }}>
                        <button
                          onClick={() => handleTogglePaid(r.id, !!r.paid)}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "8px",
                            border: "1.5px solid",
                            fontSize: "11px",
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            letterSpacing: "0.04em",
                            ...(r.paid
                              ? { borderColor: "#e5e7eb", background: "white", color: "#9ca3af" }
                              : { borderColor: "#22c55e", background: "rgba(34,197,94,0.08)", color: "#16a34a" }),
                          }}
                        >
                          {r.paid ? "Mark Unpaid" : "Mark Paid"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Table Footer */}
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
                Showing {filtered.length} of {records.length} records
              </span>
              <div style={{ display: "flex", gap: "24px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#22c55e" }}>
                  Collected: RM {totalRevenue.toFixed(2)}
                </span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#ef4444" }}>
                  Outstanding: RM {outstandingRevenue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
