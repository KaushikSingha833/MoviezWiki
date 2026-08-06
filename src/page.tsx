import Link from "next/link";
import { getTrendingMovies, getPopularMovies, getTopRatedMovies, getPopularCelebrities } from "@/lib/tmdb";

export default async function HomePage() {
  const [trendingData, popularData, topRatedData, celebritiesData] = await Promise.all([
    getTrendingMovies(),
    getPopularMovies(),
    getTopRatedMovies(),
    getPopularCelebrities()
  ]);

  const trending = trendingData.results.slice(0, 10);
  const popular = popularData.results.slice(0, 10);
  const fanFavorites = topRatedData.results.slice(0, 10);
  const celebrities = celebritiesData.results.slice(0, 10);

  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans">
      <header className="flex items-center justify-between p-4 bg-[#181818] border-b border-neutral-800">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-black text-[#F5C518]">MoviezWiki</Link>
          <nav className="hidden md:flex space-x-6 font-semibold">
            <Link href="/" className="text-[#F5C518] border-b-2 border-[#F5C518] pb-1">Home</Link>
            <Link href="/wishlist" className="hover:text-neutral-300">Wishlist</Link>
            <Link href="/country" className="hover:text-neutral-300">By Country</Link>
            <Link href="/login" className="hover:text-neutral-300">Login</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for a movie..." 
              className="bg-neutral-800 text-white px-4 py-2 rounded-l-md focus:outline-none"
            />
            <button className="bg-[#F5C518] text-black px-4 py-2 rounded-r-md font-bold">Search</button>
          </div>
        </div>
      </header>

      <section className="relative h-[60vh] flex items-center justify-center bg-gradient-to-r from-red-900 to-black text-center">
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <h1 className="text-5xl font-bold tracking-wider">Welcome to MoviezWiki</h1>
          <p className="text-lg">Your ultimate destination for movies, TV shows, and more.</p>
          <button className="bg-[#F5C518] text-black font-bold py-3 px-8 rounded mt-4 hover:bg-yellow-500 transition">
            Explore Movies
          </button>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        <section>
          <h2 className="text-2xl font-bold mb-6">Top 10 Celebrities</h2>
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {celebrities.map((person: any) => (
              <div key={person.id} className="flex-shrink-0 flex flex-col items-center space-y-2">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent hover:border-[#F5C518] transition-all cursor-pointer">
                  <img 
                    src={person.profile_path ? `${IMAGE_BASE_URL}${person.profile_path}` : 'https://via.placeholder.com/150'} 
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-neutral-300 w-24 text-center truncate">{person.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Fan Favorites</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {fanFavorites.map((movie: any) => (
              <div key={movie.id} className="relative group rounded-lg overflow-hidden cursor-pointer bg-neutral-900">
                <img 
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`} 
                  alt={movie.title}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="font-bold text-white mb-2">{movie.title}</h3>
                  <div className="flex space-x-2">
                    <button className="bg-[#F5C518] text-black text-xs font-bold py-1 px-2 rounded w-full">Play Trailer</button>
                    <button className="bg-[#F5C518] text-black text-xs font-bold py-1 px-2 rounded w-full">AI Summary</button>
                  </div>
                </div>
                <button className="absolute top-2 right-2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white hover:text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Trending Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {trending.map((movie: any) => (
              <div key={movie.id} className="relative group rounded-lg overflow-hidden cursor-pointer">
                <img 
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`} 
                  alt={movie.title}
                  className="w-full h-auto object-cover"
                />
                <button className="absolute top-2 right-2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white hover:text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}