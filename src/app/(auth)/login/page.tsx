"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      setError("Invalid email or password. Please check your credentials and try again.");
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
            backgroundImage: `url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')` 
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
          <div className="mb-8 p-6 rounded-2xl bg-neutral-900/70 border border-neutral-700/60 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-[#F5C518]/50">
            <div className="flex items-center gap-2 text-[#F5C518] mb-3">
              <div className="flex text-amber-400">★★★★★</div>
              <span className="text-xs font-bold bg-[#F5C518]/20 px-3 py-0.5 rounded-full text-[#F5C518] border border-[#F5C518]/30">
                AI-Powered Cinema Experience
              </span>
            </div>
            <p className="text-neutral-200 text-sm md:text-base italic leading-relaxed font-light">
              "MoviezWiki transformed how I discover films. The Gemini AI plot summaries let me explore without spoilers, and tracking my wishlist across global cinema is simply unmatched."
            </p>
            <div className="mt-4 flex items-center gap-3 pt-2 border-t border-neutral-800">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F5C518] to-amber-600 flex items-center justify-center font-black text-black text-sm shadow-md">
                AR
              </div>
              <div>
                <h4 className="text-white text-xs font-bold">Alex Rivera</h4>
                <p className="text-neutral-400 text-[11px]">Cinephile & Film Critic</p>
              </div>
            </div>
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-wide drop-shadow-lg mb-3">
            Your Gateway to the Universe of Entertainment
          </h1>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-lg">
            Stream trailers, analyze top cinema charts from around the globe, and organize your favorite movies and series seamlessly.
          </p>
        </div>

        <div className="relative z-10 text-xs text-neutral-500 flex items-center justify-between pt-6 border-t border-neutral-800/80">
          <span>© {new Date().getFullYear()} MoviezWiki. All rights reserved.</span>
          <span className="text-neutral-400">Powered by TMDB & Gemini AI</span>
        </div>
      </div>

      {/* Right Column - Form Side */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center px-6 sm:px-12 md:px-20 py-12 bg-[#121212] relative overflow-y-auto">
        <div className="w-full max-w-md space-y-8 my-auto">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-3xl font-black text-[#F5C518] tracking-wider">
              <span>🎬</span> MoviezWiki
            </Link>
          </div>

          <div className="space-y-2 text-left">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Welcome Back</h2>
            <p className="text-sm text-neutral-400">
              Please enter your login details to access your account and wishlist.
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

          <form onSubmit={handleLogin} className="space-y-5">
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
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-[#F5C518] hover:text-amber-400 font-semibold hover:underline transition-colors">
                  Forgot password?
                </Link>
              </div>
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
                  placeholder="Enter your password"
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
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-neutral-900 border-neutral-700 text-[#F5C518] focus:ring-[#F5C518] focus:ring-offset-black transition-colors cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 text-xs font-medium text-neutral-400 cursor-pointer select-none">
                Remember me on this device
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#F5C518] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-black font-black py-3.5 px-4 rounded-xl shadow-[0_4px_20px_rgba(245,197,24,0.25)] hover:shadow-[0_6px_25px_rgba(245,197,24,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 mt-4 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2.5"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In to Your Account ➔</span>
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
            <span>Sign In with Google</span>
          </button>

          <div className="pt-6 mt-6 border-t border-neutral-800/80 text-center">
            <p className="text-neutral-400 text-sm">
              Don't have an account yet?{" "}
              <Link href="/register" className="text-[#F5C518] hover:text-amber-400 hover:underline font-bold transition-colors ml-1">
                Create Account
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