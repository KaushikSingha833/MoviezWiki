"use client";

import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  // Password Validation State
  const [pwdValid, setPwdValid] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  });

  const router = useRouter();

  // Real-time Password Checking
  useEffect(() => {
    setPwdValid({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@$!%*?&_#^]/.test(password)
    });
  }, [password]);

  const isPasswordSecure = Object.values(pwdValid).every(Boolean);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordSecure) return;
    
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (name.trim()) {
        await updateProfile(userCredential.user, { displayName: name.trim() });
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err: any) {
      setError("Failed to authenticate with Google. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col lg:flex-row w-full text-white font-sans overflow-hidden">
      {/* Left Column - Visual / Photo Side */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 bg-black overflow-hidden border-r border-neutral-800">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 transform hover:scale-105"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-[#121212]" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-3xl font-black text-[#F5C518] tracking-wider hover:opacity-90 transition-opacity drop-shadow-md">
            <span>🎬</span> MoviezWiki
          </Link>
        </div>

        <div className="relative z-10 max-w-xl my-auto py-8">
          <div className="mb-8 p-6 rounded-2xl bg-neutral-900/75 border border-neutral-700/60 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-indigo-500/50">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-full uppercase tracking-wider shadow">
                ✨ Free Cinephile Membership
              </span>
            </div>
            <h4 className="text-lg font-bold text-white mb-3">Unlock Powerful Cinema Tools:</h4>
            <ul className="space-y-3 text-neutral-300 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-[#F5C518] font-bold text-base leading-none mt-0.5">✓</span>
                <span><strong className="text-white font-semibold">Gemini AI Plot Summaries:</strong> Instant spoiler-free breakdowns and critical analysis.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#F5C518] font-bold text-base leading-none mt-0.5">✓</span>
                <span><strong className="text-white font-semibold">Universal Watchlists:</strong> Save movies, anime, and TV series with one-click cloud syncing.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#F5C518] font-bold text-base leading-none mt-0.5">✓</span>
                <span><strong className="text-white font-semibold">World Cinema Charts:</strong> Deep-dive into regional rankings and top celebrity net worth reports.</span>
              </li>
            </ul>
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-wide drop-shadow-lg mb-3">
            Join the Ultimate Community of Film Enthusiasts
          </h1>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
            Create your account in seconds and step into a completely personalized entertainment ecosystem.
          </p>
        </div>

        <div className="relative z-10 text-xs text-neutral-500 flex items-center justify-between pt-6 border-t border-neutral-800/80">
          <span>© {new Date().getFullYear()} MoviezWiki. All rights reserved.</span>
          <span className="text-neutral-400">Secure Firebase Authentication</span>
        </div>
      </div>

      {/* Right Column - Form Side */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center px-6 sm:px-12 md:px-20 py-8 bg-[#121212] relative overflow-y-auto">
        <div className="w-full max-w-md space-y-6 my-auto">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-4">
            <Link href="/" className="inline-flex items-center gap-2 text-3xl font-black text-[#F5C518] tracking-wider">
              <span>🎬</span> MoviezWiki
            </Link>
          </div>

          <div className="space-y-2 text-left">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Create an Account</h2>
            <p className="text-sm text-neutral-400">
              Fill in your details below to begin your cinema journey.
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

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-neutral-800 text-white rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all shadow-inner"
                  placeholder="John Doe"
                />
              </div>
            </div>

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

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                Secure Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-neutral-800 text-white rounded-xl pl-12 pr-12 py-3.5 text-sm focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all shadow-inner"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Interactive Password Requirements Grid */}
              <div className="mt-3 p-3 bg-neutral-900/50 rounded-xl border border-neutral-800">
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-2">Password Requirements</p>
                <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-xs">
                  <div className={`flex items-center gap-1.5 transition-colors duration-300 ${pwdValid.length ? 'text-green-500' : 'text-neutral-400'}`}>
                    {pwdValid.length ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 transition-colors duration-300 ${pwdValid.upper ? 'text-green-500' : 'text-neutral-400'}`}>
                    {pwdValid.upper ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                    <span>1 uppercase</span>
                  </div>
                  <div className={`flex items-center gap-1.5 transition-colors duration-300 ${pwdValid.lower ? 'text-green-500' : 'text-neutral-400'}`}>
                    {pwdValid.lower ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                    <span>1 lowercase</span>
                  </div>
                  <div className={`flex items-center gap-1.5 transition-colors duration-300 ${pwdValid.number ? 'text-green-500' : 'text-neutral-400'}`}>
                    {pwdValid.number ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                    <span>1 number</span>
                  </div>
                  <div className={`flex items-center gap-1.5 transition-colors duration-300 ${pwdValid.special ? 'text-green-500' : 'text-neutral-400'}`}>
                    {pwdValid.special ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                    <span>1 symbol (@$!%*?&)</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordSecure}
              className="w-full bg-gradient-to-r from-[#F5C518] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-black font-black py-3.5 px-4 rounded-xl shadow-[0_4px_20px_rgba(245,197,24,0.25)] hover:shadow-[0_6px_25px_rgba(245,197,24,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 mt-2 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2.5"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Free Account ➔</span>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-neutral-800 flex-1"></div>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Or continue with</span>
            <div className="h-px bg-neutral-800 flex-1"></div>
          </div>
          
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full bg-white text-black font-black py-3.5 px-4 rounded-xl shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_6px_25px_rgba(255,255,255,0.2)] transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span>Sign Up with Google</span>
          </button>

          <div className="pt-6 border-t border-neutral-800/80 text-center">
            <p className="text-neutral-400 text-sm">
              Already have an account?{" "}
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