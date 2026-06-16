"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setError(null);
    setLoading(true);
    
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleSignIn = async () => {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (authError) {
      setError(authError.message);
    }
  };

  return (
    <>
      <div className="mb-10 text-center">
        <h1 className="font-[var(--font-display)] text-3xl font-bold text-[#022448]">
          Tutorly
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-[0_4px_24px_-8px_rgba(2,36,72,0.08)] p-8 mb-8 w-full relative overflow-hidden">
        {/* Corner decorative blob from Stitch design */}
        <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-[#F8FAFC] rounded-bl-[48px] opacity-80" />
        
        <div className="relative z-10 space-y-8">
          <div className="space-y-2">
            <h2 className="font-[var(--font-display)] text-[22px] font-bold text-[#191c1e]">
              Welcome Back
            </h2>
            <p className="text-[13px] text-[#43474e] leading-relaxed pr-8">
              Continue your educational journey in your personal atelier.
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-wider text-[#43474e] uppercase">
                Email Address
              </label>
              <input
                type="email"
                placeholder="tutor@example.com"
                name="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-[#F2F4F6] text-[13px] text-[#191c1e] placeholder:text-[#74777f] border border-transparent focus:border-[#c4c6cf] focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold tracking-wider text-[#43474e] uppercase">
                  Password
                </label>
                <Link href="#" className="text-[11px] font-semibold text-[#022448] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-[#F2F4F6] text-[13px] text-[#191c1e] placeholder:text-[#74777f] tracking-widest border border-transparent focus:border-[#c4c6cf] focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="text-[13px] text-[#ba1a1a] bg-[#ffdad6] px-3 py-2 rounded-lg font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 rounded-lg bg-[#1E3A5F] text-white font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-[#022448] transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"} <span className="text-lg leading-none">&rarr;</span>
            </button>
          </form>

          <div className="flex items-center gap-3 pt-2">
            <div className="flex-1 h-[1px] bg-[#eceef0]" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#74777f]">or</span>
            <div className="flex-1 h-[1px] bg-[#eceef0]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 rounded-lg bg-[#F2F4F6] text-[#191c1e] font-semibold text-[13px] flex items-center justify-center gap-3 hover:bg-[#eceef0] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>

      <p className="text-[13px] text-[#43474e]">
        Don't have an account?{" "}
        <Link href="/signup" className="text-[#022448] font-bold hover:underline">
          Sign Up
        </Link>
      </p>
    </>
  );
}
