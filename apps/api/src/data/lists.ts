export type ListMood =
  | "prestige"
  | "ceremony"
  | "horror"
  | "scifi"
  | "nolan"
  | "retro"
  | "action"
  | "comedy"
  | "romance"
  | "crime"
  | "animation"
  | "war"
  | "fantasy"
  | "director"
  | "local";

export type CuratedListDef = {
  id: string;
  name: string;
  slug: string;
  count: number;
  description: string;
  mood: ListMood;
  tagline: string;
  /** How to resolve the movie pool from TMDB */
  strategy:
    | { type: "top_rated"; pages: number }
    | {
        type: "discover";
        with_genres?: string;
        with_original_language?: string;
        vote_count_gte?: number;
        primary_release_date_gte?: string;
        primary_release_date_lte?: string;
        pages: number;
      }
    | { type: "person"; personId: number }
    | { type: "curated"; ids: number[] };
};

/** Hand-picked TMDB ids for lists that need editorial control. */
const OSCAR_WINNERS = [
  496243, 76203, 77338, 313369, 194662, 152601, 68718, 453, 14, 289, 745, 597,
  78, 424, 13, 550, 680, 155, 489, 11216, 278, 389, 122, 769, 807, 129, 497,
];

const NOLAN_ESSENTIALS = [
  27205, 155, 49026, 49051, 157336, 872585, 1412, 1124, 2080, 63, 272, 374720,
];

