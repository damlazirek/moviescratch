/**
 * TMDB client — key stays server-side only.
 * Full movie fetch lands in a later stage.
 */
const TMDB_BASE = "https://api.themoviedb.org/3";

export function getTmdbApiKey(): string | null {
  return process.env.TMDB_API_KEY?.trim() || null;
}

export async function tmdbFetch<T>(path: string, searchParams?: Record<string, string>): Promise<T> {
  const apiKey = getTmdbApiKey();
  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not set");
  }

  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", apiKey);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDB error ${response.status}: ${path}`);
  }

  return response.json() as Promise<T>;
}
