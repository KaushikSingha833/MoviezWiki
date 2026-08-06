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
    <div className="min-h-screen bg-[#0f0f12] text-white font-sans overflow-x-hidden">
      {/* Background Banner */}
      <div className="relative w-full h-[70vh] md:h-[80vh] bg-black overflow-hidden">
        {backdropPath && (
          <img
            src={backdropPath}
            alt={movie.title || movie.name}
            className="w-full h-full object-cover opacity-35 filter blur-sm contrast-110 scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f12] via-[#0f0f12]/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />

        <div className="absolute top-6 left-6 z-30">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-700 font-bold px-4 py-2 rounded-full text-xs sm:text-sm backdrop-blur-md transition-all"
          >
            ← Back to Catalog
          </Link>
        </div>
      </div>

      {/* Main Details Overlay */}
      <div className="max-w-[1400px] mx-auto px-6 -mt-96 md:-mt-80 relative z-20 pb-24">
        <div className="bg-gradient-to-br from-[#181820] to-[#121217] rounded-3xl p-6 sm:p-12 border border-neutral-800 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Left Poster */}
          <div className="md:col-span-4 lg:col-span-3">
            {posterPath ? (
              <img
                src={posterPath}
                alt={movie.title || movie.name}
                className="w-full h-auto rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-neutral-700/80 object-cover aspect-[2/3]"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-neutral-900 rounded-2xl border border-neutral-800 flex items-center justify-center text-neutral-500 font-bold">
                No Poster Available
              </div>
            )}

            {movie.vote_average && (
              <div className="mt-4 p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between shadow">
                <span className="text-xs uppercase font-extrabold tracking-wider text-neutral-400">TMDB Rating</span>
                <div className="text-xl font-black text-[#F5C518]">
                  ★ {Number(movie.vote_average).toFixed(1)} <span className="text-xs text-neutral-500 font-normal">/ 10</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Detailed Specifications */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                {movie.release_date || movie.first_air_date ? (
                  <span className="px-3 py-1 rounded bg-neutral-800 text-neutral-300 font-extrabold text-xs border border-neutral-700">
                    {(movie.release_date || movie.first_air_date).split("-")[0]}
                  </span>
                ) : null}
                {movie.status && (
                  <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/30">
                    {movie.status}
                  </span>
                )}
                {movie.runtime && (
                  <span className="text-neutral-400 text-xs font-semibold">
                    ⏱️ {movie.runtime} mins
                  </span>
                )}
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-lg mb-3">
                {movie.title || movie.name}
              </h1>

              {movie.tagline && (
                <p className="text-lg text-[#F5C518] italic font-medium mb-4">
                  "{movie.tagline}"
                </p>
              )}

              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 my-4">
                  {genres.map((g: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-neutral-900 text-[#F5C518] border border-[#F5C518]/30 shadow"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F5C518] mr-2"></span>
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-neutral-800/80 pt-6 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-400">Plot Overview</h3>
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-4xl font-light">
                {movie.overview || "No extended plot summary available for this title."}
              </p>
            </div>

            <div className="pt-4">
              <HeroButtons movie={movie} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-neutral-800/80 text-sm">
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-neutral-500 font-bold">Language</span>
                <span className="text-white font-bold uppercase">{movie.original_language || "EN"}</span>
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-neutral-500 font-bold">Release Date</span>
                <span className="text-white font-bold">{movie.release_date || movie.first_air_date || "TBA"}</span>
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-neutral-500 font-bold">Popularity Score</span>
                <span className="text-white font-bold">{Math.round(movie.popularity || 0).toLocaleString()}</span>
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-neutral-500 font-bold">Vote Count</span>
                <span className="text-white font-bold">{(movie.vote_count || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
