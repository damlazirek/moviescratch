import { getListDef, type CuratedListDef } from "../data/lists.js";
import {
  getTmdbApiKey,
  mapDetailToApiMovie,
  mapSummaryToApiMovie,
  posterUrl,
  tmdbFetch,
  type ApiMovie,
  type TmdbMovieDetail,
  type TmdbMovieSummary,
  type TmdbPaged,
} from "./tmdb.js";
import { FALLBACK_MOVIES } from "../data/fallbackMovies.js";
import { IMDB_TOP_SEED } from "../data/imdbTopSeed.js";

const poolCache = new Map<string, { ids: number[]; fetchedAt: number }>();
const summaryCache = new Map<string, { movies: ApiMovie[]; fetchedAt: number }>();
const CACHE_TTL_MS = 1000 * 60 * 30;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

async function resolvePoolIds(list: CuratedListDef): Promise<number[]> {
  const cached = poolCache.get(list.id);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.ids;
  }

  const strategy = list.strategy;
  let ids: number[] = [];
  let summaries: TmdbMovieSummary[] = [];

  if (strategy.type === "curated") {
    ids = [...strategy.ids];
    // Fetch details so the poster wall has real art for curated lists
    const chunks: number[][] = [];
    for (let i = 0; i < ids.length; i += 15) {
      chunks.push(ids.slice(i, i + 15));
    }
    const details: TmdbMovieDetail[] = [];
    for (const chunk of chunks) {
      const part = await Promise.all(
        chunk.map((id) =>
          tmdbFetch<TmdbMovieDetail>(`/movie/${id}`, { language: "en-US" }).catch(
            () => null,
          ),
        ),
      );
      for (const d of part) {
        if (d) details.push(d);
      }
    }
    summaries = details;
  } else if (strategy.type === "top_rated") {
    const pages = await Promise.all(
      Array.from({ length: strategy.pages }, (_, i) =>
        tmdbFetch<TmdbPaged<TmdbMovieSummary>>("/movie/top_rated", {
          page: String(i + 1),
          language: "en-US",
        }),
      ),
    );
    summaries = pages.flatMap((p) => p.results);
    ids = summaries.map((m) => m.id);
  } else if (strategy.type === "discover") {
    const pages = await Promise.all(
      Array.from({ length: strategy.pages }, (_, i) => {
        const params: Record<string, string> = {
          page: String(i + 1),
          language: "en-US",
          sort_by: "vote_average.desc",
          "vote_count.gte": String(strategy.vote_count_gte ?? 800),
          include_adult: "false",
        };
        if (strategy.with_genres) params.with_genres = strategy.with_genres;
        if (strategy.with_original_language) {
          params.with_original_language = strategy.with_original_language;
        }
        if (strategy.primary_release_date_gte) {
          params["primary_release_date.gte"] = strategy.primary_release_date_gte;
        }
        if (strategy.primary_release_date_lte) {
          params["primary_release_date.lte"] = strategy.primary_release_date_lte;
        }
        return tmdbFetch<TmdbPaged<TmdbMovieSummary>>("/discover/movie", params);
      }),
    );
    summaries = pages.flatMap((p) => p.results);
    ids = summaries.map((m) => m.id);
  } else if (strategy.type === "person") {
    const credits = await tmdbFetch<{
      cast: TmdbMovieSummary[];
      crew: (TmdbMovieSummary & { job?: string })[];
    }>(`/person/${strategy.personId}/movie_credits`, { language: "en-US" });
    summaries = credits.crew.filter((c) => c.job === "Director");
    ids = summaries.map((c) => c.id);
  }

  ids = [...new Set(ids)];
  poolCache.set(list.id, { ids, fetchedAt: Date.now() });

  if (summaries.length > 0) {
    const byId = new Map(summaries.map(mapSummaryToApiMovie).map((m) => [m.id, m]));
    summaryCache.set(list.id, {
      movies: [...byId.values()],
      fetchedAt: Date.now(),
    });
  }

  return ids;
}

function seedMoviesAsApi(): ApiMovie[] {
  return IMDB_TOP_SEED.map((s) => ({
    id: String(s.id),
    title: s.title,
    originalTitle: s.title,
    year: s.year,
    runtime: s.runtime,
    rating: s.rating,
    voteCount: 0,
    genres: s.genres,
    overview: s.overview,
    posterUrl: posterUrl(s.poster, "w342"),
    backdropUrl: null,
    posterWash: "linear-gradient(160deg, #2a241c 0%, #0b0a09 55%, #1a1410 100%)",
  })).filter((m) => Boolean(m.posterUrl));
}

