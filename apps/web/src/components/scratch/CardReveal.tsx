import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMovieTrailer } from "@/lib/api";
import { useLocale } from "@/lib/i18n/LocaleContext";
import type { Movie } from "@/types/movie";
import { cn } from "@/lib/cn";

type CardRevealProps = {
  movie: Movie;
  visible: boolean;
  onWatch: () => void;
  onContinue: () => void;
  continueLabel?: string;
  watchLabel?: string;
};

/**
 * Poster + künye + trailer — under the wall, not a modal.
 */
export function CardReveal({
  movie,
  visible,
  onWatch,
  onContinue,
  continueLabel,
  watchLabel,
}: CardRevealProps) {
  const { t } = useLocale();
  const [show, setShow] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [trailerLoading, setTrailerLoading] = useState(false);

  const continueText = continueLabel ?? t.reveal.backWall;
  const watchText = watchLabel ?? t.reveal.watched;

  useEffect(() => {
    if (!visible) {
      setShow(false);
      return;
    }
    const id = window.setTimeout(() => setShow(true), 80);
    return () => window.clearTimeout(id);
  }, [visible, movie.id]);

  useEffect(() => {
    if (!visible) {
      setTrailerUrl(null);
      return;
    }

    let cancelled = false;
    setTrailerLoading(true);
    setTrailerUrl(null);

    void fetchMovieTrailer(movie.id).then((data) => {
      if (cancelled) return;
      setTrailerUrl(data.embedUrl);
      setTrailerLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [visible, movie.id]);

  if (!visible) return null;

  const genres = movie.genres.slice(0, 3).join(" · ");
  const posterSrc = movie.posterUrl?.replace("/w342/", "/w500/") ?? movie.posterUrl;

  return (
    <div
      className={cn(
        "mt-8 max-w-4xl transition-[opacity,transform] duration-500 ease-out",
        show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
      )}
    >
      <p
        className={cn(
          "font-ui text-[10px] tracking-[0.2em] uppercase text-[#8a8478]",
          "transition-opacity duration-500 delay-100",
          show ? "opacity-100" : "opacity-0",
        )}
      >
        {t.reveal.stamped}
      </p>

      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        {posterSrc ? (
          <div
            className={cn(
              "mx-auto w-[148px] shrink-0 overflow-hidden sm:mx-0 sm:w-[168px]",
              "shadow-[0_16px_40px_rgba(0,0,0,0.55)]",
              "transition-[opacity,transform] duration-500 delay-150 ease-out",
              show ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            )}
            style={{ borderRadius: 1 }}
          >
            <img
              src={posterSrc}
              alt=""
              className="aspect-[2/3] w-full object-cover"
              draggable={false}
            />
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <h2
            className={cn(
              "font-display text-2xl leading-tight text-[#f2eee6] sm:text-3xl",
              "transition-[opacity,transform] duration-500 delay-150 ease-out",
              show ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            )}
          >
            {movie.title}
          </h2>

          <p
            className={cn(
              "font-ui mt-3 text-sm text-[#b8b0a4]",
              "transition-opacity duration-500 delay-200",
              show ? "opacity-100" : "opacity-0",
            )}
          >
            {[movie.year || null, movie.runtime !== "—" ? movie.runtime : null]
              .filter(Boolean)
              .join(" · ")}
          </p>

          <p
            className={cn(
              "font-ui mt-1.5 text-sm text-[#c4a66a]",
              "transition-opacity duration-500 delay-250",
              show ? "opacity-100" : "opacity-0",
            )}
          >
            ★ {movie.rating.toFixed(1)}
          </p>

          {genres ? (
            <p
              className={cn(
                "font-ui mt-2 text-xs tracking-wide text-[#8a8478]",
                "transition-opacity duration-500 delay-300",
                show ? "opacity-100" : "opacity-0",
              )}
            >
              {genres}
            </p>
          ) : null}

          {movie.overview ? (
            <p
              className={cn(
                "mt-4 max-w-xl text-sm leading-relaxed text-[#c8c2b6]/85",
                "transition-opacity duration-500 delay-[350ms]",
                show ? "opacity-100" : "opacity-0",
              )}
            >
              {movie.overview}
            </p>
          ) : null}

          <div
            className={cn(
              "mt-7 flex flex-col gap-2.5 sm:flex-row sm:max-w-md",
              "transition-[opacity,transform] duration-500 delay-[400ms] ease-out",
              show ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            )}
          >
            <Link
              to="/watched"
              onClick={onWatch}
              className="font-ui flex-1 bg-[#ede8df] px-5 py-3.5 text-center text-sm tracking-wide text-[#0b0a09] transition-colors hover:bg-[#f5f1ea] active:scale-[0.98]"
            >
              {watchText}
            </Link>
            <button
              type="button"
              onClick={onContinue}
              className="font-ui flex-1 border border-[#2a2622] bg-transparent px-5 py-3.5 text-sm tracking-wide text-[#c8c2b6] transition-colors hover:border-[#4a4640] hover:text-[#ede8df] active:scale-[0.98]"
            >
              {continueText}
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "mt-8",
          "transition-[opacity,transform] duration-500 delay-[450ms] ease-out",
          show ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
      >
        <p className="font-ui mb-3 text-[10px] tracking-[0.18em] uppercase text-[#8a8478]">
          {t.reveal.trailer}
        </p>

        {trailerLoading ? (
          <div
            className="aspect-video w-full animate-pulse bg-[#1a1816]"
            style={{ borderRadius: 1 }}
          />
        ) : trailerUrl ? (
          <div
            className="relative aspect-video w-full overflow-hidden bg-[#0b0a09] shadow-[0_20px_48px_rgba(0,0,0,0.5)]"
            style={{ borderRadius: 1 }}
          >
            <iframe
              key={trailerUrl}
              src={`${trailerUrl}?rel=0&modestbranding=1`}
              title={`${movie.title} — ${t.reveal.trailer}`}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : (
          <p className="font-ui text-sm text-[#6e6a64]">{t.reveal.noTrailer}</p>
        )}
      </div>
    </div>
  );
}
