import { useState } from "react";
import { ScratchCard } from "@/components/scratch/ScratchCard";
import type { Movie } from "@/types/movie";
import { cn } from "@/lib/cn";

type ScratchCardGridProps = {
  listId: string;
  movies: Movie[];
  revealedIds: Set<string>;
  onReveal: (movie: Movie) => void;
  className?: string;
};

export function ScratchCardGrid({
  listId,
  movies,
  revealedIds,
  onReveal,
  className,
}: ScratchCardGridProps) {
  const [scratchingId, setScratchingId] = useState<string | null>(null);
  const idleHintId = movies.find((m) => !revealedIds.has(m.id))?.id ?? null;

  return (
    <ul
      className={cn(
        "grid list-none grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8",
        className,
      )}
    >
      {movies.map((movie) => (
        <li key={movie.id} className="min-w-0">
          <ScratchCard
            movie={movie}
            listId={listId}
            initiallyRevealed={revealedIds.has(movie.id)}
            idleCoin={movie.id === idleHintId && !scratchingId}
            dimmed={Boolean(scratchingId) && scratchingId !== movie.id}
            onScratchStart={() => setScratchingId(movie.id)}
            onScratchEnd={() => setScratchingId(null)}
            onReveal={onReveal}
          />
        </li>
      ))}
    </ul>
  );
}
