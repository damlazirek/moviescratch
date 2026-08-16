import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Movie } from "@/types/movie";

type MoviePosterProps = {
  movie: Movie;
  className?: string;
  revealed?: boolean;
};

export function MoviePoster({ movie, className, revealed = true }: MoviePosterProps) {
  const [broken, setBroken] = useState(false);

  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-[#12100e]", className)}>
      <div className="absolute inset-0" style={{ background: movie.posterWash }} aria-hidden />
      {movie.posterUrl && !broken ? (
        <img
          src={movie.posterUrl}
          alt=""
          draggable={false}
          onError={() => setBroken(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            "transition-[transform,filter] duration-700 ease-out",
            revealed ? "scale-100 brightness-100" : "scale-[1.03] brightness-[0.92]",
          )}
        />
      ) : null}
    </div>
  );
}
