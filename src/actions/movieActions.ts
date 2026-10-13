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

const LANGUAGE_META: Record<string, { name: string; nativeName: string; flag: string }> = {
  en: { name: "English", nativeName: "English", flag: "🇺🇸" },
  hi: { name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  es: { name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  fr: { name: "French", nativeName: "Français", flag: "🇫🇷" },
  de: { name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  ja: { name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  ko: { name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  it: { name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  pt: { name: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
  ru: { name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  zh: { name: "Mandarin Chinese", nativeName: "中文", flag: "🇨🇳" },
  ta: { name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  te: { name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  ml: { name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  kn: { name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  bn: { name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  tr: { name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  ar: { name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  pl: { name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  nl: { name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  sv: { name: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
  th: { name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  id: { name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  vi: { name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  uk: { name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦" },
  el: { name: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷" },
  he: { name: "Hebrew", nativeName: "עברית", flag: "🇮🇱" },
  da: { name: "Danish", nativeName: "Dansk", flag: "🇩🇰" },
  fi: { name: "Finnish", nativeName: "Suomi", flag: "🇫🇮" },
  no: { name: "Norwegian", nativeName: "Norsk", flag: "🇳🇴" },
  cs: { name: "Czech", nativeName: "Čeština", flag: "🇨🇿" },
  hu: { name: "Hungarian", nativeName: "Magyar", flag: "🇭🇺" },
  ro: { name: "Romanian", nativeName: "Română", flag: "🇷🇴" },
};

export async function getMediaAudioLanguages(id: number | string, type: "movie" | "tv" = "movie") {
  try {
    const [details, translationsData] = await Promise.all([
      fetchTMDB(`/${type}/${id}`).catch(() => null),
      fetchTMDB(`/${type}/${id}/translations`).catch(() => null)
    ]);

    const origCode = details?.original_language || "en";
    const origMeta = LANGUAGE_META[origCode] || {
      name: details?.spoken_languages?.find((s: any) => s.iso_639_1 === origCode)?.english_name || origCode.toUpperCase(),
      nativeName: origCode.toUpperCase(),
      flag: "🌐"
    };

    const originalLanguage = {
      code: origCode,
      name: origMeta.name,
      nativeName: origMeta.nativeName,
      flag: origMeta.flag,
      isOriginal: true
    };

    // Extract unique dubbed languages from translations
    const seenCodes = new Set<string>([origCode]);
    const streamingDubs: Array<{ code: string; name: string; nativeName: string; flag: string }> = [];

    if (translationsData?.translations && Array.isArray(translationsData.translations)) {
      for (const t of translationsData.translations) {
        const code = t.iso_639_1;
        if (!code || seenCodes.has(code)) continue;

        seenCodes.add(code);
        const meta = LANGUAGE_META[code] || {
          name: t.english_name || code.toUpperCase(),
          nativeName: t.name || t.english_name || code.toUpperCase(),
          flag: "🌐"
        };

        streamingDubs.push({
          code,
          name: meta.name,
          nativeName: meta.nativeName,
          flag: meta.flag
        });
      }
    }

    // Sort dubs: popular languages first, then alphabetically
    const priorityCodes = ["hi", "es", "fr", "de", "ja", "ko", "pt", "it", "ru", "te", "ta", "zh", "tr", "ar"];
    streamingDubs.sort((a, b) => {
      const idxA = priorityCodes.indexOf(a.code);
      const idxB = priorityCodes.indexOf(b.code);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.name.localeCompare(b.name);
    });

    // Separate into popular high-demand dubs vs extended regional dubs
    const popularDubs = streamingDubs.filter(d => priorityCodes.includes(d.code));
    const otherDubs = streamingDubs.filter(d => !priorityCodes.includes(d.code));

    // Determine MoviezWiki player audio tracks
    const moviezWikiTracks: Array<{ label: string; language: string; flag: string; badge: string; note: string }> = [];

    // 1. Primary Original Track
    moviezWikiTracks.push({
      label: "Original Audio",
      language: originalLanguage.name,
      flag: originalLanguage.flag,
      badge: "Server 1 - 5",
      note: "Default voice track on all servers"
    });

    // 2. Dubbed tracks available on multi-audio servers
    if (origCode !== "en") {
      moviezWikiTracks.push({
        label: "English Dub",
        language: "English",
        flag: "🇺🇸",
        badge: "Server 1 & 2",
        note: "Available on Server 1 & Server 2"
      });
    }

    if (origCode !== "hi" && (streamingDubs.some(d => d.code === "hi") || priorityCodes.includes("hi"))) {
      moviezWikiTracks.push({
        label: "Hindi Dub",
        language: "Hindi",
        flag: "🇮🇳",
        badge: "Server 2 & 3",
        note: "AutoEmbed / VidLink (Toggle in ⚙️)"
      });
    }

    if (origCode !== "es" && streamingDubs.some(d => d.code === "es")) {
      moviezWikiTracks.push({
        label: "Spanish Dub",
        language: "Spanish",
        flag: "🇪🇸",
        badge: "Server 1 & 3",
        note: "Multi-Audio stream on Server 1 & 3"
      });
    }

    return {
      originalLanguage,
      popularDubs,
      otherDubs,
      streamingDubs,
      totalCount: streamingDubs.length + 1,
      moviezWikiTracks,
      hasMultiAudio: moviezWikiTracks.length > 1
    };
  } catch (error) {
    console.error("Error fetching audio languages:", error);
    return null;
  }
}