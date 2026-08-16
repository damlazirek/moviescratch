import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { fetchLists, type CuratedList } from "@/lib/api";
import { motionTokens } from "@/lib/motion";

const FALLBACK_LISTS: CuratedList[] = [
  {
    id: "imdb-top",
    name: "IMDb Top 100",
    slug: "imdb-top",
    count: 100,
    description: "The canon. Scratch one. Commit.",
    mood: "prestige",
  },
  {
    id: "oscar-winners",
    name: "Oscar Winners",
    slug: "oscar-winners",
    count: 48,
    description: "Gold statues. Fate still chooses.",
    mood: "ceremony",
  },
  {
    id: "best-horror",
    name: "Best Horror",
    slug: "best-horror",
    count: 40,
    description: "Lights down. Pulse up.",
    mood: "horror",
  },
  {
    id: "best-sci-fi",
    name: "Best Sci-Fi",
    slug: "best-sci-fi",
    count: 40,
    description: "Other worlds. One ticket.",
    mood: "scifi",
  },
  {
    id: "nolan-essentials",
    name: "Nolan Essentials",
    slug: "nolan-essentials",
    count: 12,
    description: "Time folds. You scratch.",
    mood: "nolan",
  },
  {
    id: "90s-classics",
    name: "90s Classics",
    slug: "90s-classics",
    count: 36,
    description: "VHS energy. Foil destiny.",
    mood: "retro",
  },
];

export function ListsPage() {
  const [lists, setLists] = useState<CuratedList[]>(FALLBACK_LISTS);

  useEffect(() => {
    let cancelled = false;
    fetchLists()
      .then((data) => {
        if (!cancelled) setLists(data);
      })
      .catch(() => {
        /* keep fallback — API may be offline during scaffold */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="mb-12 max-w-xl">
        <p className="font-ui mb-3 text-xs tracking-[0.2em] uppercase text-spotlight">
          Choose a list
        </p>
        <h1 className="font-display text-3xl text-paper sm:text-5xl">
          One list. One ritual.
        </h1>
        <p className="mt-4 text-muted">
          Pick a world. Scratch the foil. Meet your film.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lists.map((list, index) => (
          <motion.li
            key={list.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: motionTokens.base,
              delay: index * motionTokens.stagger,
              ease: motionTokens.easeOutExpo,
            }}
          >
            <Link
              to={`/lists/${list.id}`}
              className="group block border border-line bg-velvet/60 p-6 transition-[border-color,background-color] duration-[var(--duration-fast)] hover:border-foil/50 hover:bg-velvet"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-marquee text-2xl tracking-wide text-paper">
                  {list.name}
                </h2>
                <span className="font-ui shrink-0 text-xs text-muted">
                  {list.count} films
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted group-hover:text-paper/80">
                {list.description}
              </p>
              <p className="font-ui mt-6 text-xs tracking-[0.16em] uppercase text-spotlight/80 opacity-0 transition-opacity duration-[var(--duration-fast)] group-hover:opacity-100">
                Enter →
              </p>
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
