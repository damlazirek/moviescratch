# SCRATCH

Stop scrolling. Start scratching.

A cinematic movie discovery ritual — pick a list, scratch a card, meet your next film.

## Stack

- **web** — React, TypeScript, Vite, Tailwind CSS, Motion
- **api** — Node.js, Express, TypeScript (TMDB proxy)

## Setup

```bash
cp .env.example .env
# add TMDB_API_KEY to .env (used only by the API)

npm install
npm run dev:api
npm run dev:web
```

- Web: http://localhost:5173  
- API: http://localhost:3001  

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev:web` | Vite frontend          |
| `npm run dev:api` | Express API            |
| `npm run build`   | Production web build   |
