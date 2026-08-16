import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { healthRouter } from "./routes/health.js";
import { listsRouter } from "./routes/lists.js";
import { moviesRouter } from "./routes/movies.js";
import { getTmdbApiKey } from "./services/tmdb.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Root .env wins (tsx restarts can leave empty TMDB_API_KEY in process.env)
dotenv.config({ path: path.resolve(__dirname, "../../../.env"), override: true });
dotenv.config({ override: false });

const app = express();
const port = Number(process.env.PORT) || 3001;
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.use("/health", healthRouter);
app.use("/lists", listsRouter);
app.use("/movies", moviesRouter);

app.listen(port, () => {
  const mode = getTmdbApiKey() ? "TMDB live" : "fallback seed (set TMDB_API_KEY)";
  console.log(`[api] SCRATCH on http://localhost:${port} · ${mode}`);
});
