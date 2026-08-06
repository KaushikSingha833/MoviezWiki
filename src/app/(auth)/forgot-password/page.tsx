"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Check your inbox! We have sent a link to reset your password.");
    } catch (err: any) {
      setError(err.message || "Failed to send password reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col lg:flex-row w-full text-white font-sans overflow-hidden">
      {/* Left Column - Visual / Photo Side */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 bg-black overflow-hidden border-r border-neutral-800">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 transform hover:scale-105"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-[#121212]" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-3xl font-black text-[#F5C518] tracking-wider hover:opacity-90 transition-opacity drop-shadow-md">
            <span>🎬</span> MoviezWiki
          </Link>
        </div>

        <div className="relative z-10 max-w-xl my-auto py-12">
          <div className="mb-8 p-6 rounded-2xl bg-neutral-900/75 border border-neutral-700/60 backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold bg-amber-500/20 text-[#F5C518] border border-[#F5C518]/30 px-3 py-1 rounded-full uppercase tracking-wider">
                🔒 Account Recovery
              </span>
            </div>
            <p className="text-neutral-200 text-sm leading-relaxed font-normal">
              Don't worry! It happens to the best cinephiles. Once you reset your password, you'll gain instant access back to your saved movies, custom wishlists, and Gemini AI insights.
            </p>
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-wide drop-shadow-lg mb-3">
            Recover Your MoviezWiki Profile
          </h1>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-lg">
            Follow the instructions sent to your email to securely establish a new password and return to your cinema exploration.
          </p>
        </div>

        <div className="relative z-10 text-xs text-neutral-500 flex items-center justify-between pt-6 border-t border-neutral-800/80">
          <span>© {new Date().getFullYear()} MoviezWiki. All rights reserved.</span>
          <span className="text-neutral-400">Secure Firebase Authentication</span>
        </div>
      </div>

      {/* Right Column - Form Side */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center px-6 sm:px-12 md:px-20 py-12 bg-[#121212] relative overflow-y-auto">
        <div className="w-full max-w-md space-y-7 my-auto">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-3xl font-black text-[#F5C518] tracking-wider">
              <span>🎬</span> MoviezWiki
            </Link>
          </div>

          <div className="space-y-2 text-left">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Reset Password</h2>
            <p className="text-sm text-neutral-400">
              Enter your account's email address and we will send you a secure password reset link.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-4 rounded-xl flex items-start gap-3 shadow-lg animate-shake">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 text-sm p-4 rounded-xl flex items-start gap-3 shadow-lg">
              <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-neutral-800 text-white rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all shadow-inner"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#F5C518] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-black font-black py-3.5 px-4 rounded-xl shadow-[0_4px_20px_rgba(245,197,24,0.25)] hover:shadow-[0_6px_25px_rgba(245,197,24,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 mt-4 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2.5"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending Link...</span>
                </>
              ) : (
                <span>Send Reset Link ➔</span>
              )}
            </button>
          </form>

          <div className="pt-6 border-t border-neutral-800/80 text-center space-y-3">
            <p className="text-neutral-400 text-sm">
              Remember your password?{" "}
              <Link href="/login" className="text-[#F5C518] hover:text-amber-400 hover:underline font-bold transition-colors ml-1">
                Log In
              </Link>
            </p>
          </div>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
              ← Return to Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}