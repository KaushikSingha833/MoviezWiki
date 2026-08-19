import Link from "next/link";
import { fetchTMDB } from "@/lib/tmdb";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";

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
          className="inline-flex items-center gap-2 bg-neutral-900/80 hover:bg-neutral-800 text-white font-bold px-4 py-2 rounded-full text-xs sm:text-sm backdrop-blur-md transition-all pointer-events-auto border border-neutral-800 shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Details</span>
        </Link>
        <h1 className="text-lg sm:text-xl font-black text-neutral-300 hidden md:block drop-shadow-md">
          Now Playing: <span className="text-white">{title}</span>
        </h1>
        <div className="w-24 hidden md:block"></div>
      </header>

      {/* Video Player Container */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[1600px] mx-auto px-4 md:px-12 pb-12 z-10">
        <VideoPlayer tmdbId={id} type="movie" />

        {/* Ad-Blocker Disclaimer */}
        <div className="mt-6 sm:mt-8 w-full max-w-4xl bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4 text-xs sm:text-sm text-neutral-400 backdrop-blur-sm">
          <div className="p-2.5 bg-black rounded-lg text-[#F5C518] shrink-0 border border-neutral-800 shadow-inner">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-white block mb-1 text-sm">Third-Party Source Disclaimer</strong>
            <p className="leading-relaxed">
              This video player is provided by an external streaming network. MoviezWiki has no control over the popups or advertisements shown within the player. For an uninterrupted cinematic experience, we strongly recommend using an <strong className="text-[#F5C518]">Ad-Blocker (like uBlock Origin)</strong> or the <strong className="text-[#F5C518]">Brave Browser</strong>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
