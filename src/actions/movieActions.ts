"use server";

import { fetchTMDB } from "@/lib/tmdb";

export async function getMoviesByCountry(countryCode: string) {
  try {
    const data = await fetchTMDB(`/discover/movie`, `&with_origin_country=${countryCode}&sort_by=popularity.desc`);
    return data.results?.slice(0, 10) || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPersonDetails(personId: number) {
  try {
    return await fetchTMDB(`/person/${personId}`, `&append_to_response=combined_credits`);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getMovieTrailer(id: number, type: "movie" | "tv" = "movie") {
  try {
    const data = await fetchTMDB(`/${type}/${id}/videos`);
    
    if (!data.results || data.results.length === 0) return null;

    const youtubeVideos = data.results.filter((vid: any) => vid.site === "YouTube");
    
    const trailer = youtubeVideos.find((vid: any) => vid.type === "Trailer");
    const teaser = youtubeVideos.find((vid: any) => vid.type === "Teaser");
    
    const finalVideo = trailer || teaser || youtubeVideos[0];
    
    return finalVideo ? finalVideo.key : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getTVDetails(tvId: number) {
  try {
    return await fetchTMDB(`/tv/${tvId}`);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getTVSeasonTrailer(tvId: number, seasonNumber: number) {
  try {
    const data = await fetchTMDB(`/tv/${tvId}/season/${seasonNumber}/videos`);
    
    if (!data.results || data.results.length === 0) return null;

    const youtubeVideos = data.results.filter((vid: any) => vid.site === "YouTube");
    
    const trailer = youtubeVideos.find((vid: any) => vid.type === "Trailer");
    const teaser = youtubeVideos.find((vid: any) => vid.type === "Teaser");
    
    const finalVideo = trailer || teaser || youtubeVideos[0];
    
    return finalVideo ? finalVideo.key : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getStreamingProviders(id: number, type: "movie" | "tv" = "movie") {
  try {
    const data = await fetchTMDB(`/${type}/${id}/watch/providers`);
    
    if (!data || !data.results || Object.keys(data.results).length === 0) return null;

    const regionData = data.results.US || Object.values(data.results)[0];
    if (!regionData) return null;

    const flatrate = regionData.flatrate || [];
    const free = regionData.free || [];
    
    const combined = [...flatrate, ...free];
    const uniqueProviders = Array.from(new Map(combined.map((item: any) => [item.provider_id, item])).values());
    
    return uniqueProviders.length > 0 ? { providers: uniqueProviders, watchLink: regionData.link } : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getMediaCredits(id: number, type: "movie" | "tv" = "movie") {
  try {
    const data = await fetchTMDB(`/${type}/${id}/credits`);
    return data.cast || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getMediaReviews(id: number | string, type: "movie" | "tv" = "movie") {
  try {
    const data = await fetchTMDB(`/${type}/${id}/reviews`);
    return data.results || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getSimilarMedia(id: number | string, type: "movie" | "tv" = "movie", page: number = 1) {
  try {
    // 1. First attempt to fetch high-quality community recommendations
    let data = await fetchTMDB(`/${type}/${id}/recommendations`, `&page=${page}`);
    let results = data.results || [];

    // 2. Fallback to basic keyword similarities if no recommendations exist
    if (results.length === 0) {
      data = await fetchTMDB(`/${type}/${id}/similar`, `&page=${page}`);
      results = data.results || [];
    }
    
    // Inject the media_type into each item if missing
    const processed = results.map((item: any) => ({
      ...item,
      media_type: type
    }));
    
    return processed;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getSearchSuggestions(query: string) {
  if (!query) return [];
  try {
    const data = await fetchTMDB(`/search/multi`, `&query=${encodeURIComponent(query)}`);
    return data.results?.slice(0, 5) || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function loadMoreSearchResults(params: { q?: string, genres?: string, region?: string, isAi?: boolean, page: number }) {
  try {
    let data;
    if (params.isAi) {
      // AI search returns a specific list of titles, pagination is not natively supported without another AI query.
      return []; 
    } else if (params.q) {
      // searchTMDB now supports page
      const { searchTMDB } = await import("@/lib/tmdb");
      data = await searchTMDB(params.q, params.page);
    } else if (params.genres || params.region) {
      const { discoverTMDBAdvanced } = await import("@/lib/tmdb");
      data = await discoverTMDBAdvanced(params.genres, params.region, params.page);
    }
    
    if (data && Array.isArray(data.results)) {
      return data.results;
    }
    return [];
  } catch (error) {
    console.error("Error loading more search results:", error);
    return [];
  }
}