import Link from "next/link";
import { fetchTMDB } from "@/lib/tmdb";
import { getGenreNames } from "@/lib/genres";
import HeroButtons from "@/components/HeroButtons";

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  let movie: any = null;
  let error: string | null = null;

  try {
    movie = await fetchTMDB(`/movie/${id}`);
    if (!movie || movie.success === false || !movie.title) {
      // Fallback: try fetching as a TV show if movie endpoint did not find it
      const tv = await fetchTMDB(`/tv/${id}`);
      if (tv && tv.name) {
        movie = tv;
      } else {
        error = "Media title not found.";
      }
    }
  } catch (err: any) {
    error = "Could not load media details at this time.";
  }

  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
  const posterPath = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;
  const backdropPath = movie?.backdrop_path
    ? `${IMAGE_BASE_URL}${movie.backdrop_path}`
    : posterPath;

  const genres = movie?.genres
    ? movie.genres.map((g: any) => g.name)
    : movie?.genre_ids
    ? getGenreNames(movie.genre_ids)
    : [];

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <h1 className="text-4xl font-black mb-4 text-red-500">Notice</h1>
        <p className="text-lg text-neutral-300 max-w-md mb-8">{error || "Media not found."}</p>
        <Link
          href="/"
          className="bg-[#F5C518] hover:bg-yellow-400 text-black font-extrabold px-6 py-3 rounded-full transition-all"
        >
          ← Return to Home Page
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-[#F5C518] selection:text-black">
      {/* Background Banner */}
      <div className="relative w-full h-[75vh] md:h-[85vh] bg-black overflow-hidden group">
        {backdropPath && (
          <img
            src={backdropPath}
            alt={movie.title || movie.name}
            className="w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-[20s] ease-out"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />

        <div className="absolute top-8 left-8 z-30">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold px-5 py-2.5 rounded-full text-sm backdrop-blur-md transition-all hover:scale-105 shadow-lg"
          >
            ← Back to Catalog
          </Link>
        </div>
      </div>

      {/* Main Details Overlay */}
      <div className="max-w-[1400px] mx-auto px-6 -mt-[450px] md:-mt-[400px] relative z-20 pb-24 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="bg-black/60 backdrop-blur-2xl rounded-[2rem] p-6 sm:p-12 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start relative overflow-hidden">
          
          {/* Subtle Glow Behind Content */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F5C518] to-transparent opacity-50"></div>
          
          {/* Left Poster */}
          <div className="md:col-span-4 lg:col-span-3 relative group">
            {posterPath ? (
              <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 transform transition-transform duration-500 group-hover:scale-[1.02]">
                <img
                  src={posterPath}
                  alt={movie.title || movie.name}
                  className="w-full h-auto object-cover aspect-[2/3]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ) : (
              <div className="w-full aspect-[2/3] bg-neutral-900 rounded-2xl border border-neutral-800 flex items-center justify-center text-neutral-500 font-bold shadow-2xl">
                No Poster Available
              </div>
            )}

            {movie.vote_average && (
              <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between shadow-xl backdrop-blur-md">
                <span className="text-xs uppercase font-black tracking-widest text-neutral-400">TMDB Rating</span>
                <div className="text-2xl font-black text-[#F5C518] drop-shadow-[0_0_10px_rgba(245,197,24,0.3)]">
                  ★ {Number(movie.vote_average).toFixed(1)} <span className="text-sm text-neutral-500 font-bold">/ 10</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Detailed Specifications */}
          <div className="md:col-span-8 lg:col-span-9 space-y-8 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {movie.release_date || movie.first_air_date ? (
                  <span className="px-3 py-1 rounded-md bg-white/10 text-white font-black text-xs border border-white/5 shadow-sm backdrop-blur-sm">
                    {(movie.release_date || movie.first_air_date).split("-")[0]}
                  </span>
                ) : null}
                {movie.status && (
                  <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
                    {movie.status}
                  </span>
                )}
                {movie.runtime && (
                  <span className="text-neutral-400 text-xs font-bold uppercase tracking-wider">
                    ⏱️ {movie.runtime} mins
                  </span>
                )}
              </div>

              <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter drop-shadow-2xl mb-2">
                {movie.title || movie.name}
              </h1>

              {movie.tagline && (
                <p className="text-xl text-[#F5C518] italic font-semibold mb-6 opacity-90">
                  "{movie.tagline}"
                </p>
              )}

              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 my-6">
                  {genres.map((g: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#F5C518]/10 text-[#F5C518] border border-[#F5C518]/20 shadow-sm transition-colors hover:bg-[#F5C518]/20"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-8 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400">Plot Overview</h3>
              <p className="text-neutral-300 text-lg leading-relaxed max-w-4xl font-medium">
                {movie.overview || "No extended plot summary available for this title."}
              </p>
            </div>

            <div className="pt-6">
              <HeroButtons movie={movie} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/10 text-sm">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Language</span>
                <span className="text-white font-black uppercase text-lg">{movie.original_language || "EN"}</span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Release</span>
                <span className="text-white font-bold">{movie.release_date || movie.first_air_date || "TBA"}</span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Popularity</span>
                <span className="text-white font-bold">{Math.round(movie.popularity || 0).toLocaleString()}</span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Votes</span>
                <span className="text-white font-bold">{(movie.vote_count || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
