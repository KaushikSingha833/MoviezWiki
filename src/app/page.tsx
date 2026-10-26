import Link from "next/link";
import { cookies } from "next/headers";
import AnimatedHero from "@/components/AnimatedHero";
import CelebrityRow from "@/components/CelebrityRow";
import SectionReveal from "@/components/SectionReveal";
import { 
  getTrendingMovies, 
  getPopularMovies, 
  getTopRatedMovies, 
  getUpcomingMovies,
  getNowPlayingMovies,
  getPopularCelebrities,
  getTrendingTvShows,
  getPopularTvShows,
  getTrendingAnime,
  getKoreanDrama,
  getTrendingReality
} from "@/lib/tmdb";
import { getMediaCredits } from "@/actions/movieActions";
import LatestTrailers from "@/components/LatestTrailers";
import TopTenCarousel from "@/components/TopTenCarousel";
import MovieCarousel from "@/components/MovieCarousel";
import RecentlyWatchedRow from "@/components/RecentlyWatchedRow";
import CustomRecommendationsRow from "@/components/CustomRecommendationsRow";
import TasteRecommendationsRow from "@/components/TasteRecommendationsRow";
import CinematicSpotlight from "@/components/CinematicSpotlight";
import QuickVibeBar from "@/components/QuickVibeBar";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cookieStore = await cookies();
  const prefMode = cookieStore.get("preferenceMode")?.value || "global";
  const childMode = cookieStore.get("childMode")?.value === "true";
  const region = cookieStore.get("region")?.value || "IN";
  const isNational = prefMode === "national" && !childMode;
  
  const regionText = isNational ? region : "the World";

  const [
    trending, 
    popular, 
    topRated, 
    upcoming, 
    nowPlaying, 
    celebrities, 
    trendingTv,
    popularTv,
    anime,
    kDrama,
    reality
  ] = await Promise.all([
    getTrendingMovies(),
    getPopularMovies(),
    getTopRatedMovies(),
    getUpcomingMovies(),
    getNowPlayingMovies(),
    getPopularCelebrities(),
    getTrendingTvShows(),
    getPopularTvShows(),
    getTrendingAnime(),
    getKoreanDrama(),
    getTrendingReality()
  ]);

  let finalCelebrities = celebrities.results;

  if (isNational && trending.results && trending.results.length > 0) {
    try {
      const topMovies = trending.results.slice(0, 4);
      const castsArrays = await Promise.all(topMovies.map((m: any) => getMediaCredits(m.id, "movie")));
      const allCast: any[] = castsArrays.flat();
      const uniqueCast = Array.from(new Map(allCast.map((c: any) => [c.id, c])).values());
      const regionalCelebs = uniqueCast.sort((a: any, b: any) => b.popularity - a.popularity).slice(0, 20);
      
      if (regionalCelebs.length > 0) {
        finalCelebrities = regionalCelebs;
      }
    } catch(e) {
      console.error("Regional casting extraction failed:", e);
    }
  }

  let movieSectionsPart1 = [
    { title: `Now Playing in ${regionText}`, data: nowPlaying.results, id: "nowplaying" },
    { title: `Binge-Worthy TV Series in ${regionText}`, data: popularTv.results, id: "tvseries" },
    { title: `Trending Reality Shows in ${regionText}`, data: reality.results, id: "reality" },
  ];

  let movieSectionsPart2 = [
    { title: "Trending Japanese Anime", data: anime.results, id: "anime" },
    { title: "K-Dramas & Korean Cinema", data: kDrama.results, id: "kdrama" },
    { title: `Upcoming Cinematic Releases in ${regionText}`, data: upcoming.results, id: "upcoming" },
    { title: `Fan Favorites in ${regionText}`, data: topRated.results, id: "toprated" },
  ];

  if (childMode) {
    movieSectionsPart1 = [
      { title: "🌟 Magical Family Movies", data: popular.results, id: "nowplaying" },
      { title: "🎨 Amazing Animated Series", data: popularTv.results, id: "tvseries" },
      { title: "🪁 Fun Kids TV Adventures", data: reality.results, id: "reality" },
    ];
    movieSectionsPart2 = [
      { title: "🐼 Playful Cartoons", data: anime.results, id: "anime" },
      { title: "🎵 Bedtime Favorites", data: kDrama.results, id: "kdrama" },
      { title: "🎈 Coming Soon to Theaters!", data: upcoming.results, id: "upcoming" },
      { title: "🏆 Greatest Family Classics", data: topRated.results, id: "toprated" },
    ];
  }

  const topTenMovieTitle = childMode ? "Top 10 Kids Movies Right Now!" : `Top 10 Movies in ${regionText} Right Now`;
  const topTenTvTitle = childMode ? "Top 10 Cartoons Right Now!" : `Top 10 TV Shows in ${regionText} Right Now`;

  // Select top spotlight feature
  const spotlightMovie = topRated.results?.[0] || upcoming.results?.[0] || trending.results?.[0];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-[#F5C518] selection:text-black">
      
      <AnimatedHero 
        movies={trending.results.slice(0, 5)} 
        badgeText={childMode ? "Top Kids Movie" : isNational ? `Trending in ${region}` : "Trending Worldwide"}
      />

      <QuickVibeBar />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-12 md:space-y-16 overflow-x-clip">
        
        <div id="highlights" className="space-y-12">
          <RecentlyWatchedRow />
          <CustomRecommendationsRow />
          <TasteRecommendationsRow />
        </div>
        
        <div id="celebrities">
          <CelebrityRow 
            title={`Top Icons in ${regionText}`} 
            celebrities={finalCelebrities} 
          />
        </div>

        <SectionReveal>
          <section id="trailers">
            <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-[#F5C518] to-amber-600 shadow-[0_0_12px_rgba(245,197,24,0.6)]" />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                  Latest Trailers & Clips
                </h2>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-neutral-300 bg-white/5 border border-white/10 backdrop-blur-md">
                🎬 Official Releases
              </span>
            </div>
            <LatestTrailers movies={upcoming.results.slice(0, 5)} />
          </section>
        </SectionReveal>

        <SectionReveal>
          <div id="top10" className="py-8 md:py-10 px-2 sm:px-4 bg-gradient-to-b from-white/[0.04] via-black/40 to-black/60 rounded-3xl border border-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
            <TopTenCarousel 
              title={topTenMovieTitle} 
              items={trending.results} 
              type="movie" 
            />
            <TopTenCarousel 
              title={topTenTvTitle} 
              items={trendingTv.results} 
              type="tv" 
            />
          </div>
        </SectionReveal>

        {/* First Half of Movie Sections */}
        {movieSectionsPart1.map((section, index) => (
          <SectionReveal key={`part1-${index}`}>
            <div id={section.id}>
              <MovieCarousel title={section.title} movies={section.data} />
            </div>
          </SectionReveal>
        ))}

        {/* 16:9 IMAX Cinematic Spotlight Showcase Banner */}
        {spotlightMovie && (
          <SectionReveal>
            <CinematicSpotlight 
              movie={spotlightMovie} 
              spotlightBadge={childMode ? "🌟 Family Choice Premiere" : "✨ IMAX Spotlight Premiere"}
            />
          </SectionReveal>
        )}

        {/* Second Half of Movie Sections */}
        {movieSectionsPart2.map((section, index) => (
          <SectionReveal key={`part2-${index}`}>
            <div id={section.id}>
              <MovieCarousel title={section.title} movies={section.data} />
            </div>
          </SectionReveal>
        ))}

      </main>
    </div>
  );
}