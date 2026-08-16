const DB_NAME = "scratch-poster-wall";
const DB_VERSION = 1;
const STORE = "cards";

export type CardScratchRecord = {
  key: string; // listId:movieId
  revealed: boolean;
  /** PNG data URL of the foil canvas (partial progress) */
  maskDataUrl?: string;
  updatedAt: number;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "key" });
      }
    };
  });
}

export function cardKey(listId: string, movieId: string) {
  return `${listId}:${movieId}`;
}

export async function getCardRecord(key: string): Promise<CardScratchRecord | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve((req.result as CardScratchRecord) ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function putCardRecord(record: CardScratchRecord): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getRevealedIdsForList(listId: string): Promise<string[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => {
      const rows = (req.result as CardScratchRecord[]) ?? [];
      const prefix = `${listId}:`;
      resolve(
        rows
          .filter((r) => r.revealed && r.key.startsWith(prefix))
          .map((r) => r.key.slice(prefix.length)),
      );
    };
    req.onerror = () => reject(req.error);
  });
}

export async function markRevealed(listId: string, movieId: string): Promise<void> {
  const key = cardKey(listId, movieId);
  await putCardRecord({
    key,
    revealed: true,
    maskDataUrl: undefined,
    updatedAt: Date.now(),
  });
}

export async function saveMask(
  listId: string,
  movieId: string,
  maskDataUrl: string,
): Promise<void> {
  const key = cardKey(listId, movieId);
  const existing = await getCardRecord(key);
  if (existing?.revealed) return;
  await putCardRecord({
    key,
    revealed: false,
    maskDataUrl,
    updatedAt: Date.now(),
  });
}

/** Wipe foil masks + revealed state for one list. */
export async function clearListProgress(listId: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const req = store.getAllKeys();
    req.onsuccess = () => {
      const prefix = `${listId}:`;
      const keys = (req.result as IDBValidKey[]).filter(
        (k) => typeof k === "string" && k.startsWith(prefix),
      );
      for (const key of keys) {
        store.delete(key);
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
