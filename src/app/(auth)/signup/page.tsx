"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) return;

    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // Create user record in our users table
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          name: fullName,
          email: email
        });

      if (insertError) {
        console.error("Failed to insert user into users table:", insertError);
      }

      router.push("/onboarding/1");
    } else {
      setLoading(false);
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
      <div className="mb-8 text-center space-y-2">
        <h1 className="font-[var(--font-display)] text-3xl font-bold text-[#022448]">
          Tutorly
        </h1>
        <p className="text-[13px] text-[#43474e]">
          Empowering educators, inspiring students.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-[0_4px_24px_-8px_rgba(2,36,72,0.08)] p-8 mb-8 w-full relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="space-y-1.5">
            <h2 className="font-[var(--font-display)] text-[22px] font-bold text-[#022448]">
              Create your account
            </h2>
            <p className="text-[13px] text-[#43474e]">
              Join the community of professional tutors in Malaysia.
            </p>
          </div>

          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-wider text-[#43474e] uppercase">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Ahmad bin Zulkifli"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-[#F2F4F6] text-[13px] text-[#191c1e] placeholder:text-[#74777f] border border-transparent focus:border-[#c4c6cf] focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-wider text-[#43474e] uppercase">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-[#F2F4F6] text-[13px] text-[#191c1e] placeholder:text-[#74777f] border border-transparent focus:border-[#c4c6cf] focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-wider text-[#43474e] uppercase">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-[#F2F4F6] text-[13px] text-[#191c1e] placeholder:text-[#74777f] tracking-widest border border-transparent focus:border-[#c4c6cf] focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-wider text-[#43474e] uppercase">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-[#F2F4F6] text-[13px] text-[#191c1e] placeholder:text-[#74777f] tracking-widest border border-transparent focus:border-[#c4c6cf] focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="text-[13px] text-[#ba1a1a] bg-[#ffdad6] px-3 py-2 rounded-lg font-medium">
                {error}
              </div>
            )}

            <div className="pt-2 pb-1 text-[10px] text-center text-[#43474e] leading-relaxed px-4">
              By creating an account, you agree to our{" "}
              <Link href="#" className="font-semibold text-[#191c1e] hover:underline">Terms of Service</Link>{" "}
              and{" "}
              <Link href="#" className="font-semibold text-[#191c1e] hover:underline">Privacy Policy</Link>.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 rounded-lg bg-[#1E3A5F] text-white font-medium text-[14px] flex items-center justify-center hover:bg-[#022448] transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>

      <p className="text-[13px] text-[#43474e]">
        Already have an account?{" "}
        <Link href="/login" className="text-[#022448] font-bold hover:underline">
          Sign In
        </Link>
      </p>
    </>
  );
}
