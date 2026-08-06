import Link from "next/link";
import { searchTMDB } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q;
  const query = typeof q === 'string' ? q : '';
  
  let results: any[] = [];
  if (query) {
    try {
      const data = await searchTMDB(query);
      if (data && Array.isArray(data.results)) {
        results = data.results.filter((item: any) => 
          item.media_type === 'movie' || item.media_type === 'tv' || !item.media_type
        );
      }
    } catch (err) {
      console.error("Search page exception:", err);
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans">
      

      <main className="max-w-[1400px] mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">
          Search Results for <span className="text-[#F5C518]">"{query}"</span>
        </h1>
        
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((item: any) => (
              <MovieCard key={item.id} movie={item} />
            ))}
          </div>
        ) : (
          <div className="text-center text-neutral-400 py-20">
            <p className="text-xl">No movies or TV shows found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
}