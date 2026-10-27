import Link from "next/link";
import { fetchTMDB } from "@/lib/tmdb";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import WatchTracker from "@/components/WatchTracker";

export default async function WatchMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  let movie: any = null;
  try {
    movie = await fetchTMDB(`/movie/${id}`);
  } catch (err) {
    console.error(err);
  }

  const title = movie?.title || "Movie";

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden flex flex-col relative">
      {movie && (
        <WatchTracker 
          media={{
            id: movie.id,
            title: title,
            type: "movie",
            poster_path: movie.poster_path,
            backdrop_path: movie.backdrop_path
          }} 
        />
      )}
      
      {/* Cinematic Ambient Background */}
      {movie?.backdrop_path && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt="Backdrop"
            className="w-full h-full object-cover opacity-10 filter blur-2xl scale-110"
          />
        </div>
      )}

      {/* Cinematic Header */}
      <header className="p-4 sm:p-6 flex items-center justify-between z-10 w-full pointer-events-none">
        <Link 
          href={`/movies/${id}`} 
          className="inline-flex items-center gap-2 bg-white/5 hover:bg-[#F5C518] hover:text-black text-white font-bold px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm backdrop-blur-xl transition-all pointer-events-auto border border-white/10 shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Details</span>
        </Link>

        <div className="hidden md:flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h1 className="text-base sm:text-lg font-black text-neutral-300 drop-shadow-md">
            Now Streaming: <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-[#F5C518]">{title}</span>
          </h1>
          {movie?.release_date && (
            <span className="text-xs text-neutral-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
              {movie.release_date.substring(0, 4)}
            </span>
          )}
        </div>

        <div className="w-24 hidden md:block"></div>
      </header>

      {/* Video Player Container */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[1600px] mx-auto px-4 md:px-12 pb-12 z-10">
        <VideoPlayer tmdbId={id} type="movie" />

        {/* Ad-Blocker Disclaimer */}
        <div className="mt-8 w-full max-w-4xl bg-gradient-to-r from-amber-500/10 via-neutral-950 to-black border border-amber-500/20 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start gap-4 text-xs sm:text-sm text-neutral-400 backdrop-blur-2xl shadow-xl">
          <div className="p-3 bg-amber-500/10 rounded-2xl text-[#F5C518] shrink-0 border border-amber-500/30 shadow-inner">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <strong className="text-white text-sm sm:text-base font-bold">Uninterrupted Cinema Experience</strong>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30">Recommended</span>
            </div>
            <p className="leading-relaxed text-neutral-300 text-xs sm:text-sm">
              Third-party streaming network servers may show external popups. For zero ads and maximum quality, we strongly recommend browsing with an <strong className="text-[#F5C518]">Ad-Blocker (uBlock Origin)</strong> or using the <strong className="text-[#F5C518]">Brave Browser</strong>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
