import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tutorly — The Academic Atelier",
  description: "Tutorly handles your students, sessions, payments and lesson plans — all in one place.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#adc8f5] selection:text-[#001c3b]">
      {/* ── Navbar ────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#F8FAFC]/90 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-[var(--font-display)] text-xl font-800 text-[#022448] tracking-tight">
            Tutorly
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link href="#features" className="text-[13px] font-semibold tracking-wide text-[#43474e] hover:text-[#022448] transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-[13px] font-semibold tracking-wide text-[#43474e] hover:text-[#022448] transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="text-[13px] font-semibold tracking-wide text-[#43474e] hover:text-[#022448] transition-colors">
              About
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[13px] font-bold tracking-wide text-[#022448] hover:text-[#1e3a5f] transition-colors">
              Log In
            </Link>
            <Link
              href="/signup"
              className="text-[13px] font-bold tracking-wide text-white bg-[#022448] px-6 py-2.5 rounded-full hover:bg-[#1e3a5f] hover:shadow-lg transition-all active:scale-95"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* ── Hero Section ─────────────────────────────────── */}
        <section className="max-w-[1200px] mx-auto px-6 pt-16 lg:pt-24 pb-24">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#fff3e0] text-[#e65100] text-[10px] font-800 uppercase tracking-widest border border-[#ffe0b2]">
                <span className="text-sm">🚀</span> THE CALM, PEACE OF MIND FOR EDUCATORS
              </div>

              <h1 className="font-[var(--font-display)] text-[3.5rem] lg:text-[4.5rem] font-800 leading-[1.05] text-[#022448] tracking-tight">
                Reclaim your evenings. Finally, a tutoring tool that feels like a{" "}
                <span className="text-[#455f87]">deep breath.</span>
              </h1>

              <p className="text-[15px] text-[#43474e] leading-relaxed max-w-[480px]">
                Tutorly takes the 'admin' out of teaching, so you can focus on what you love—helping your students thrive. No more WhatsApp chaos, just calm organization.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#1E3A5F] text-white font-bold text-sm tracking-wide transition-all hover:bg-[#022448] hover:shadow-xl hover:-translate-y-0.5"
                >
                  Start Your Calm Journey <span className="text-lg leading-none">&rarr;</span>
                </Link>
                <button className="inline-flex items-center gap-2 text-[#43474e] font-bold text-sm hover:text-[#022448] transition-colors group">
                  <div className="w-8 h-8 rounded-full border border-[#c4c6cf] flex items-center justify-center group-hover:border-[#022448] transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  Watch a demo
                </button>
              </div>

              <div className="flex items-center gap-4 pt-6">
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
                  Join 500+ educators reclaiming their time
                </p>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative isolate pt-6 pb-12 pr-6">
              <div className="absolute inset-0 right-12 bottom-24 bg-[#e0e3e5]/30 rounded-[3rem] -z-10" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/5] max-h-[600px]">
                <Image
                  src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=1000"
                  alt="Educator working peacefully with coffee"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Floating Pill */}
              <div className="absolute -bottom-2 -left-6 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 pr-8 flex items-center gap-4 animate-[float_4s_ease-in-out_infinite]">
                <div className="w-8 h-8 rounded-full bg-[#e8fbe9] flex items-center justify-center text-[#006e2f]">
                  <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                </div>
                <div>
                  <p className="text-[13px] font-800 text-[#022448]">RM 150.00</p>
                  <p className="text-[10px] text-[#74777f] font-medium leading-tight">
                    Payment received.<br/>Auto-receipt sent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features Section ──────────────────────────────── */}
        <section id="features" className="max-w-[1200px] mx-auto px-6 py-24 border-t border-[#eceef0]">
          <div className="text-center mb-16 space-y-3">
            <h2 className="font-[var(--font-display)] text-[2.25rem] font-800 text-[#022448]">
              Your Personal Sanctuary
            </h2>
            <p className="text-[14px] text-[#43474e]">
              Every tool you need to scale your teaching, designed to feel effortless.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* AI Planner Card */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-outline-variant/20 flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div className="space-y-4 mb-12">
                <div className="w-12 h-12 rounded-2xl bg-[#fff8e1] flex items-center justify-center text-[#f57f17]">
                  <span className="material-symbols-outlined text-[24px]">auto_fix</span>
                </div>
                <h3 className="font-[var(--font-display)] text-2xl font-800 text-[#022448]">AI Lesson Planner</h3>
                <p className="text-[13px] text-[#43474e] leading-relaxed max-w-[340px]">
                  Generate structured SPM/IGCSE lesson plans in seconds. Let the AI handle the structure while you add the heart.
                </p>
              </div>
              <div className="bg-[#191c1e] rounded-xl overflow-hidden shadow-2xl aspect-[4/3] relative flex items-center justify-center border border-[#43474e]">
                {/* Mock UI Dashboard representation inside the card */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#022448]/50 to-[#191c1e] opacity-80" />
                <div className="relative text-[#adc8f5] flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full border-[6px] border-[#4ae176] border-l-[#1e3a5f] bg-transparent mb-4 shadow-[0_0_20px_#4ae176]" />
                  <div className="flex gap-2">
                    <div className="w-8 h-2 bg-[#43474e] rounded-full" />
                    <div className="w-12 h-2 bg-[#43474e] rounded-full" />
                    <div className="w-6 h-2 bg-[#43474e] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (2 stacked cards) */}
            <div className="grid grid-rows-2 gap-6">
              {/* Student Care */}
              <div className="bg-[#022448] rounded-3xl p-8 lg:p-10 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-[#adc8f5] text-[10px] uppercase font-bold tracking-widest opacity-60">
                  Relationships
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#1e3a5f] flex items-center justify-center text-[#adc8f5]">
                  <span className="material-symbols-outlined text-[24px]">group</span>
                </div>
                <div className="mt-12 space-y-2">
                  <h3 className="font-[var(--font-display)] text-[22px] font-800 text-white">Student Care</h3>
                  <p className="text-[13px] text-[#adc8f5] leading-relaxed max-w-[300px]">
                    Centralized profiles that remember the details. Track progress and attendance without the mental load.
                  </p>
                </div>
              </div>

              {/* Gentle Reminders */}
              <div className="bg-[#006e2f] rounded-3xl p-8 lg:p-10 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-[#6bff8f] text-[10px] uppercase font-bold tracking-widest opacity-60">
                  Cash
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#005321] flex items-center justify-center text-[#6bff8f]">
                  <span className="material-symbols-outlined text-[24px]">payments</span>
                </div>
                <div className="mt-12 space-y-2">
                  <h3 className="font-[var(--font-display)] text-[22px] font-800 text-white">Gentle Reminders</h3>
                  <p className="text-[13px] text-[#e8fbe9] leading-relaxed max-w-[300px]">
                    Automated invoicing that stays professional. No more awkward money talks—just seamless payments.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Effortless Logging Row */}
          <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/20 p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-[380px] space-y-4 w-full">
              <div className="w-10 h-10 rounded-xl bg-[#e3f2fd] flex items-center justify-center text-[#1565c0]">
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              </div>
              <h3 className="font-[var(--font-display)] text-xl font-800 text-[#022448]">Effortless Logging</h3>
              <p className="text-[13px] text-[#43474e] leading-relaxed">
                Log your impact as you teach. Automatically generate beautiful monthly reports that show parents exactly how much their child is thriving.
              </p>
            </div>
            
            <div className="flex gap-4 w-full justify-end max-w-[500px]">
              <div className="flex-1 bg-[#F8FAFC] rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-[#eceef0] aspect-video">
                <span className="material-symbols-outlined text-[#74777f] text-[28px]">update</span>
                <span className="text-[10px] tracking-widest uppercase font-bold text-[#74777f]">Session Logged</span>
              </div>
              <div className="flex-1 bg-[#F8FAFC] rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-[#eceef0] aspect-video">
                <span className="material-symbols-outlined text-[#74777f] text-[28px]">favorite</span>
                <span className="text-[10px] tracking-widest uppercase font-bold text-[#74777f]">Growth Tracked</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────── */}
        <section className="bg-white py-24 border-t border-[#eceef0]">
          <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-4">
              <h2 className="font-[var(--font-display)] text-4xl lg:text-[2.75rem] font-800 leading-[1.1] text-[#022448] tracking-tight">
                Hear from fellow educators.
              </h2>
              <p className="text-[14px] text-[#43474e] leading-relaxed pt-2 opacity-80 max-w-[280px]">
                We built Tutorly because we saw how much pressure tutors were under. Here's how it changed things for them.
              </p>
            </div>

            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              {/* Testimonial 1 */}
              <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-outline-variant/20 flex flex-col justify-between">
                <p className="text-[14px] leading-relaxed text-[#191c1e] italic font-medium">
                  "Finally a tool that works for my SPM classes! The session logging saves me 5 hours of admin every single week. I actually have my Sundays back."
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

              {/* Testimonial 2 */}
              <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-outline-variant/20 flex flex-col justify-between">
                <p className="text-[14px] leading-relaxed text-[#191c1e] italic font-medium">
                  "No more missing payments! Parents love the professionalism of the automated invoices. It's removed all the stress from the business side."
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

        {/* ── Bottom CTA ───────────────────────────────────── */}
        <section className="max-w-[1200px] mx-auto px-6 py-24">
          <div className="bg-[#022448] rounded-[2.5rem] p-12 lg:py-20 lg:px-24 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#1e3a5f] rounded-full blur-[100px] opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1e3a5f] rounded-full blur-[100px] opacity-60 pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-8 flex flex-col items-center">
              <h2 className="font-[var(--font-display)] text-[2.5rem] lg:text-[3.5rem] font-800 leading-[1.05] text-white tracking-tight">
                Ready to reclaim your space and time?
              </h2>
              <p className="text-[15px] text-[#adc8f5] leading-relaxed max-w-lg">
                Join 500+ independent tutors who have traded administrative overwhelm for calm, creative teaching.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-[#022448] font-bold text-[15px] tracking-wide transition-all shadow-lg hover:bg-[#F8FAFC] hover:shadow-xl hover:-translate-y-0.5"
              >
                Get Started Free Today
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="bg-[#F8FAFC] pb-12 pt-6">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-6 border-t border-[#eceef0] pt-12">
          <div className="space-y-4 text-center lg:text-left">
            <Link href="/" className="font-[var(--font-display)] text-xl font-800 text-[#022448] tracking-tight hover:opacity-80 transition-opacity">
              Tutorly
            </Link>
            <p className="text-[9px] uppercase tracking-widest text-[#74777f] font-bold leading-normal max-w-[200px]">
              © 2024 Tutorly. Built with care for the independent educator.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-12">
            <Link href="#" className="text-[10px] font-bold tracking-widest uppercase text-[#74777f] hover:text-[#022448] transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-[10px] font-bold tracking-widest uppercase text-[#74777f] hover:text-[#022448] transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-[10px] font-bold tracking-widest uppercase text-[#74777f] hover:text-[#022448] transition-colors">
              Support
            </Link>
            <Link href="#" className="text-[10px] font-bold tracking-widest uppercase text-[#74777f] hover:text-[#022448] transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
