"use server";

const API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;

export async function getMoviesByCountry(countryCode: string) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_origin_country=${countryCode}&sort_by=popularity.desc&page=1`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return data.results?.slice(0, 10) || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPersonDetails(personId: number) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/person/${personId}?api_key=${API_KEY}`,
      { next: { revalidate: 86400 } }
    );
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getMovieTrailer(id: number, type: "movie" | "tv" = "movie") {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    
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