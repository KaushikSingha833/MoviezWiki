const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Fallback metadata for classic movies in case of network disconnect or DNS/IPv6 issues with TMDB API
const DEMO_FALLBACKS: Record<string, any> = {
  inception: [
    {
      id: 27205,
      title: "Inception",
      media_type: "movie",
      poster_path: "/l96HmbdFQhL1TqQf5JAnpDfaA0.jpg",
      genre_ids: [28, 878, 12],
      overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\", the implantation of another person's idea into a target's subconscious.",
      release_date: "2010-07-15",
      vote_average: 8.4
    }
  ],
  "the dark knight": [
    {
      id: 155,
      title: "The Dark Knight",
      media_type: "movie",
      poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      genre_ids: [18, 28, 80, 53],
      overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining crime organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
      release_date: "2008-07-16",
      vote_average: 8.5
    }
  ],
  interstellar: [
    {
      id: 157336,
      title: "Interstellar",
      media_type: "movie",
      poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      genre_ids: [12, 18, 878],
      overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
      release_date: "2014-11-05",
      vote_average: 8.4
    }
  ],
  "spirited away": [
    {
      id: 129,
      title: "Spirited Away",
      media_type: "movie",
      poster_path: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
      genre_ids: [16, 10751, 14],
      overview: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
      release_date: "2001-07-20",
      vote_average: 8.5
    }
  ]
};

export async function fetchTMDB(endpoint: string, extraParams: string = '') {
  const apiKey = process.env.TMDB_API_KEY || "fallback_key";
  const url = `${TMDB_BASE_URL}${endpoint}?api_key=${apiKey}&language=en-US&page=1${extraParams}`;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 3600 },
        headers: { 'Accept': 'application/json' }
      });
      
      if (!res.ok) {
        throw new Error(`TMDB HTTP error ${res.status}`);
      }
      
      return await res.json();
    } catch (error) {
      console.warn(`[TMDB] Fetch attempt ${attempt} failed for ${endpoint}:`, error);
      if (attempt === 2) {
        return { results: [], error: "fetch_failed" };
      }
      await new Promise(r => setTimeout(r, 200));
    }
  }
  return { results: [] };
}

export const getTrendingMovies = () => fetchTMDB('/trending/movie/day');
export const getPopularMovies = () => fetchTMDB('/movie/popular');
export const getTopRatedMovies = () => fetchTMDB('/movie/top_rated');
export const getUpcomingMovies = () => fetchTMDB('/movie/upcoming');
export const getNowPlayingMovies = () => fetchTMDB('/movie/now_playing');
export const getPopularCelebrities = () => fetchTMDB('/person/popular');
export const getTrendingTvShows = () => fetchTMDB('/trending/tv/day');
export const getPopularTvShows = () => fetchTMDB('/tv/popular');
export const getTrendingAnime = () => fetchTMDB('/discover/tv', '&with_genres=16&with_original_language=ja&sort_by=popularity.desc');
export const getKoreanDrama = () => fetchTMDB('/discover/tv', '&with_original_language=ko&sort_by=popularity.desc');

export const searchTMDB = async (query: string) => {
  const data = await fetchTMDB('/search/multi', `&query=${encodeURIComponent(query)}`);
  
  if (!data.results || data.results.length === 0) {
    const cleanQuery = query.trim().toLowerCase();
    if (DEMO_FALLBACKS[cleanQuery]) {
      return { results: DEMO_FALLBACKS[cleanQuery] };
    }
    for (const [key, movies] of Object.entries(DEMO_FALLBACKS)) {
      if (cleanQuery.includes(key) || key.includes(cleanQuery)) {
        return { results: movies };
      }
    }
  }
  
  return data;
};

export const discoverTMDBAdvanced = async (genres?: string, region?: string) => {
  let params = "&sort_by=popularity.desc";
  if (genres) {
    params += `&with_genres=${genres}`;
  }
  
  if (region === "hollywood") {
    params += "&with_origin_country=US&with_original_language=en";
  } else if (region === "bollywood") {
    params += "&with_origin_country=IN&with_original_language=hi";
  } else if (region === "tollywood") {
    params += "&with_origin_country=IN&with_original_language=te";
  } else if (region === "korean") {
    params += "&with_origin_country=KR&with_original_language=ko";
  } else if (region === "anime") {
    if (!genres || !genres.includes("16")) params += "&with_genres=16"; // Anime is animation
    params += "&with_original_language=ja";
  }

  return fetchTMDB('/discover/movie', params);
};