/**
 * Offline seed with HEAD-verified TMDB poster paths (works without API key).
 * With TMDB_API_KEY, the live top_rated pool (~100) replaces this.
 *
 * Only include posters that return HTTP 200 on image.tmdb.org.
 */
export type SeedMovie = {
  id: number;
  title: string;
  year: number;
  runtime: string;
  rating: number;
  genres: string[];
  overview: string;
  poster: string;
};

export const IMDB_TOP_SEED: SeedMovie[] = [
  {
    id: 278,
    title: "The Shawshank Redemption",
    year: 1994,
    runtime: "2h 22m",
    rating: 8.7,
    genres: ["Drama", "Crime"],
    overview:
      "Two imprisoned men bond over years, finding solace and eventual redemption through acts of common decency.",
    poster: "/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
  },
  {
    id: 424,
    title: "Schindler's List",
    year: 1993,
    runtime: "3h 15m",
    rating: 8.6,
    genres: ["Drama", "History", "War"],
    overview:
      "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
    poster: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
  },
  {
    id: 389,
    title: "12 Angry Men",
    year: 1957,
    runtime: "1h 36m",
    rating: 8.5,
    genres: ["Drama"],
    overview:
      "The jury in a New York City murder trial is frustrated by a single member whose skeptical caution forces them to more carefully consider the evidence before jumping to a hasty verdict.",
    poster: "/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg",
  },
  {
    id: 155,
    title: "The Dark Knight",
    year: 2008,
    runtime: "2h 32m",
    rating: 8.5,
    genres: ["Drama", "Action", "Crime", "Thriller"],
    overview:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    poster: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  },
  {
    id: 680,
    title: "Pulp Fiction",
    year: 1994,
    runtime: "2h 34m",
    rating: 8.5,
    genres: ["Thriller", "Crime"],
    overview:
      "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",
    poster: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
  },
  {
    id: 13,
    title: "Forrest Gump",
    year: 1994,
    runtime: "2h 22m",
    rating: 8.5,
    genres: ["Comedy", "Drama", "Romance"],
    overview:
      "A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do.",
    poster: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
  },
  {
    id: 769,
    title: "GoodFellas",
    year: 1990,
    runtime: "2h 25m",
    rating: 8.5,
    genres: ["Drama", "Crime"],
    overview:
      "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.",
    poster: "/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
  },
  {
    id: 550,
    title: "Fight Club",
    year: 1999,
    runtime: "2h 19m",
    rating: 8.4,
    genres: ["Drama"],
    overview:
      "A ticking-time-bomb of a young man and his younger blonde friend set off an anarchic fight club that morphs into something much more sinister.",
    poster: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  },
  {
    id: 27205,
    title: "Inception",
    year: 2010,
    runtime: "2h 28m",
    rating: 8.4,
    genres: ["Action", "Science Fiction", "Adventure"],
    overview:
      "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: inception.",
    poster: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
  },
  {
    id: 807,
    title: "Se7en",
    year: 1995,
    runtime: "2h 7m",
    rating: 8.3,
    genres: ["Crime", "Mystery", "Thriller"],
    overview:
      'Two homicide detectives are on a desperate hunt for a serial killer whose crimes are based on the "seven deadly sins".',
    poster: "/6yoghtyTpznpBik8EngEmJskVUO.jpg",
  },
  {
    id: 496243,
    title: "Parasite",
    year: 2019,
    runtime: "2h 13m",
    rating: 8.5,
    genres: ["Comedy", "Thriller", "Drama"],
    overview:
      "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    poster: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
  },
  {
    id: 372058,
    title: "Your Name.",
    year: 2016,
    runtime: "1h 46m",
    rating: 8.5,
    genres: ["Romance", "Animation", "Drama"],
    overview:
      "High schoolers Mitsuha and Taki are complete strangers living separate lives. But one night, they suddenly switch places.",
    poster: "/q719jXXEzOoYaps6babgKnONONX.jpg",
  },
  {
    id: 603,
    title: "The Matrix",
    year: 1999,
    runtime: "2h 16m",
    rating: 8.2,
    genres: ["Action", "Science Fiction"],
    overview:
      "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
    poster: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
  },
  {
    id: 324857,
    title: "Spider-Man: Into the Spider-Verse",
    year: 2018,
    runtime: "1h 57m",
    rating: 8.4,
    genres: ["Action", "Adventure", "Animation", "Science Fiction"],
    overview:
      "Miles Morales is juggling both his personal life and his role as Spider-Man when he meets Peter Parker — then gets caught up in an epic adventure.",
    poster: "/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
  },
  {
    id: 508442,
    title: "Soul",
    year: 2020,
    runtime: "1h 41m",
    rating: 8.2,
    genres: ["Animation", "Family", "Comedy", "Fantasy"],
    overview:
      "Joe Gardner is a middle school teacher with a love for jazz music. After an accident, his soul is separated from his body.",
    poster: "/hm58Jw4Lw8OIeECIq5qyPYhAeRJ.jpg",
  },
  {
    id: 872585,
    title: "Oppenheimer",
    year: 2023,
    runtime: "3h 1m",
    rating: 8.1,
    genres: ["Drama", "History"],
    overview:
      "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    poster: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
  },
];
