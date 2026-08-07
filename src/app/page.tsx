import Link from "next/link";
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
  getKoreanDrama
} from "@/lib/tmdb";
import LatestTrailers from "@/components/LatestTrailers";
import TopTenCarousel from "@/components/TopTenCarousel";
import MovieCarousel from "@/components/MovieCarousel";

export default async function HomePage() {
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
    kDrama
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
    getKoreanDrama()
  ]);

  const movieSections = [
    { title: "Now Playing in Theaters", data: nowPlaying.results },
    { title: "Binge-Worthy TV Series", data: popularTv.results },
    { title: "Trending Japanese Anime", data: anime.results },
    { title: "K-Dramas & Korean Cinema", data: kDrama.results },
    { title: "Upcoming Cinematic Releases", data: upcoming.results },
    { title: "Global Fan Favorites", data: topRated.results },
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans overflow-x-hidden">
      
      <AnimatedHero movies={trending.results.slice(0, 5)} />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 md:space-y-16 overflow-hidden">
        
        <CelebrityRow celebrities={celebrities.results} />

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
              title="Top 10 Movies in the World Right Now" 
              items={trending.results} 
              type="movie" 
            />
            <TopTenCarousel 
              title="Top 10 TV Shows in the World Right Now" 
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