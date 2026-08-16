import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";

/** Scratch engine lands in A3 — this is the stage shell only. */
export function ScratchPage() {
  const { listId = "" } = useParams();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-ui text-xs tracking-[0.2em] uppercase text-spotlight">
            Scratch stage
          </p>
          <h1 className="font-display mt-2 text-3xl text-paper sm:text-4xl">
            Foil up. Fate waiting.
          </h1>
          <p className="mt-3 max-w-md text-muted">
            List: <span className="text-paper">{listId}</span>. The scratch
            interaction ships next.
          </p>
        </div>
        <Link to={`/lists/${listId}`}>
          <Button variant="ghost">Back</Button>
        </Link>
      </div>

      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4"
        aria-label="Scratch cards placeholder"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[2/3] border border-line bg-[linear-gradient(145deg,var(--color-foil-dark),var(--color-foil),var(--color-foil-light))] opacity-80"
          />
        ))}
      </div>
    </div>
  );
}
