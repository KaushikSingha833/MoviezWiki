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
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cookieStore = await cookies();
  const prefMode = cookieStore.get("preferenceMode")?.value || "global";
  const childMode = cookieStore.get("childMode")?.value === "true";
  const region = cookieStore.get("region")?.value || "US";
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

  let movieSections = [
    { title: `Now Playing in ${regionText}`, data: nowPlaying.results },
    { title: `Binge-Worthy TV Series in ${regionText}`, data: popularTv.results },
    { title: `Trending Reality Shows in ${regionText}`, data: reality.results },
    { title: "Trending Japanese Anime", data: anime.results },
    { title: "K-Dramas & Korean Cinema", data: kDrama.results },
    { title: `Upcoming Cinematic Releases in ${regionText}`, data: upcoming.results },
    { title: `Fan Favorites in ${regionText}`, data: topRated.results },
  ];

  if (childMode) {
    movieSections = [
      { title: "🌟 Magical Family Movies", data: popular.results },
      { title: "🎨 Amazing Animated Series", data: popularTv.results },
      { title: "🪁 Fun Kids TV Adventures", data: reality.results },
      { title: "🐼 Playful Cartoons", data: anime.results },
      { title: "🎵 Bedtime Favorites", data: kDrama.results },
      { title: "🎈 Coming Soon to Theaters!", data: upcoming.results },
      { title: "🏆 Greatest Family Classics", data: topRated.results },
    ];
  }

  const topTenMovieTitle = childMode ? "Top 10 Kids Movies Right Now!" : `Top 10 Movies in ${regionText} Right Now`;
  const topTenTvTitle = childMode ? "Top 10 Cartoons Right Now!" : `Top 10 TV Shows in ${regionText} Right Now`;

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans overflow-x-hidden">
      
      <AnimatedHero 
        movies={trending.results.slice(0, 5)} 
        badgeText={childMode ? "Top Kids Movie" : isNational ? `Trending in ${region}` : "Trending Worldwide"}
      />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 md:space-y-16 overflow-hidden">
        
        <RecentlyWatchedRow />
        
        <CelebrityRow 
          title={`Top Icons in ${regionText}`} 
          celebrities={finalCelebrities} 
        />

        <SectionReveal>
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center border-l-4 border-[#F5C518] pl-3">
              Latest Trailers & Clips
            </h2>
            <LatestTrailers movies={upcoming.results.slice(0, 5)} />
          </section>
        </SectionReveal>

        <SectionReveal>
          <div className="py-8 bg-black/30 rounded-2xl border border-neutral-900/50">
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

        {movieSections.map((section, index) => (
          <SectionReveal key={index}>
            <MovieCarousel title={section.title} movies={section.data} />
          </SectionReveal>
        ))}

      </main>
    </div>
  );
}