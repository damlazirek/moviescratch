const TMDB_BASE = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export function getTmdbApiKey(): string | null {
  return process.env.TMDB_API_KEY?.trim() || null;
}

export function posterUrl(path: string | null | undefined, size: "w342" | "w500" | "w780" = "w500"): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function backdropUrl(path: string | null | undefined, size: "w780" | "w1280" = "w780"): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export async function tmdbFetch<T>(
  path: string,
  searchParams?: Record<string, string>,
): Promise<T> {
  const apiKey = getTmdbApiKey();
  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not set");
  }

  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", apiKey);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== "") url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDB error ${response.status}: ${path}`);
  }

  return response.json() as Promise<T>;
}

export type TmdbMovieSummary = {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
};

export type TmdbMovieDetail = TmdbMovieSummary & {
  runtime: number | null;
  genres: { id: number; name: string }[];
};

export type TmdbVideo = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at?: string;
};

export type TmdbVideosResponse = {
  id: number;
  results: TmdbVideo[];
};

/** Prefer official YouTube trailer, then any trailer/teaser. */
export function pickTrailerKey(videos: TmdbVideo[]): string | null {
  const yt = videos.filter((v) => v.site === "YouTube" && Boolean(v.key));
  const officialTrailer = yt.find((v) => v.type === "Trailer" && v.official);
  if (officialTrailer) return officialTrailer.key;
  const trailer = yt.find((v) => v.type === "Trailer");
  if (trailer) return trailer.key;
  const teaser = yt.find((v) => v.type === "Teaser");
  if (teaser) return teaser.key;
  return yt[0]?.key ?? null;
}

export async function fetchMovieTrailerKey(movieId: string): Promise<string | null> {
  if (!getTmdbApiKey()) return null;
  try {
    const data = await tmdbFetch<TmdbVideosResponse>(`/movie/${movieId}/videos`, {
      language: "en-US",
    });
    return pickTrailerKey(data.results ?? []);
  } catch {
    return null;
  }
}

export type TmdbPaged<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function yearFromDate(date?: string): number {
  if (!date) return 0;
  const y = Number(date.slice(0, 4));
  return Number.isFinite(y) ? y : 0;
}

export type ApiMovie = {
  id: string;
  title: string;
  originalTitle: string;
  year: number;
  runtime: string;
  rating: number;
  voteCount: number;
  genres: string[];
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  posterWash: string;
};

export function mapDetailToApiMovie(detail: TmdbMovieDetail): ApiMovie {
  return {
    id: String(detail.id),
    title: detail.title,
    originalTitle: detail.original_title || detail.title,
    year: yearFromDate(detail.release_date),
    runtime: formatRuntime(detail.runtime),
    rating: Math.round(detail.vote_average * 10) / 10,
    voteCount: detail.vote_count,
    genres: detail.genres.map((g) => g.name),
    overview: detail.overview || "No overview available.",
    posterUrl: posterUrl(detail.poster_path),
    backdropUrl: backdropUrl(detail.backdrop_path),
    posterWash: "linear-gradient(160deg, #2a241c 0%, #0b0a09 55%, #1a1410 100%)",
  };
}

const GENRE_NAMES: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

/** Fast sheet cards — poster from list results without per-id detail roundtrips. */
export function mapSummaryToApiMovie(summary: TmdbMovieSummary): ApiMovie {
  return {
    id: String(summary.id),
    title: summary.title,
    originalTitle: summary.original_title || summary.title,
    year: yearFromDate(summary.release_date),
    runtime: "—",
    rating: Math.round(summary.vote_average * 10) / 10,
    voteCount: summary.vote_count,
    genres: (summary.genre_ids ?? [])
      .map((id) => GENRE_NAMES[id])
      .filter((name): name is string => Boolean(name))
      .slice(0, 3),
    overview: summary.overview || "No overview available.",
    posterUrl: posterUrl(summary.poster_path, "w342"),
    backdropUrl: backdropUrl(summary.backdrop_path),
    posterWash: "linear-gradient(160deg, #2a241c 0%, #0b0a09 55%, #1a1410 100%)",
  };
}
