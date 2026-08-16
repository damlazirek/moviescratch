# SCRATCH

Stop scrolling. Start scratching.

A cinematic movie discovery ritual — pick a list, scratch a card, meet your next film.

## Stack

- **web** — React, TypeScript, Vite, Tailwind CSS, Motion
- **api** — Node.js, Express, TypeScript (TMDB proxy)

## Setup

1. Copy env and add your [TMDB API key](https://www.themoviedb.org/settings/api):

```bash
cp .env.example .env
```

```env
TMDB_API_KEY=your_key_here
PORT=3001
CORS_ORIGIN=http://localhost:5173
VITE_API_URL=http://localhost:3001
```

Without a key the API still runs using a curated **fallback seed** (real TMDB poster URLs).

2. Install and run:

```bash
npm install
npm run dev:api
npm run dev:web
```

- Web: http://localhost:5173
- API: http://localhost:3001

## Flow

Home → Lists → List intro → Scratch → Reveal → Watch / Scratch again → Watched

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:web` | Vite frontend |
| `npm run dev:api` | Express API |
| `npm run build` | Production web build |

## API

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `GET /lists` | Curated lists |
| `GET /lists/:id` | List detail |
| `GET /lists/:id/random?exclude=1,2` | Random movie for list |
| `GET /movies/:id` | Movie by id |
