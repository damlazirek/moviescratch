import type { CuratedList } from "@/lib/api";

export type ListVisual = {
  accent: string;
  wash: string;
  label: string;
};

export type ListMeta = CuratedList & {
  visual: ListVisual;
  featured?: boolean;
  tagline: string;
};

const VISUALS: Record<string, ListVisual & { featured?: boolean; tagline: string }> = {
  "imdb-top": {
    accent: "#E8C47A",
    wash: "linear-gradient(160deg, #2A2118 0%, #0B0A09 55%, #1A1510 100%)",
    label: "CANON",
    featured: true,
    tagline: "100 films. One poster wall.",
  },
  "oscar-winners": {
    accent: "#D4B56A",
    wash: "linear-gradient(160deg, #3A2A18 0%, #120E0A 50%, #1F1812 100%)",
    label: "GOLD",
    featured: true,
    tagline: "The gold list. One scratch.",
  },
  "turkish-cinema": {
    accent: "#C45A3A",
    wash: "linear-gradient(160deg, #2A1810 0%, #0B0A09 55%, #1A120E 100%)",
    label: "ANADOLU",
    featured: true,
    tagline: "Local wall. One scratch.",
  },
  "best-horror": {
    accent: "#A84848",
    wash: "linear-gradient(160deg, #2A1214 0%, #0B0A09 55%, #1A0E10 100%)",
    label: "FEAR",
    featured: true,
    tagline: "Don't look away. Scratch.",
  },
  "best-sci-fi": {
    accent: "#7A9BB0",
    wash: "linear-gradient(160deg, #121820 0%, #0B0A09 55%, #101418 100%)",
    label: "SPACE",
    tagline: "Other worlds. One ticket.",
  },
  "best-animation": {
    accent: "#6BA88A",
    wash: "linear-gradient(160deg, #142018 0%, #0B0A09 55%, #101814 100%)",
    label: "FRAME",
    featured: true,
    tagline: "Every frame a world.",
  },
  "best-action": {
    accent: "#C45A3A",
    wash: "linear-gradient(160deg, #2A1410 0%, #0B0A09 55%, #1A100E 100%)",
    label: "PULSE",
    tagline: "Scratch. Detonate.",
  },
  "best-comedy": {
    accent: "#C4A05A",
    wash: "linear-gradient(160deg, #2A2214 0%, #0B0A09 55%, #1A1810 100%)",
    label: "LAUGH",
    tagline: "Foil under laughs.",
  },
  "best-romance": {
    accent: "#B06A7A",
    wash: "linear-gradient(160deg, #241418 0%, #0B0A09 55%, #1A1014 100%)",
    label: "HEART",
    tagline: "One scratch. One story.",
  },
  "best-crime": {
    accent: "#6A6A72",
    wash: "linear-gradient(160deg, #18181C 0%, #0B0A09 55%, #121214 100%)",
    label: "NOIR",
    tagline: "Crime wall. Scratch.",
  },
  "best-thriller": {
    accent: "#8A5A4A",
    wash: "linear-gradient(160deg, #1C1410 0%, #0B0A09 55%, #14100E 100%)",
    label: "TENSE",
    tagline: "Tension under foil.",
  },
  "best-war": {
    accent: "#8A8478",
    wash: "linear-gradient(160deg, #1A1814 0%, #0B0A09 55%, #141210 100%)",
    label: "FRONT",
    tagline: "Remember. Scratch.",
  },
  "best-fantasy": {
    accent: "#7A6AA0",
    wash: "linear-gradient(160deg, #181420 0%, #0B0A09 55%, #121018 100%)",
    label: "MYTH",
    tagline: "Other realms. One scratch.",
  },
  "nolan-essentials": {
    accent: "#C4B8A0",
    wash: "linear-gradient(160deg, #1A1A1C 0%, #0B0A09 50%, #141416 100%)",
    label: "TIME",
    tagline: "Time folds. You scratch.",
  },
  "tarantino-essentials": {
    accent: "#A84838",
    wash: "linear-gradient(160deg, #2A1410 0%, #0B0A09 55%, #1A100E 100%)",
    label: "PULP",
    tagline: "One director. One wall.",
  },
  "miyazaki-essentials": {
    accent: "#5A8A9A",
    wash: "linear-gradient(160deg, #142028 0%, #0B0A09 55%, #101820 100%)",
    label: "WIND",
    tagline: "Ghibli spirit. Scratch.",
  },
  "spielberg-essentials": {
    accent: "#C4A86A",
    wash: "linear-gradient(160deg, #221C12 0%, #0B0A09 55%, #181410 100%)",
    label: "WONDER",
    tagline: "Blockbuster ritual.",
  },
  "90s-classics": {
    accent: "#C47A4A",
    wash: "linear-gradient(160deg, #2A1A12 0%, #0B0A09 55%, #1A1410 100%)",
    label: "VHS",
    tagline: "Rewind the decade. Scratch once.",
  },
  "2000s-classics": {
    accent: "#8A9A6A",
    wash: "linear-gradient(160deg, #1A1C14 0%, #0B0A09 55%, #141610 100%)",
    label: "Y2K",
    tagline: "2000–2009. Scratch.",
  },
  "2010s-hits": {
    accent: "#6A8AB0",
    wash: "linear-gradient(160deg, #141820 0%, #0B0A09 55%, #101418 100%)",
    label: "TEN",
    tagline: "2010–2019 wall.",
  },
};

