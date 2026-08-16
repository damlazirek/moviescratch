import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CardReveal } from "@/components/scratch/CardReveal";
import { ScratchCardGrid } from "@/components/scratch/ScratchCardGrid";
import { Button } from "@/components/ui/Button";
import { getListMeta } from "@/data/lists";
import { fetchListMovies } from "@/lib/api";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { addWatched } from "@/lib/watched";
import {
  clearListProgress,
  getRevealedIdsForList,
} from "@/lib/scratch/scratchStore";
import type { Movie } from "@/types/movie";

type ScratchStageProps = {
  listId: string;
};

/**
 * Digital scratch poster wall — full list, scroll, persistent progress.
 */
export function ScratchStage({ listId }: ScratchStageProps) {
  const { t, tf } = useLocale();
  const meta = getListMeta(listId);
  const copy = t.listsCopy[listId];
  const revealRef = useRef<HTMLDivElement>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(() => new Set());
  const [active, setActive] = useState<Movie | null>(null);
  const [source, setSource] = useState<"tmdb" | "fallback" | null>(null);
  const [wallKey, setWallKey] = useState(0);
  const [resetting, setResetting] = useState(false);
  const [shareNote, setShareNote] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setActive(null);
    try {
      const [wall, saved] = await Promise.all([
        fetchListMovies(listId),
        getRevealedIdsForList(listId),
      ]);
      const withPosters = wall.movies.filter((m) => Boolean(m.posterUrl));
      setMovies(withPosters);
      setSource(wall.source);
      setRevealedIds(new Set(saved));
      for (const id of saved) {
        const movie = withPosters.find((m) => m.id === id);
        if (movie) addWatched(movie, { listId });
      }
    } catch {
      setError(t.wall.error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [listId, t.wall.error]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!active) return;
    const id = window.setTimeout(() => {
      revealRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
    return () => window.clearTimeout(id);
  }, [active?.id]);

  const total = movies.length;
  const revealedCount = useMemo(
    () => movies.filter((m) => revealedIds.has(m.id)).length,
    [movies, revealedIds],
  );

  const resetProgress = useCallback(async () => {
    if (resetting) return;
    if (!window.confirm(t.wall.resetConfirm)) return;

    setResetting(true);
    try {
      await clearListProgress(listId);
      setRevealedIds(new Set());
      setActive(null);
      setWallKey((k) => k + 1);
    } finally {
      setResetting(false);
    }
  }, [listId, resetting, t.wall.resetConfirm]);

  const shareProgress = useCallback(async () => {
    const listName = meta?.name ?? "SCRATCH";
    const text = tf(t.wall.shareBody, {
      list: listName,
      count: revealedCount,
      total,
    });
    const url = window.location.href;

    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: `SCRATCH · ${listName}`, text, url });
        setShareNote(t.wall.shared);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setShareNote(t.wall.copied);
      } else {
        setShareNote(t.wall.shareUnsupported);
      }
    } catch {
      /* user cancelled share */
    }

    window.setTimeout(() => setShareNote(null), 2200);
  }, [meta?.name, revealedCount, t.wall, tf, total]);

  const description =
    copy?.description ?? meta?.description ?? t.wall.defaultDesc;

  return (
    <div className="mx-auto min-h-[calc(100dvh-4rem)] max-w-6xl px-3 py-6 sm:px-6 sm:py-10">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-[#2a2622] pb-5 sm:mb-7">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl text-[#ede8df] sm:text-4xl">
            {meta?.name ?? "Movies"}
          </h1>
          <p className="mt-2 text-sm text-[#9a948a]">{description}</p>
          <p className="font-ui mt-3 text-xs tracking-wide text-[#c4a66a]">
            {loading
              ? t.wall.loading
              : tf(t.wall.revealed, { count: revealedCount, total })}
          </p>
          {source === "fallback" && (
            <p className="font-ui mt-1 text-[11px] text-[#6e6a64]">
              {t.wall.fallbackDemo}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-3">
          <Link
            to={`/lists/${listId}`}
            className="font-ui text-sm text-[#9a948a] underline-offset-4 hover:text-[#ede8df] hover:underline"
          >
            {t.wall.back}
          </Link>
          {!loading && !error && total > 0 && (
            <>
              <button
                type="button"
                onClick={() => void shareProgress()}
                className="font-ui text-xs tracking-wide text-[#c4a66a] underline-offset-4 transition-colors hover:text-[#ede8df] hover:underline"
              >
                {shareNote ?? t.wall.share}
              </button>
              <button
                type="button"
                onClick={() => void resetProgress()}
                disabled={resetting}
                className="font-ui text-xs tracking-wide text-[#8a8478] underline-offset-4 transition-colors hover:text-[#ede8df] hover:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline"
              >
                {resetting ? t.wall.resetting : t.wall.reset}
              </button>
            </>
          )}
        </div>
      </header>

      {!loading && !error && total > 0 && !active && (
        <p className="font-ui mb-4 text-[11px] tracking-[0.14em] uppercase text-[#6e6a64]">
          {t.wall.hint}
        </p>
      )}

      {loading && (
        <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
          {Array.from({ length: 24 }).map((_, i) => (
            <li
              key={i}
              className="aspect-[2/3] animate-pulse bg-[#2a2622]"
              style={{ borderRadius: 1 }}
            />
          ))}
        </ul>
      )}

      {error && !loading && (
        <div className="py-16 text-center">
          <p className="text-[#9a948a]">{error}</p>
          <Button className="mt-6" onClick={() => void load()}>
            {t.wall.retry}
          </Button>
        </div>
      )}

      {!loading && !error && movies.length > 0 && (
        <>
          <ScratchCardGrid
            key={wallKey}
            listId={listId}
            movies={movies}
            revealedIds={revealedIds}
            onReveal={(movie) => {
              addWatched(movie, { listId });
              setRevealedIds((prev) => new Set(prev).add(movie.id));
              setActive(movie);
            }}
          />

          <div ref={revealRef} className="px-1">
            <CardReveal
              movie={active ?? movies[0]!}
              visible={Boolean(active)}
              onWatch={() => setActive(null)}
              onContinue={() => setActive(null)}
            />
          </div>
        </>
      )}
    </div>
  );
}
