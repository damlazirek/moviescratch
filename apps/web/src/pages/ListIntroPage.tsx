import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";

const INTROS: Record<string, { name: string; line: string; count: number }> = {
  "imdb-top": { name: "IMDb Top 100", line: "100 movies. One choice.", count: 100 },
  "oscar-winners": { name: "Oscar Winners", line: "The gold list. One scratch.", count: 48 },
  "best-horror": { name: "Best Horror", line: "Don't look away. Scratch.", count: 40 },
  "best-sci-fi": { name: "Best Sci-Fi", line: "Other worlds. One ticket.", count: 40 },
  "nolan-essentials": { name: "Nolan Essentials", line: "Time folds. You scratch.", count: 12 },
  "90s-classics": { name: "90s Classics", line: "Rewind the decade. Scratch once.", count: 36 },
};

export function ListIntroPage() {
  const { listId = "" } = useParams();
  const intro = INTROS[listId] ?? {
    name: "Movie List",
    line: "Pick a card. Meet a film.",
    count: 0,
  };

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8rem)] max-w-3xl flex-col justify-center px-5 py-16 sm:px-8">
      <p className="font-ui mb-3 text-xs tracking-[0.2em] uppercase text-muted">
        {intro.count ? `${intro.count} titles` : "Curated list"}
      </p>
      <h1 className="font-marquee text-4xl tracking-wide text-paper sm:text-6xl">
        {intro.name}
      </h1>
      <p className="font-display mt-6 text-2xl text-foil-light sm:text-3xl">
        {intro.line}
      </p>
      <div className="mt-12 flex flex-wrap gap-3">
        <Link to={`/lists/${listId}/scratch`}>
          <Button size="lg">Start scratching</Button>
        </Link>
        <Link to="/lists">
          <Button size="lg" variant="ghost">
            Back to lists
          </Button>
        </Link>
      </div>
    </div>
  );
}
