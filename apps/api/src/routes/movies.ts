import { Router } from "express";
import { getMovieById } from "../services/listMovies.js";
import { fetchMovieTrailerKey } from "../services/tmdb.js";

export const moviesRouter = Router();

moviesRouter.get("/:id/trailer", async (req, res) => {
  try {
    const key = await fetchMovieTrailerKey(req.params.id);
    res.json({
      youtubeKey: key,
      embedUrl: key ? `https://www.youtube.com/embed/${key}` : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load trailer";
    res.status(500).json({ error: message });
  }
});

moviesRouter.get("/:id", async (req, res) => {
  try {
    const movie = await getMovieById(req.params.id);
    res.json({ movie });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    const message = error instanceof Error ? error.message : "Failed to load movie";
    res.status(status).json({ error: message });
  }
});
