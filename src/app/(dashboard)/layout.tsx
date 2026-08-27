import Navbar from "@/components/Navbar";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Bell } from "lucide-react";

// Assuming you'll want to display real user initials
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let initials = "TU";
  
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("name")
      .eq("id", user.id)
      .single();
      
    if (profile && profile.name) {
      const parts = profile.name.split(" ");
      initials = parts.length > 1 
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : profile.name.substring(0, 2).toUpperCase();
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f6fa" }}>
      <Navbar />
      <main style={{ flex: 1, paddingBottom: "0", position: "relative", minWidth: 0 }} className="lg:pl-[260px] lg:pb-0 pb-20">
        {/* Top bar */}
        <header style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(26,58,82,0.08)",
          padding: "12px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 800, color: "#1a3a52", margin: 0, letterSpacing: "-0.02em" }} className="hidden lg:block">
              Tutorly
            </h1>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 800, color: "#1a3a52", margin: 0 }} className="lg:hidden">
              Tutorly
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              type="button"
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#6b7280",
              }}
            >
              <Bell size={20} />
              <span style={{
                position: "absolute",
                top: "8px",
                right: "10px",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#ef4444",
                border: "2px solid white",
              }} />
            </button>
            <div
              className="hidden lg:flex"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#1a3a52",
                color: "white",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              {initials}
            </div>
          </div>
        </header>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 40px 60px" }}>{children}</div>
      </main>
    </div>
  );
}
