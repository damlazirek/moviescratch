import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { healthRouter } from "./routes/health.js";
import { listsRouter } from "./routes/lists.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.use("/health", healthRouter);
app.use("/lists", listsRouter);

app.listen(port, () => {
  console.log(`[api] SCRATCH listening on http://localhost:${port}`);
});
