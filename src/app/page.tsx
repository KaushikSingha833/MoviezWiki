import Link from "next/link";
import HeroButtons from "@/components/HeroButtons";
import { getGenreNames } from "@/lib/genres";
import { 
  getTrendingMovies, 
  getPopularMovies, 
  getTopRatedMovies, 
  getUpcomingMovies,
  getNowPlayingMovies,
  getPopularCelebrities,
  getTrendingTvShows
} from "@/lib/tmdb";
import LatestTrailers from "@/components/LatestTrailers";
import TopTenCarousel from "@/components/TopTenCarousel";
import MovieCarousel from "@/components/MovieCarousel";

export default async function HomePage() {
  const [trending, popular, topRated, upcoming, nowPlaying, celebrities, trendingTv] = await Promise.all([
    getTrendingMovies(),
    getPopularMovies(),
    getTopRatedMovies(),
    getUpcomingMovies(),
    getNowPlayingMovies(),
    getPopularCelebrities(),
    getTrendingTvShows()
  ]);

  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
  const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";
  const heroMovie = trending.results[0];

  const movieSections = [
    { title: "Now Playing in Theaters", data: nowPlaying.results },
    { title: "Fan Favorites (Top Rated)", data: topRated.results },
    { title: "Upcoming Releases", data: upcoming.results },
    { title: "Popular Right Now", data: popular.results },
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans overflow-x-hidden">
      
      <section className="relative h-[85vh] flex items-center justify-start text-left border-b border-neutral-800">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BACKDROP_BASE_URL}${heroMovie?.backdrop_path})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/80 to-transparent"></div>

        <div className="relative z-10 flex flex-col items-start space-y-4 px-6 md:px-16 max-w-3xl mt-20">
          <h1 className="text-5xl md:text-7xl font-black tracking-wide text-white drop-shadow-2xl">
            {heroMovie?.title || heroMovie?.name || "Welcome to MoviezWiki"}
          </h1>
          
          {heroMovie?.genre_ids && (
            <div className="flex flex-wrap gap-2 pt-1">
              {getGenreNames(heroMovie.genre_ids).map((genre, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-bold bg-neutral-900/80 text-[#F5C518] border border-[#F5C518]/30 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#F5C518]"
                >
                  <span className="w-2 h-2 rounded-full bg-[#F5C518] mr-2 animate-pulse"></span>
                  {genre}
                </span>
              ))}
            </div>
          )}

          <p className="text-lg md:text-xl text-neutral-300 max-w-2xl line-clamp-3 drop-shadow-md">
            {heroMovie?.overview}
          </p>
          
          <HeroButtons movie={heroMovie} />
          
        </div>
      </section>

      <main className="max-w-[1400px] mx-auto px-6 py-12 space-y-16 overflow-hidden">
        
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center border-l-4 border-[#F5C518] pl-3">
            Top 10 Celebrities
          </h2>
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {celebrities.results.slice(0, 10).map((person: any) => (
              <div key={person.id} className="flex-shrink-0 snap-start flex flex-col items-center space-y-3 group cursor-pointer">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#F5C518] transition-all duration-300 shadow-lg">
                  <img 
                    src={person.profile_path ? `${IMAGE_BASE_URL}${person.profile_path}` : 'https://via.placeholder.com/150'} 
                    alt={person.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-sm font-semibold text-neutral-300 w-24 text-center truncate group-hover:text-white transition-colors">
                  {person.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center border-l-4 border-[#F5C518] pl-3">
            Latest Trailers & Clips
          </h2>
          <LatestTrailers movies={upcoming.results.slice(0, 5)} />
        </section>

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

        {movieSections.map((section, index) => (
          <MovieCarousel key={index} title={section.title} movies={section.data} />
        ))}

      </main>
    </div>
  );
}