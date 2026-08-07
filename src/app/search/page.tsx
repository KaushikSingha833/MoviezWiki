import Link from "next/link";
import { searchTMDB, discoverTMDBAdvanced } from "@/lib/tmdb";
import { Search, Compass } from "lucide-react";
import SearchClientGrid from "@/components/SearchClientGrid";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
  const genres = typeof resolvedParams.genres === 'string' ? resolvedParams.genres : '';
  const region = typeof resolvedParams.region === 'string' ? resolvedParams.region : '';
  
  let results: any[] = [];
  try {
    let data;
    if (q) {
      data = await searchTMDB(q);
    } else if (genres || region) {
      data = await discoverTMDBAdvanced(genres, region);
    }
    
    if (data && Array.isArray(data.results)) {
      let processedData: any[] = [];
      data.results.forEach((item: any) => {
        if (item.media_type === 'person') {
          if (Array.isArray(item.known_for)) {
            processedData.push(...item.known_for);
          }
        } else {
          processedData.push(item);
        }
      });
      
      const uniqueIds = new Set();
      results = processedData.filter(i => {
        if (!i.id) return false;
        if (uniqueIds.has(i.id)) return false;
        uniqueIds.add(i.id);
        return true;
      });
    }
  } catch (err) {
    console.error("Search page exception:", err);
  }

  const initialGenres = genres ? genres.split(',').map(Number) : [];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans overflow-x-hidden">
      
      {/* Premium Data-Panel Header */}
      <header className="relative w-full pt-32 pb-16 px-6 lg:px-12 border-b border-neutral-900 overflow-hidden">
        <div className="absolute top-0 right-[20%] w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-[10%] w-[30rem] h-[30rem] bg-[#F5C518]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-md">
              {q ? <Search className="w-4 h-4 text-indigo-400" /> : <Compass className="w-4 h-4 text-[#F5C518]" />}
              <span className="text-xs font-bold tracking-widest uppercase text-neutral-300">
                {q ? "Database Query" : "Discovery Engine"}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white mb-2 leading-tight">
              {q ? (
                <>Results for <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C518] to-yellow-500">"{q}"</span></>
              ) : (
                <>Curated <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C518] to-yellow-500">Discovery Matches</span></>
              )}
            </h1>
          </div>
          
          <div className="flex flex-col items-start md:items-end p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md min-w-[220px] shadow-2xl">
            <span className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-1">
              Data Mapped
            </span>
            <div className="flex items-baseline gap-2">
               <span className="text-5xl font-black text-white">{results.length}</span>
               <span className="text-sm font-bold text-[#F5C518]">ENTRIES</span>
            </div>
          </div>
        </div>
      </header>

      {/* Grid Execution */}
      <main className="max-w-[1400px] mx-auto px-6 py-12 md:py-20 min-h-[60vh]">
        <SearchClientGrid 
          results={results} 
          query={q || "Advanced Search"} 
          initialGenres={initialGenres} 
        />
      </main>

    </div>
  );
}