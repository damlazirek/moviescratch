import { Router } from "express";

/** Curated lists — TMDB wiring comes in a later stage. */
export const CURATED_LISTS = [
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
] as const;

export const listsRouter = Router();

listsRouter.get("/", (_req, res) => {
  res.json({ lists: CURATED_LISTS });
});

listsRouter.get("/:id", (req, res) => {
  const list = CURATED_LISTS.find((item) => item.id === req.params.id);
  if (!list) {
    res.status(404).json({ error: "List not found" });
    return;
  }
  res.json({ list });
});