const LIST_DEFS: Array<{
  id: string;
  name: string;
  count: number;
  mood: string;
  featured?: boolean;
}> = [
  { id: "imdb-top", name: "IMDb Top 100", count: 100, mood: "prestige", featured: true },
  { id: "oscar-winners", name: "Oscar Winners", count: 27, mood: "ceremony", featured: true },
  { id: "turkish-cinema", name: "Turkish Cinema", count: 40, mood: "local", featured: true },
  { id: "best-horror", name: "Best Horror", count: 40, mood: "horror", featured: true },
  { id: "best-sci-fi", name: "Best Sci-Fi", count: 40, mood: "scifi" },
  { id: "best-animation", name: "Best Animation", count: 40, mood: "animation", featured: true },
  { id: "best-action", name: "Best Action", count: 40, mood: "action" },
  { id: "best-comedy", name: "Best Comedy", count: 40, mood: "comedy" },
  { id: "best-romance", name: "Best Romance", count: 36, mood: "romance" },
  { id: "best-crime", name: "Best Crime", count: 40, mood: "crime" },
  { id: "best-thriller", name: "Best Thriller", count: 40, mood: "crime" },
  { id: "best-war", name: "Best War", count: 36, mood: "war" },
  { id: "best-fantasy", name: "Best Fantasy", count: 36, mood: "fantasy" },
  { id: "nolan-essentials", name: "Nolan Essentials", count: 12, mood: "nolan" },
  { id: "tarantino-essentials", name: "Tarantino Essentials", count: 12, mood: "director" },
  { id: "miyazaki-essentials", name: "Miyazaki Essentials", count: 12, mood: "director" },
  { id: "spielberg-essentials", name: "Spielberg Essentials", count: 16, mood: "director" },
  { id: "90s-classics", name: "90s Classics", count: 36, mood: "retro" },
  { id: "2000s-classics", name: "2000s Classics", count: 36, mood: "retro" },
  { id: "2010s-hits", name: "2010s Hits", count: 36, mood: "prestige" },
];

export const CURATED_LISTS: ListMeta[] = LIST_DEFS.map((def) => {
  const visual = VISUALS[def.id]!;
  return {
    id: def.id,
    name: def.name,
    slug: def.id,
    count: def.count,
    description: visual.tagline,
    mood: def.mood,
    tagline: visual.tagline,
    visual,
    featured: def.featured ?? visual.featured,
  };
});

export function getListMeta(id: string): ListMeta | undefined {
  return CURATED_LISTS.find((list) => list.id === id);
}

export function getFeaturedLists(): ListMeta[] {
  return CURATED_LISTS.filter((list) => list.featured);
}

export function mergeListVisuals(lists: CuratedList[]): ListMeta[] {
  return lists.map((list) => {
    const meta = getListMeta(list.id);
    const visualPack = VISUALS[list.id];
    return {
      ...list,
      featured: meta?.featured,
      tagline:
        list.tagline ||
        visualPack?.tagline ||
        meta?.tagline ||
        "Pick a card. Meet a film.",
      visual:
        visualPack ??
        meta?.visual ?? {
          accent: "#E8C47A",
          wash: "linear-gradient(160deg, #1A1214 0%, #0B0A09 100%)",
          label: "LIST",
        },
    };
  });
}
