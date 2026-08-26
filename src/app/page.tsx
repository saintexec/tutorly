import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tutorly — The Academic Atelier for Independent Educators",
  description: "Tutorly handles your students, sessions, AI lesson plans, and automated payments — all in one place.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#adc8f5] selection:text-[#001c3b]">
      {/* ── Navbar ────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-[#eceef0]/60">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-[var(--font-display)] text-xl font-800 text-[#022448] tracking-tight">
            Tutorly
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link href="#features" className="text-[13px] font-semibold tracking-wide text-[#43474e] hover:text-[#022448] transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-[13px] font-semibold tracking-wide text-[#43474e] hover:text-[#022448] transition-colors">
              How it works
            </Link>
            <Link href="#pricing" className="text-[13px] font-semibold tracking-wide text-[#43474e] hover:text-[#022448] transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-[13px] font-semibold tracking-wide text-[#43474e] hover:text-[#022448] transition-colors">
              FAQ
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[13px] font-bold tracking-wide text-[#022448] hover:text-[#1e3a5f] transition-colors">
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-[13px] font-bold tracking-wide text-white bg-[#022448] px-6 py-2.5 rounded-full hover:bg-[#1e3a5f] hover:shadow-lg transition-all active:scale-95"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* ── Hero Section ─────────────────────────────────── */}
        <section className="max-w-[1200px] mx-auto px-6 pt-16 lg:pt-24 pb-20">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#fff3e0] text-[#e65100] text-[10px] font-800 uppercase tracking-widest border border-[#ffe0b2]">
                <span className="text-sm">🚀</span> THE CALM, PEACE OF MIND FOR EDUCATORS
              </div>

              <h1 className="font-[var(--font-display)] text-[3.5rem] lg:text-[4.5rem] font-800 leading-[1.05] text-[#022448] tracking-tight">
                Stop guessing who your next student is & drowning in <span className="text-[#455f87]">admin.</span>
              </h1>

              <p className="text-[15px] text-[#43474e] leading-relaxed max-w-[480px]">
                Tutorly finds, tracks, and organizes your students, lesson plans, and automated payments. Accurate, up-to-date, and designed to give you your evenings back.
              </p>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#022448] text-white font-bold text-sm tracking-wide transition-all hover:bg-[#1e3a5f] hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Get started for free <span className="text-lg leading-none">&rarr;</span>
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center px-6 py-4 rounded-xl border border-[#c4c6cf]/60 text-[#022448] font-bold text-sm tracking-wide hover:bg-white hover:border-[#022448] transition-all"
                  >
                    Log in
                  </Link>
                </div>
                <div className="flex items-center gap-6 text-[12px] text-[#74777f] font-medium pt-1">
                  <span>✓ No credit card required</span>
                  <span>✓ Cancel anytime</span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-[#eceef0]">
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
                    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150"
                  ].map((src, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#F8FAFC] overflow-hidden relative" style={{ zIndex: 3 - i }}>
                      <Image src={src} alt="Educator" fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-[11px] font-semibold tracking-wide text-[#74777f]">
                  Join 500+ independent educators reclaiming their time
                </p>
              </div>
            </div>

            {/* Interactive Hero Widget / Mockup */}
            <div className="relative isolate pt-4 pb-6">
              <div className="absolute inset-0 bg-[#e0e3e5]/25 rounded-[3rem] -z-10" />
              <div className="bg-white rounded-[2rem] shadow-2xl border border-[#eceef0] p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-[#eceef0] pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#74777f]">Live Session Tracker</span>
                    <h3 className="font-[var(--font-display)] text-lg font-800 text-[#022448]">Active Students & Revenue</h3>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#e8fbe9] text-[#006e2f]">
                    ● 1,482 Hours Logged
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { name: "Ahmad Rizqi", subject: "SPM Physics", status: "Paid", amount: "RM 150", color: "bg-[#e8fbe9] text-[#006e2f]" },
                    { name: "Sarah Jenkins", subject: "IGCSE English", status: "Scheduled", amount: "RM 120", color: "bg-[#e3f2fd] text-[#1565c0]" },
                    { name: "Marcus Tan", subject: "Advanced Math", status: "Pending", amount: "RM 180", color: "bg-[#fff8e1] text-[#f57f17]" },
                  ].map((row, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#eceef0]/80">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#022448] text-white flex items-center justify-center font-bold text-xs">
                          {row.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#022448]">{row.name}</p>
                          <p className="text-[10px] text-[#74777f]">{row.subject}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-[#022448]">{row.amount}</p>
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${row.color}`}>
                          {row.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <div className="p-3 bg-[#022448] text-white rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">auto_fix</span>
                      <span className="text-xs font-semibold">AI Lesson Plan generated</span>
                    </div>
                    <span className="text-[11px] text-[#adc8f5] font-bold">View &rarr;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Social Proof / Featured Badges ─────────────────── */}
        <section className="py-12 border-y border-[#eceef0] bg-white/50">
          <div className="max-w-[1200px] mx-auto px-6 text-center space-y-6">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#74777f]">
              Featured & Trusted By Leading Independent Educators & Networks
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all">
              <span className="font-[var(--font-display)] font-800 text-lg text-[#022448]">EdTech Asia</span>
              <span className="font-[var(--font-display)] font-800 text-lg text-[#022448]">TutorConnect</span>
              <span className="font-[var(--font-display)] font-800 text-lg text-[#022448]">SaaSFoundry</span>
              <span className="font-[var(--font-display)] font-800 text-lg text-[#022448]">IndependentTutors MY</span>
            </div>
          </div>
        </section>

        {/* ── How It Works ──────────────────────────────────── */}
        <section id="how-it-works" className="max-w-[1200px] mx-auto px-6 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#e65100] bg-[#fff3e0] px-3 py-1 rounded-md border border-[#ffe0b2]">
              Workflow
            </span>
            <h2 className="font-[var(--font-display)] text-[2.5rem] font-800 text-[#022448]">
              Three steps between you and your calmest term yet.
            </h2>
            <p className="text-[14px] text-[#43474e]">
              No steep learning curves or complicated spreadsheets. Built specifically for independent educators.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Onboard your students",
                desc: "Drop in student details, subjects, and custom rates in under two minutes. Everything is instantly organized.",
                icon: "group"
              },
              {
                step: "02",
                title: "Teach & log with one tap",
                desc: "Generate structured SPM/IGCSE lesson plans with AI and log your sessions instantly after class.",
                icon: "auto_fix"
              },
              {
                step: "03",
                title: "Get paid automatically",
                desc: "Send professional automated invoices and WhatsApp payment reminders with zero awkward money talks.",
                icon: "payments"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-[#eceef0] shadow-sm hover:shadow-md transition-shadow space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#e3f2fd] flex items-center justify-center text-[#1565c0]">
                      <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                    </div>
                    <span className="font-[var(--font-display)] font-800 text-2xl text-[#c4c6cf]/40">{item.step}</span>
                  </div>
                  <h3 className="font-[var(--font-display)] text-xl font-800 text-[#022448]">{item.title}</h3>
                  <p className="text-[13px] text-[#43474e] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features Section (Bento Grid) ─────────────────── */}
        <section id="features" className="max-w-[1200px] mx-auto px-6 py-24 border-t border-[#eceef0]">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#006e2f] bg-[#e8fbe9] px-3 py-1 rounded-md border border-[#c8e6c9]">
              Capabilities
            </span>
            <h2 className="font-[var(--font-display)] text-[2.5rem] font-800 text-[#022448]">
              Everything you need to run your tutoring practice.
            </h2>
            <p className="text-[14px] text-[#43474e]">
              Designed around clarity, speed, and peace of mind.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Card 1: AI Lesson Planner */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 lg:p-12 border border-[#eceef0] shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div className="space-y-4 max-w-lg mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#fff8e1] flex items-center justify-center text-[#f57f17]">
                  <span className="material-symbols-outlined text-[24px]">auto_fix</span>
                </div>
                <h3 className="font-[var(--font-display)] text-2xl font-800 text-[#022448]">AI Lesson Planner</h3>
                <p className="text-[13px] text-[#43474e] leading-relaxed">
                  Generate comprehensive, syllabus-aligned lesson plans in seconds. Let AI handle formatting while you focus on teaching.
                </p>
              </div>
              <div className="bg-[#191c1e] rounded-2xl p-6 text-[#adc8f5] font-mono text-xs space-y-2 border border-[#43474e]/40 shadow-xl">
                <div className="flex items-center gap-2 text-[#4ae176] pb-2 border-b border-[#43474e]/40">
                  <span className="w-2 h-2 rounded-full bg-[#4ae176] animate-pulse" />
                  <span>SPM Physics — Electromagnetic Induction (Generated)</span>
                </div>
                <p className="text-white font-sans text-sm font-bold pt-1">Objective: Understand Faraday&apos;s Law through real-world examples.</p>
                <p className="text-[#c4c6cf]">1. Introduction & Hook (5 mins)...</p>
                <p className="text-[#c4c6cf]">2. Core Guided Practice (20 mins)...</p>
              </div>
            </div>

            {/* Card 2: Student Care */}
            <div className="bg-[#022448] text-white rounded-3xl p-8 lg:p-10 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1e3a5f] flex items-center justify-center text-[#adc8f5]">
                  <span className="material-symbols-outlined text-[24px]">group</span>
                </div>
                <h3 className="font-[var(--font-display)] text-2xl font-800 text-white !text-white">Student Care</h3>
                <p className="text-[13px] text-[#adc8f5] leading-relaxed">
                  Centralized profiles that track attendance, past session notes, and academic growth without the mental load.
                </p>
              </div>
              <div className="pt-8">
                <Link href="/signup" className="text-xs font-bold text-white inline-flex items-center gap-1 hover:underline">
                  Explore student profiles &rarr;
                </Link>
              </div>
            </div>

            {/* Card 3: Gentle Reminders */}
            <div className="bg-[#006e2f] text-white rounded-3xl p-8 lg:p-10 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#005321] flex items-center justify-center text-[#6bff8f]">
                  <span className="material-symbols-outlined text-[24px]">payments</span>
                </div>
                <h3 className="font-[var(--font-display)] text-2xl font-800 text-white !text-white">Automated Invoicing</h3>
                <p className="text-[13px] text-[#e8fbe9] leading-relaxed">
                  Professional invoices and payment links sent seamlessly. No more awkward follow-ups—just reliable cashflow.
                </p>
              </div>
              <div className="pt-8">
                <Link href="/signup" className="text-xs font-bold text-white inline-flex items-center gap-1 hover:underline">
                  Learn about payments &rarr;
                </Link>
              </div>
            </div>

            {/* Card 4: Effortless Logging & Reports */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 lg:p-12 border border-[#eceef0] shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div className="space-y-4 max-w-lg mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#e3f2fd] flex items-center justify-center text-[#1565c0]">
                  <span className="material-symbols-outlined text-[24px]">calendar_month</span>
                </div>
                <h3 className="font-[var(--font-display)] text-2xl font-800 text-[#022448]">Effortless Logging & Parent Reports</h3>
                <p className="text-[13px] text-[#43474e] leading-relaxed">
                  Log session impact instantly. Generate beautiful monthly progress reports that show parents exactly how much their child is thriving.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#eceef0]">
                  <p className="text-xs font-bold text-[#022448]">Session Logged Successfully</p>
                  <p className="text-[11px] text-[#74777f]">Attendance marked, notes saved.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#eceef0]">
                  <p className="text-xs font-bold text-[#022448]">Monthly Report Sent</p>
                  <p className="text-[11px] text-[#74777f]">WhatsApp summary delivered to parents.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────── */}
        <section className="bg-white py-24 border-t border-[#eceef0]">
          <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1 space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#74777f]">Testimonials</span>
              <h2 className="font-[var(--font-display)] text-4xl font-800 leading-[1.1] text-[#022448] tracking-tight">
                Hear from fellow educators.
              </h2>
              <p className="text-[14px] text-[#43474e] leading-relaxed pt-2">
                We built Tutorly because we saw how much pressure independent tutors were under. Here&apos;s how it changed things for them.
              </p>
            </div>

            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-[#eceef0] flex flex-col justify-between">
                <p className="text-[14px] leading-relaxed text-[#191c1e] italic font-medium">
                  &quot;Finally a tool that works for my classes! The session logging saves me 5 hours of admin every single week. I actually have my Sundays back.&quot;
                </p>
                <div className="flex items-center gap-3 mt-8">
                  <div className="w-10 h-10 rounded-full bg-[#c4c6cf] overflow-hidden relative shadow-sm">
                    <Image src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150" alt="Ahmad" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-800 text-[#022448]">Ahmad</p>
                    <p className="text-[10px] text-[#74777f] uppercase tracking-wide">SPM Physics Specialist</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-[#eceef0] flex flex-col justify-between">
                <p className="text-[14px] leading-relaxed text-[#191c1e] italic font-medium">
                  &quot;No more missing payments! Parents love the professionalism of the automated invoices. It&apos;s removed all the stress from the business side.&quot;
                </p>
                <div className="flex items-center gap-3 mt-8">
                  <div className="w-10 h-10 rounded-full bg-[#c4c6cf] overflow-hidden relative shadow-sm">
                    <Image src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150" alt="Sarah" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-800 text-[#022448]">Sarah</p>
                    <p className="text-[10px] text-[#74777f] uppercase tracking-wide">Primary English Tutor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing Section ──────────────────────────────── */}
        <section id="pricing" className="max-w-[1200px] mx-auto px-6 py-24 border-t border-[#eceef0]">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#022448] bg-[#e3f2fd] px-3 py-1 rounded-md border border-[#bbdefb]">
              Transparent Pricing
            </span>
            <h2 className="font-[var(--font-display)] text-[2.5rem] font-800 text-[#022448]">
              Simple, transparent pricing for tutors.
            </h2>
            <p className="text-[14px] text-[#43474e]">
              Choose the plan that fits your practice. Switch or cancel anytime.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {/* Starter Plan */}
            <div className="bg-white rounded-3xl p-8 border border-[#eceef0] shadow-sm flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="font-[var(--font-display)] text-xl font-800 text-[#022448]">Starter</h3>
                  <p className="text-[13px] text-[#43474e] mt-1">Perfect for part-time tutors getting started.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-800 text-[#022448]">RM 29</span>
                  <span className="text-xs text-[#74777f]">/month</span>
                </div>
                <ul className="space-y-3 text-[13px] text-[#43474e]">
                  <li className="flex items-center gap-2">✓ Up to 15 active students</li>
                  <li className="flex items-center gap-2">✓ Core session logging</li>
                  <li className="flex items-center gap-2">✓ Manual invoices</li>
                  <li className="flex items-center gap-2">✓ Email support</li>
                </ul>
              </div>
              <div className="pt-8">
                <Link
                  href="/signup"
                  className="w-full inline-flex items-center justify-center py-3 rounded-xl border border-[#022448] text-[#022448] font-bold text-sm hover:bg-[#022448] hover:text-white transition-all"
                >
                  Start free trial
                </Link>
              </div>
            </div>

            {/* Growth Plan (Recommended) */}
            <div className="bg-[#022448] text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-[#adc8f5] text-[#022448] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Popular
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-[var(--font-display)] text-xl font-800 text-white !text-white">Growth</h3>
                  <p className="text-[13px] text-[#adc8f5] mt-1">For full-time independent educators scaling up.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-800 text-white">RM 59</span>
                  <span className="text-xs text-[#adc8f5]">/month</span>
                </div>
                <ul className="space-y-3 text-[13px] text-white">
                  <li className="flex items-center gap-2"><span className="text-[#adc8f5]">✓</span> Unlimited active students</li>
                  <li className="flex items-center gap-2"><span className="text-[#adc8f5]">✓</span> AI Lesson Planner access</li>
                  <li className="flex items-center gap-2"><span className="text-[#adc8f5]">✓</span> Automated WhatsApp & email invoices</li>
                  <li className="flex items-center gap-2"><span className="text-[#adc8f5]">✓</span> Parent growth reports</li>
                  <li className="flex items-center gap-2"><span className="text-[#adc8f5]">✓</span> Priority support</li>
                </ul>
              </div>
              <div className="pt-8">
                <Link
                  href="/signup"
                  className="w-full inline-flex items-center justify-center py-3 rounded-xl bg-white text-[#022448] font-bold text-sm hover:bg-[#F8FAFC] transition-all shadow-md"
                >
                  Get started now
                </Link>
              </div>
            </div>

            {/* Pro Atelier Plan */}
            <div className="bg-white rounded-3xl p-8 border border-[#eceef0] shadow-sm flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="font-[var(--font-display)] text-xl font-800 text-[#022448]">Pro Atelier</h3>
                  <p className="text-[13px] text-[#43474e] mt-1">For tutoring centers and small educator teams.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-800 text-[#022448]">RM 129</span>
                  <span className="text-xs text-[#74777f]">/month</span>
                </div>
                <ul className="space-y-3 text-[13px] text-[#43474e]">
                  <li className="flex items-center gap-2">✓ Everything in Growth</li>
                  <li className="flex items-center gap-2">✓ Up to 5 tutor seats</li>
                  <li className="flex items-center gap-2">✓ Multi-tutor scheduling & payroll</li>
                  <li className="flex items-center gap-2">✓ Dedicated account manager</li>
                </ul>
              </div>
              <div className="pt-8">
                <Link
                  href="/signup"
                  className="w-full inline-flex items-center justify-center py-3 rounded-xl border border-[#022448] text-[#022448] font-bold text-sm hover:bg-[#022448] hover:text-white transition-all"
                >
                  Contact sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ Section ───────────────────────────────────── */}
        <section id="faq" className="max-w-[900px] mx-auto px-6 py-24 border-t border-[#eceef0]">
          <div className="text-center mb-16 space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#74777f]">FAQ</span>
            <h2 className="font-[var(--font-display)] text-[2.5rem] font-800 text-[#022448]">
              Common questions
            </h2>
            <p className="text-[14px] text-[#43474e]">
              Everything you need to know about switching to Tutorly.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "How is Tutorly different from regular spreadsheets or WhatsApp?",
                a: "Spreadsheets don't send payment reminders or generate AI lesson plans. Tutorly automates your admin workflow entirely, keeping records clean and professional without the mental fatigue."
              },
              {
                q: "Can I migrate my existing student list easily?",
                a: "Yes! You can add students in seconds or import existing records directly into your dashboard."
              },
              {
                q: "How do parents receive invoices and progress reports?",
                a: "Invoices and monthly growth reports can be sent directly via WhatsApp or email with professional links that make payment frictionless."
              },
              {
                q: "Can I cancel my subscription at any time?",
                a: "Yes, you can cancel or switch your plan anytime with a single click from your account settings."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-[#eceef0] shadow-sm">
                <h3 className="font-[var(--font-display)] text-lg font-800 text-[#022448] mb-2">{faq.q}</h3>
                <p className="text-[13px] text-[#43474e] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ───────────────────────────────────── */}
        <section className="max-w-[1200px] mx-auto px-6 py-12 mb-16">
          <div className="bg-[#022448] rounded-[2.5rem] p-12 lg:py-20 lg:px-24 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#1e3a5f] rounded-full blur-[100px] opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1e3a5f] rounded-full blur-[100px] opacity-60 pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-8 flex flex-col items-center">
              <h2 className="font-[var(--font-display)] text-[2.5rem] lg:text-[3.5rem] font-800 leading-[1.05] text-white !text-white tracking-tight">
                Outreach and admin are now simpler than ever.
              </h2>
              <p className="text-[15px] text-[#adc8f5] leading-relaxed max-w-lg">
                Sign up now, organize your students in under 10 minutes, and reclaim your evenings.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-[#022448] font-bold text-[15px] tracking-wide transition-all shadow-lg hover:bg-[#F8FAFC] hover:shadow-xl hover:-translate-y-0.5"
                >
                  Get started for free
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-[#adc8f5]/40 text-white font-bold text-[15px] tracking-wide hover:bg-[#1e3a5f] transition-all"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="bg-[#F8FAFC] pb-12 pt-12 border-t border-[#eceef0]">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="font-[var(--font-display)] text-xl font-800 text-[#022448] tracking-tight hover:opacity-80 transition-opacity">
              Tutorly
            </Link>
            <p className="text-[11px] text-[#74777f] font-medium leading-relaxed max-w-[240px]">
              Know exactly how your students are progressing. Accurate, verified tracking, tailored for independent educators.
            </p>
          </div>
          
          <div className="space-y-3">
            <p className="text-[10px] font-bold tracking-widest uppercase text-[#022448]">Product</p>
            <ul className="space-y-2 text-[13px] text-[#43474e]">
              <li><Link href="#features" className="hover:text-[#022448] transition-colors">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-[#022448] transition-colors">How it works</Link></li>
              <li><Link href="#pricing" className="hover:text-[#022448] transition-colors">Pricing</Link></li>
              <li><Link href="/signup" className="hover:text-[#022448] transition-colors">Start Free Trial</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold tracking-widest uppercase text-[#022448]">Company</p>
            <ul className="space-y-2 text-[13px] text-[#43474e]">
              <li><Link href="/about" className="hover:text-[#022448] transition-colors">About</Link></li>
              <li><Link href="/login" className="hover:text-[#022448] transition-colors">Log In</Link></li>
              <li><Link href="/signup" className="hover:text-[#022448] transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold tracking-widest uppercase text-[#022448]">Legal</p>
            <ul className="space-y-2 text-[13px] text-[#43474e]">
              <li><Link href="#" className="hover:text-[#022448] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#022448] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 mt-12 pt-6 border-t border-[#eceef0] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#74777f]">
          <p>© 2026 Tutorly. Built with care for independent educators.</p>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <Link href="/login" className="font-bold text-[#022448] hover:underline">Log in</Link>
            <Link href="/signup" className="font-bold text-[#022448] hover:underline">Start free trial &rarr;</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
