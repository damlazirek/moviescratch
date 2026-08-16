import { useEffect, useId, useRef } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import type { Movie } from "@/types/movie";
import { motionTokens } from "@/lib/motion";

type MovieRevealProps = {
  movie: Movie;
  onWatch: () => void;
  onScratchAgain: () => void;
  onClose?: () => void;
};

export function MovieReveal({
  movie,
  onWatch,
  onScratchAgain,
  onClose,
}: MovieRevealProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const watchRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    watchRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.() ?? onScratchAgain();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onScratchAgain]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: motionTokens.fast }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/85 p-0 sm:items-center sm:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.() ?? onScratchAgain();
      }}
    >
      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18 }}
        transition={{ duration: motionTokens.reveal, ease: motionTokens.easeOutExpo }}
        className="relative grid max-h-[92dvh] w-full max-w-3xl overflow-y-auto border border-line bg-velvet sm:grid-cols-[0.9fr_1.1fr] sm:overflow-hidden"
      >
        <div
          className="relative min-h-[260px] overflow-hidden sm:min-h-[440px]"
          style={{ background: movie.posterWash }}
        >
          {movie.posterUrl ? (
            <motion.img
              src={movie.posterUrl}
              alt=""
              initial={{ scale: 1.06, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: motionTokens.reveal, ease: motionTokens.easeOutExpo }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-velvet via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-transparent sm:to-velvet/90" />
          <div className="absolute inset-0 flex items-end p-6 sm:hidden">
            <h2 className="font-marquee text-4xl tracking-wide text-paper drop-shadow">
              {movie.title}
            </h2>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8">
          <p className="font-ui mb-3 text-xs tracking-[0.2em] uppercase text-spotlight">
            Fate revealed
          </p>
          <h2
            id={titleId}
            className="font-marquee text-4xl tracking-wide text-paper max-sm:sr-only lg:text-5xl"
          >
            {movie.title}
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: motionTokens.base }}
          >
            <p className="font-ui mt-3 text-sm text-muted">
              {movie.year || "—"} · {movie.runtime}
            </p>
            <p className="font-ui mt-2 text-sm text-spotlight">
              ★ {movie.rating.toFixed(1)}
              {movie.voteCount ? (
                <span className="text-muted"> · {movie.voteCount.toLocaleString()} votes</span>
              ) : null}
            </p>
            <p className="font-ui mt-2 text-xs tracking-wide text-muted">
              {movie.genres.join(" · ")}
            </p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: motionTokens.base }}
            className="mt-5 line-clamp-6 text-sm leading-relaxed text-paper/85"
          >
            {movie.overview}
          </motion.p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button ref={watchRef} size="lg" onClick={onWatch}>
              Watch this
            </Button>
            <Button size="lg" variant="ghost" onClick={onScratchAgain}>
              Scratch again
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