export const CURATED_LISTS: CuratedListDef[] = [
  {
    id: "imdb-top",
    name: "IMDb Top 100",
    slug: "imdb-top",
    count: 100,
    description: "Duvarı kazı. İzlediklerini takip et.",
    mood: "prestige",
    tagline: "100 film. Tek poster duvarı.",
    strategy: { type: "top_rated", pages: 5 },
  },
  {
    id: "oscar-winners",
    name: "Oscar Winners",
    slug: "oscar-winners",
    count: OSCAR_WINNERS.length,
    description: "Altın heykeller. Kader yine seçer.",
    mood: "ceremony",
    tagline: "Altın liste. Bir kazıma.",
    strategy: { type: "curated", ids: OSCAR_WINNERS },
  },
  {
    id: "turkish-cinema",
    name: "Turkish Cinema",
    slug: "turkish-cinema",
    count: 40,
    description: "Yerli afişler. Foil altında Anadolu.",
    mood: "local",
    tagline: "Yerli duvar. Bir kazıma.",
    strategy: {
      type: "discover",
      with_original_language: "tr",
      vote_count_gte: 80,
      pages: 2,
    },
  },
  {
    id: "best-horror",
    name: "Best Horror",
    slug: "best-horror",
    count: 40,
    description: "Işıklar kısılsın. Nabız yükselsin.",
    mood: "horror",
    tagline: "Gözünü ayırma. Kazı.",
    strategy: { type: "discover", with_genres: "27", pages: 2 },
  },
  {
    id: "best-sci-fi",
    name: "Best Sci-Fi",
    slug: "best-sci-fi",
    count: 40,
    description: "Başka dünyalar. Tek bilet.",
    mood: "scifi",
    tagline: "Başka dünyalar. Tek bilet.",
    strategy: { type: "discover", with_genres: "878", pages: 2 },
  },
  {
    id: "best-animation",
    name: "Best Animation",
    slug: "best-animation",
    count: 40,
    description: "Çizgi değil. Sinema.",
    mood: "animation",
    tagline: "Her kare bir dünya.",
    strategy: { type: "discover", with_genres: "16", pages: 2 },
  },
  {
    id: "best-action",
    name: "Best Action",
    slug: "best-action",
    count: 40,
    description: "Nabız yüksek. Foil ince.",
    mood: "action",
    tagline: "Kazı. Patlasın.",
    strategy: { type: "discover", with_genres: "28", pages: 2 },
  },
  {
    id: "best-comedy",
    name: "Best Comedy",
    slug: "best-comedy",
    count: 40,
    description: "Gülmek de bir ritüel.",
    mood: "comedy",
    tagline: "Foil altında kahkaha.",
    strategy: { type: "discover", with_genres: "35", pages: 2 },
  },
  {
    id: "best-romance",
    name: "Best Romance",
    slug: "best-romance",
    count: 36,
    description: "Kalp kazınır.",
    mood: "romance",
    tagline: "Bir kazıma. Bir hikâye.",
    strategy: { type: "discover", with_genres: "10749", pages: 2 },
  },
  {
    id: "best-crime",
    name: "Best Crime",
    slug: "best-crime",
    count: 40,
    description: "Karanlık sokaklar. Parlak foil.",
    mood: "crime",
    tagline: "Suç duvarı. Kazı.",
    strategy: { type: "discover", with_genres: "80", pages: 2 },
  },
  {
    id: "best-thriller",
    name: "Best Thriller",
    slug: "best-thriller",
    count: 40,
    description: "Nefesini tut. Kazı.",
    mood: "crime",
    tagline: "Gerilim foil altında.",
    strategy: { type: "discover", with_genres: "53", pages: 2 },
  },
  {
    id: "best-war",
    name: "Best War",
    slug: "best-war",
    count: 36,
    description: "Savaşın ağırlığı. Duvarın sessizliği.",
    mood: "war",
    tagline: "Hatırla. Kazı.",
    strategy: { type: "discover", with_genres: "10752", pages: 2 },
  },
  {
    id: "best-fantasy",
    name: "Best Fantasy",
    slug: "best-fantasy",
    count: 36,
    description: "Ejderhalar, halkalar, foil.",
    mood: "fantasy",
    tagline: "Başka diyar. Bir kazıma.",
    strategy: { type: "discover", with_genres: "14", pages: 2 },
  },
  {
    id: "nolan-essentials",
    name: "Nolan Essentials",
    slug: "nolan-essentials",
    count: NOLAN_ESSENTIALS.length,
    description: "Zaman katlanır. Sen kazırsın.",
    mood: "nolan",
    tagline: "Zaman katlanır. Sen kazırsın.",
    strategy: { type: "curated", ids: NOLAN_ESSENTIALS },
  },
  {
    id: "tarantino-essentials",
    name: "Tarantino Essentials",
    slug: "tarantino-essentials",
    count: 12,
    description: "Diyalog. Kan. Foil.",
    mood: "director",
    tagline: "Bir yönetmen. Bir duvar.",
    strategy: { type: "person", personId: 138 },
  },
  {
    id: "miyazaki-essentials",
    name: "Miyazaki Essentials",
    slug: "miyazaki-essentials",
    count: 12,
    description: "Rüzgar eser. Foil açılır.",
    mood: "director",
    tagline: "Ghibli ruhu. Kazı.",
    strategy: { type: "person", personId: 608 },
  },
  {
    id: "spielberg-essentials",
    name: "Spielberg Essentials",
    slug: "spielberg-essentials",
    count: 16,
    description: "Hayret. Merak. Foil.",
    mood: "director",
    tagline: "Blockbuster ritüeli.",
    strategy: { type: "person", personId: 488 },
  },
  {
    id: "90s-classics",
    name: "90s Classics",
    slug: "90s-classics",
    count: 36,
    description: "VHS enerjisi. Foil kaderi.",
    mood: "retro",
    tagline: "On yılı geri sar. Bir kez kazı.",
    strategy: {
      type: "discover",
      primary_release_date_gte: "1990-01-01",
      primary_release_date_lte: "1999-12-31",
      pages: 2,
    },
  },
  {
    id: "2000s-classics",
    name: "2000s Classics",
    slug: "2000s-classics",
    count: 36,
    description: "Yeni milenyum. Eski foil hissi.",
    mood: "retro",
    tagline: "2000–2009. Kazı.",
    strategy: {
      type: "discover",
      primary_release_date_gte: "2000-01-01",
      primary_release_date_lte: "2009-12-31",
      pages: 2,
    },
  },
  {
    id: "2010s-hits",
    name: "2010s Hits",
    slug: "2010s-hits",
    count: 36,
    description: "Son on yılın parıltısı.",
    mood: "prestige",
    tagline: "2010–2019 duvarı.",
    strategy: {
      type: "discover",
      primary_release_date_gte: "2010-01-01",
      primary_release_date_lte: "2019-12-31",
      pages: 2,
    },
  },
];

export function getListDef(id: string): CuratedListDef | undefined {
  return CURATED_LISTS.find((list) => list.id === id);
}
