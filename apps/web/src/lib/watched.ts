import type { Movie } from "@/types/movie";

const KEY = "scratch:watched";

export type WatchedEntry = Movie & {
  listId?: string;
  stampedAt?: number;
};

export function readWatched(): WatchedEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as WatchedEntry[]) : [];
  } catch {
    return [];
  }
}

function writeWatched(next: WatchedEntry[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode / quota */
  }
}

export function addWatched(
  movie: Movie,
  options?: { listId?: string },
): WatchedEntry[] {
  const prev = readWatched();
  const existing = prev.find((item) => item.id === movie.id);
  const entry: WatchedEntry = {
    ...movie,
    listId: options?.listId ?? existing?.listId,
    stampedAt: Date.now(),
  };

  const next = existing
    ? [entry, ...prev.filter((item) => item.id !== movie.id)]
    : [entry, ...prev];

  writeWatched(next);
  return next;
}

export function removeWatched(movieId: string): WatchedEntry[] {
  const next = readWatched().filter((item) => item.id !== movieId);
  writeWatched(next);
  return next;
}

export function clearWatched(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function isWatched(movieId: string): boolean {
  return readWatched().some((item) => item.id === movieId);
}
