"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useState } from "react";
import QuickLogModal from "./student/QuickLogModal";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Students", href: "/students", icon: "group" },
  { label: "Payments", href: "/payments", icon: "payments" },
  { label: "Lessons", href: "/sessions", icon: "event_note" },
];

const bottomItems = [
  { label: "Settings", href: "#", icon: "settings" },
  { label: "Help", href: "#", icon: "help_outline" },
];

function NavIcon({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={`material-symbols-outlined text-[20px] ${className || ""}`}
    >
      {name}
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);

  return (
    <>
      {/* Google Material Symbols */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
      />

      {/* Desktop Sidebar */}
      <aside
        style={{
          width: "260px",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          background: "#1a3a52",
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
          zIndex: 50,
          overflowY: "auto",
        }}
        className="hidden lg:flex"
      >
        {/* Header Branding */}
        <div style={{ padding: "0 12px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #d4af37, #b8941f)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a3a52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-5 9 5 9 5-9-5-9z"/>
                <path d="M12 3v18"/>
                <path d="M7 12h10"/>
              </svg>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>
              The Atelier
            </h1>
          </div>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginTop: "6px", marginLeft: "44px" }}>
            Independent Tutor
          </p>
        </div>

        {/* Main Nav */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  position: "relative",
                  ...(isActive
                    ? {
                        background: "rgba(255,255,255,0.1)",
                        color: "white",
                        borderLeft: "3px solid #d4af37",
                        paddingLeft: "9px", // compensate for border
                      }
                    : {
                        color: "rgba(255,255,255,0.6)",
                        borderLeft: "3px solid transparent",
                        paddingLeft: "9px",
                      }),
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.6)";
                  }
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "20px",
                    color: isActive ? "#d4af37" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Nav */}
        <div style={{ paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          {/* Gold "New Lesson" CTA — primary action */}
          <button
            onClick={() => setIsQuickLogOpen(true)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px 16px",
              borderRadius: "10px",
              background: "#d4af37",
              color: "#1a3a52",
              border: "none",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              marginBottom: "12px",
              transition: "all 0.2s",
              boxShadow: "0 4px 12px rgba(212,175,55,0.3)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#c9a42e";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 16px rgba(212,175,55,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#d4af37";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(212,175,55,0.3)";
            }}
          >
            <span style={{ fontSize: "18px", lineHeight: 1 }}>+</span> New Lesson
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {bottomItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "9px 12px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "white";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.5)";
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-outline-variant/15">
        <div className="flex items-center justify-around py-2 px-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-[var(--radius-lg)] transition-all duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-on-surface-variant"
                }`}
              >
                <NavIcon
                  name={item.icon}
                  className={isActive ? "text-primary" : "text-on-surface-variant"}
                />
                <span className="text-[10px] font-600">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        onSuccess={() => router.refresh()}
      />
    </>
  );
}
