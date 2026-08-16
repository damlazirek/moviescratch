import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { getListMeta } from "@/data/lists";
import { useLocale } from "@/lib/i18n/LocaleContext";
import {
  clearWatched,
  readWatched,
  removeWatched,
  type WatchedEntry,
} from "@/lib/watched";

export function WatchedPage() {
  const { t, tf } = useLocale();
  const [watched, setWatched] = useState<WatchedEntry[]>([]);

  useEffect(() => {
    setWatched(readWatched());
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-ui mb-3 text-xs tracking-[0.2em] uppercase text-spotlight">
            {t.watched.eyebrow}
          </p>
          <h1 className="font-display text-3xl text-paper sm:text-5xl">
            {t.watched.title}
          </h1>
          <p className="mt-4 text-muted">{t.watched.sub}</p>
        </div>
        {watched.length > 0 && (
          <Button
            variant="ghost"
            onClick={() => {
              if (!window.confirm(t.watched.clearConfirm)) return;
              clearWatched();
              setWatched([]);
            }}
          >
            {t.watched.clearAll}
          </Button>
        )}
      </div>

      {watched.length === 0 ? (
        <div className="mt-10 border border-dashed border-line px-6 py-16 text-center">
          <p className="font-ui text-sm text-muted">{t.watched.empty}</p>
          <Link to="/lists" className="mt-6 inline-block">
            <Button>{t.watched.chooseList}</Button>
          </Link>
        </div>
      ) : (
        <ul className="mt-10 space-y-3">
          {watched.map((movie) => {
            const listMeta = movie.listId ? getListMeta(movie.listId) : undefined;
            return (
              <li
                key={movie.id}
                className="flex items-stretch gap-3 border border-line bg-velvet/50 sm:gap-4"
              >
                <div
                  className="relative w-16 shrink-0 overflow-hidden sm:w-20"
                  style={{ background: movie.posterWash }}
                  aria-hidden
                >
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1 py-4 pr-2">
                  <h2 className="font-marquee text-xl tracking-wide text-paper">
                    {movie.title}
                  </h2>
                  <p className="font-ui mt-1 text-xs text-muted">
                    {movie.year} · ★ {movie.rating.toFixed(1)}
                    {movie.genres?.length
                      ? ` · ${movie.genres.slice(0, 2).join(", ")}`
                      : ""}
                  </p>
                  {listMeta ? (
                    <Link
                      to={`/lists/${movie.listId}/scratch`}
                      className="font-ui mt-2 inline-block text-xs text-spotlight underline-offset-4 hover:underline"
                    >
                      {tf(t.watched.backToWall, { list: listMeta.name })}
                    </Link>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-start p-3">
                  <button
                    type="button"
                    onClick={() => setWatched(removeWatched(movie.id))}
                    className="font-ui text-xs tracking-wide text-muted underline-offset-4 hover:text-paper hover:underline"
                  >
                    {t.watched.remove}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
