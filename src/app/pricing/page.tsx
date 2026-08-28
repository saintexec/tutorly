import Link from "next/link";
import type { Metadata } from "next";
import { Hammer } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — Tutorly",
  description: "Tutorly pricing plans.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="sticky top-0 z-50 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-[var(--font-display)] text-xl font-800 text-[#022448]">
            Tutorly
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-sm font-medium text-[#43474e] hover:text-[#022448] transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm font-medium text-[#022448] border-b-2 border-[#022448] pb-1">Pricing</Link>
            <Link href="/about" className="text-sm font-medium text-[#43474e] hover:text-[#022448] transition-colors">About</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-[#022448] hover:text-[#1e3a5f] transition-colors">Log In</Link>
            <Link href="/signup" className="text-sm font-bold text-white bg-[#022448] px-5 py-2.5 rounded-full hover:bg-[#1e3a5f] transition-colors">Sign Up</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="font-[var(--font-display)] text-4xl lg:text-5xl font-800 text-[#022448] tracking-tight mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-[#43474e] max-w-2xl mx-auto mb-12">
          We are currently building our pricing models to best serve independent educators in Malaysia. Check back soon!
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#e8fbe9] text-[#006e2f] font-bold text-sm tracking-wide">
          <Hammer size={18} />
          Coming Soon
        </div>
      </main>
    </div>
  );
}
