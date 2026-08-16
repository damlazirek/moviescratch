export type Movie = {
  id: string;
  title: string;
  originalTitle?: string;
  year: number;
  runtime: string;
  rating: number;
  voteCount?: number;
  genres: string[];
  overview: string;
  posterUrl: string | null;
  backdropUrl?: string | null;
  posterWash: string;
};

export const DEFAULT_POSTER_WASH =
  "linear-gradient(160deg, #2a241c 0%, #0b0a09 55%, #1a1410 100%)";
