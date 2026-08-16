import { useEffect, useRef, useState } from "react";
import { MoviePoster } from "@/components/scratch/MoviePoster";
import { ScratchSurface } from "@/components/scratch/ScratchSurface";
import { SCRATCH_REVEAL_THRESHOLD } from "@/lib/scratch/constants";
import type { Movie } from "@/types/movie";
import { cn } from "@/lib/cn";

type ScratchCardProps = {
  movie: Movie;
  listId: string;
  className?: string;
  initiallyRevealed?: boolean;
  idleCoin?: boolean;
  dimmed?: boolean;
  onReveal?: (movie: Movie) => void;
  onScratchStart?: () => void;
  onScratchEnd?: () => void;
};

const FOIL_CSS =
  "linear-gradient(160deg, #6e6a64 0%, #7a7670 40%, #5c5852 100%)";

export function ScratchCard({
  movie,
  listId,
  className,
  initiallyRevealed = false,
  idleCoin = false,
  dimmed = false,
  onReveal,
  onScratchStart,
  onScratchEnd,
}: ScratchCardProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(initiallyRevealed);
  const [armed, setArmed] = useState(initiallyRevealed);
  const [foilReady, setFoilReady] = useState(initiallyRevealed);
  const [nudged, setNudged] = useState(false);

  useEffect(() => {
    setRevealed(initiallyRevealed);
    setArmed(initiallyRevealed);
    setFoilReady(initiallyRevealed);
  }, [initiallyRevealed, movie.id]);

  // Lazy-activate scratch canvas when near viewport (performance on 100 cards)
  useEffect(() => {
    if (armed || revealed) return;
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setArmed(true);
      },
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed, revealed, movie.id]);

  const showFoilCover = !revealed && (!armed || !foilReady);

  return (
    <article
      ref={rootRef}
      className={cn(
        "relative aspect-[2/3] select-none",
        "bg-[#1a1816]",
        "shadow-[0_6px_16px_rgba(0,0,0,0.4)]",
        "transition-[filter,box-shadow] duration-300 ease-out",
        revealed && "shadow-[0_12px_28px_rgba(0,0,0,0.5)]",
        dimmed && !revealed && "brightness-[0.55]",
        className,
      )}
      style={{ borderRadius: 1 }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[3] border border-black/50"
        style={{ borderRadius: 1 }}
      />

      <div className="absolute inset-[2px] overflow-hidden">
        <MoviePoster movie={movie} revealed={revealed} />
        {showFoilCover && (
          <div
            aria-hidden
            className="absolute inset-0 z-[2]"
            style={{ background: FOIL_CSS }}
          />
        )}
      </div>

      {armed && !revealed && (
        <ScratchSurface
          listId={listId}
          movieId={movie.id}
          enabled
          idleCoin={idleCoin}
          seed={Number(movie.id) || movie.title.length * 17}
          onReady={() => setFoilReady(true)}
          onProgress={(ratio) =>
            setNudged(ratio > 0.02 && ratio < SCRATCH_REVEAL_THRESHOLD)
          }
          onScratchStart={onScratchStart}
          onScratchEnd={onScratchEnd}
          onReveal={() => {
            setRevealed(true);
            setNudged(false);
            onReveal?.(movie);
          }}
        />
      )}

      {nudged && !revealed && (
        <span className="sr-only">Scratching in progress</span>
      )}
    </article>
  );
}