/** Full poster wall — every movie has a poster, stable order. */
export async function getListMovies(
  listId: string,
): Promise<{ movies: ApiMovie[]; source: "tmdb" | "fallback"; total: number }> {
  const list = getListDef(listId);
  if (!list) {
    throw Object.assign(new Error("List not found"), { status: 404 });
  }

  if (!getTmdbApiKey()) {
    if (listId === "imdb-top") {
      const movies = seedMoviesAsApi();
      return { movies, source: "fallback", total: movies.length };
    }
    const movies = pickFallbackBatch(listId, [], 80).filter((m) => m.posterUrl);
    return { movies, source: "fallback", total: movies.length };
  }

  try {
    await resolvePoolIds(list);
    const cached = summaryCache.get(list.id);
    let movies = (cached?.movies ?? []).filter((m) => Boolean(m.posterUrl));

    // Prefer higher-res posters for the wall
    movies = movies.map((m) => ({
      ...m,
      posterUrl: m.posterUrl?.replace("/w342/", "/w500/") ?? m.posterUrl,
    }));

    if (movies.length === 0) {
      const pool = await resolvePoolIds(list);
      const details = await Promise.all(
        pool.slice(0, list.count).map((id) =>
          tmdbFetch<TmdbMovieDetail>(`/movie/${id}`, { language: "en-US" }).catch(
            () => null,
          ),
        ),
      );
      movies = details
        .filter((d): d is TmdbMovieDetail => Boolean(d))
        .map(mapDetailToApiMovie)
        .filter((m) => Boolean(m.posterUrl));
    }

    movies = movies.slice(0, list.count);

    if (movies.length === 0) {
      const fallback =
        listId === "imdb-top"
          ? seedMoviesAsApi()
          : pickFallbackBatch(listId, [], 80).filter((m) => m.posterUrl);
      return { movies: fallback, source: "fallback", total: fallback.length };
    }

    return { movies, source: "tmdb", total: list.count };
  } catch (error) {
    console.warn("[tmdb] list fallback:", error instanceof Error ? error.message : error);
    const fallback =
      listId === "imdb-top"
        ? seedMoviesAsApi()
        : pickFallbackBatch(listId, [], 80).filter((m) => m.posterUrl);
    return { movies: fallback, source: "fallback", total: fallback.length };
  }
}

export async function getBatchMovies(
  listId: string,
  count = 12,
  excludeIds: string[] = [],
): Promise<{ movies: ApiMovie[]; source: "tmdb" | "fallback"; total: number }> {
  const list = getListDef(listId);
  if (!list) {
    throw Object.assign(new Error("List not found"), { status: 404 });
  }

  const limit = Math.min(Math.max(count, 1), 24);
  const exclude = new Set(excludeIds);

  if (!getTmdbApiKey()) {
    return {
      movies: pickFallbackBatch(listId, excludeIds, limit),
      source: "fallback",
      total: list.count,
    };
  }

  try {
    await resolvePoolIds(list);
    const cached = summaryCache.get(list.id);

    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
      const available = cached.movies.filter((m) => !exclude.has(m.id) && m.posterUrl);
      const pick = shuffle(available).slice(0, limit);
      if (pick.length > 0) {
        return { movies: pick, source: "tmdb", total: list.count };
      }
    }

    const pool = await resolvePoolIds(list);
    const availableIds = shuffle(pool.filter((id) => !exclude.has(String(id)))).slice(
      0,
      limit,
    );
    const details = await Promise.all(
      availableIds.map((id) =>
        tmdbFetch<TmdbMovieDetail>(`/movie/${id}`, { language: "en-US" }).catch(
          () => null,
        ),
      ),
    );
    const movies = details
      .filter((d): d is TmdbMovieDetail => Boolean(d))
      .map(mapDetailToApiMovie)
      .filter((m) => m.posterUrl);

    if (movies.length === 0) {
      return {
        movies: pickFallbackBatch(listId, excludeIds, limit),
        source: "fallback",
        total: list.count,
      };
    }

    return { movies, source: "tmdb", total: list.count };
  } catch (error) {
    console.warn("[tmdb] batch fallback:", error instanceof Error ? error.message : error);
    return {
      movies: pickFallbackBatch(listId, excludeIds, limit),
      source: "fallback",
      total: list.count,
    };
  }
}

export async function getRandomMovie(
  listId: string,
  excludeIds: string[] = [],
): Promise<{ movie: ApiMovie; source: "tmdb" | "fallback" }> {
  const batch = await getBatchMovies(listId, 1, excludeIds);
  const movie = batch.movies[0] ?? pickFallbackBatch(listId, excludeIds, 1)[0]!;
  return { movie, source: batch.source };
}

export async function getMovieById(id: string): Promise<ApiMovie> {
  if (!getTmdbApiKey()) {
    const fallback = FALLBACK_MOVIES.find((m) => m.id === id);
    if (fallback) {
      return stripFallback(fallback);
    }
    throw Object.assign(new Error("Movie not found"), { status: 404 });
  }

  const detail = await tmdbFetch<TmdbMovieDetail>(`/movie/${id}`, {
    language: "en-US",
  });
  return mapDetailToApiMovie(detail);
}

function stripFallback(movie: (typeof FALLBACK_MOVIES)[number]): ApiMovie {
  const { listIds: _listIds, ...rest } = movie;
  return rest;
}

function pickFallbackBatch(
  listId: string,
  excludeIds: string[],
  count: number,
): ApiMovie[] {
  const exclude = new Set(excludeIds);
  const pool = FALLBACK_MOVIES.filter(
    (m) => m.listIds.includes(listId) && !exclude.has(m.id),
  );
  const source =
    pool.length > 0 ? pool : FALLBACK_MOVIES.filter((m) => !exclude.has(m.id));
  const finalPool = source.length > 0 ? source : FALLBACK_MOVIES;
  return shuffle(finalPool).slice(0, count).map(stripFallback);
}
