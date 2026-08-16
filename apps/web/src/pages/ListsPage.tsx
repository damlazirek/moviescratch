import { useEffect, useState } from "react";
import { ListCard } from "@/components/lists/ListCard";
import { CURATED_LISTS, mergeListVisuals, type ListMeta } from "@/data/lists";
import { fetchLists } from "@/lib/api";
import { useLocale } from "@/lib/i18n/LocaleContext";

export function ListsPage() {
  const { t } = useLocale();
  const [lists, setLists] = useState<ListMeta[]>(CURATED_LISTS);

  useEffect(() => {
    let cancelled = false;
    fetchLists()
      .then((data) => {
        if (!cancelled) setLists(mergeListVisuals(data));
      })
      .catch(() => {
        /* keep curated fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="mb-12 max-w-xl">
        <p className="font-ui mb-3 text-xs tracking-[0.2em] uppercase text-spotlight">
          {t.lists.eyebrow}
        </p>
        <h1 className="font-display text-3xl text-paper sm:text-5xl">
          {t.lists.title}
        </h1>
        <p className="mt-4 text-muted">{t.lists.sub}</p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lists.map((list, index) => (
          <ListCard key={list.id} list={list} index={index} />
        ))}
      </ul>
    </div>
  );
}
