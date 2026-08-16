import type { Movie } from "@/types/movie";
import { DEFAULT_POSTER_WASH } from "@/types/movie";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export type CuratedList = {
  id: string;
  name: string;
  slug: string;
  count: number;
  description: string;
  mood: string;
  tagline?: string;
};

async function api<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`API ${response.status}: ${path}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchLists(): Promise<CuratedList[]> {
  const data = await api<{ lists: CuratedList[] }>("/lists");
  return data.lists;
}

export async function fetchRandomMovie(
  listId: string,
  excludeIds: string[] = [],
): Promise<{ movie: Movie; source: "tmdb" | "fallback" }> {
  const qs =
    excludeIds.length > 0
      ? `?exclude=${encodeURIComponent(excludeIds.join(","))}`
      : "";
  const data = await api<{ movie: Movie; source: "tmdb" | "fallback" }>(
    `/lists/${listId}/random${qs}`,
  );
  return {
    source: data.source,
    movie: {
      ...data.movie,
      posterWash: data.movie.posterWash || DEFAULT_POSTER_WASH,
    },
  };
}

export async function fetchMovieBatch(
  listId: string,
  count = 12,
  excludeIds: string[] = [],
): Promise<{ movies: Movie[]; source: "tmdb" | "fallback"; total: number }> {
  const params = new URLSearchParams({ count: String(count) });
  if (excludeIds.length > 0) {
    params.set("exclude", excludeIds.join(","));
  }
  const data = await api<{
    movies: Movie[];
    source: "tmdb" | "fallback";
    total: number;
  }>(`/lists/${listId}/batch?${params.toString()}`);

  return {
    source: data.source,
    total: data.total,
    movies: data.movies.map((movie) => ({
      ...movie,
      posterWash: movie.posterWash || DEFAULT_POSTER_WASH,
    })),
  };
}

/** Full poster wall for a list. */
export async function fetchListMovies(
  listId: string,
): Promise<{ movies: Movie[]; source: "tmdb" | "fallback"; total: number }> {
  const data = await api<{
    movies: Movie[];
    source: "tmdb" | "fallback";
    total: number;
  }>(`/lists/${listId}/movies`);

  return {
    source: data.source,
    total: data.total,
    movies: data.movies
      .filter((movie) => Boolean(movie.posterUrl))
      .map((movie) => ({
        ...movie,
        posterWash: movie.posterWash || DEFAULT_POSTER_WASH,
      })),
  };
}

export async function fetchMovieTrailer(
  movieId: string,
): Promise<{ youtubeKey: string | null; embedUrl: string | null }> {
  try {
    return await api<{ youtubeKey: string | null; embedUrl: string | null }>(
      `/movies/${movieId}/trailer`,
    );
  } catch {
    return { youtubeKey: null, embedUrl: null };
  }
}
