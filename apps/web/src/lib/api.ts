const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export type CuratedList = {
  id: string;
  name: string;
  slug: string;
  count: number;
  description: string;
  mood: string;
};

export async function fetchLists(): Promise<CuratedList[]> {
  const response = await fetch(`${API_BASE}/lists`);
  if (!response.ok) {
    throw new Error("Failed to load lists");
  }
  const data = (await response.json()) as { lists: CuratedList[] };
  return data.lists;
}
