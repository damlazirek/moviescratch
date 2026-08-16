import { Router } from "express";
import { CURATED_LISTS, getListDef } from "../data/lists.js";
import { getBatchMovies, getListMovies, getRandomMovie } from "../services/listMovies.js";
import { getTmdbApiKey } from "../services/tmdb.js";

export const listsRouter = Router();

listsRouter.get("/", (_req, res) => {
  res.json({
    lists: CURATED_LISTS.map(({ strategy: _s, ...list }) => list),
    tmdbConfigured: Boolean(getTmdbApiKey()),
  });
});

listsRouter.get("/:id", (req, res) => {
  const list = getListDef(req.params.id);
  if (!list) {
    res.status(404).json({ error: "List not found" });
    return;
  }
  const { strategy: _s, ...publicList } = list;
  res.json({ list: publicList });
});

/** Full poster wall for a list — posters required. */
listsRouter.get("/:id/movies", async (req, res) => {
  try {
    const result = await getListMovies(req.params.id);
    res.json(result);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    const message = error instanceof Error ? error.message : "Failed to load movies";
    res.status(status).json({ error: message });
  }
});

listsRouter.get("/:id/random", async (req, res) => {
  try {
    const excludeParam = typeof req.query.exclude === "string" ? req.query.exclude : "";
    const exclude = excludeParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const result = await getRandomMovie(req.params.id, exclude);
    res.json(result);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    const message = error instanceof Error ? error.message : "Failed to pick movie";
    res.status(status).json({ error: message });
  }
});

listsRouter.get("/:id/batch", async (req, res) => {
  try {
    const excludeParam = typeof req.query.exclude === "string" ? req.query.exclude : "";
    const exclude = excludeParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const count = Number(req.query.count) || 12;

    const result = await getBatchMovies(req.params.id, count, exclude);
    res.json(result);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    const message = error instanceof Error ? error.message : "Failed to load sheet";
    res.status(status).json({ error: message });
  }
});
