import { Link } from "react-router-dom";
import { ListCard } from "@/components/lists/ListCard";
import { Button } from "@/components/ui/Button";
import { getFeaturedLists } from "@/data/lists";
import { useLocale } from "@/lib/i18n/LocaleContext";

export function FeaturedLists() {
  const { t } = useLocale();
  const lists = getFeaturedLists();

  return (
    <section className="border-t border-line bg-ink">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-lg">
            <p className="font-ui mb-3 text-xs tracking-[0.2em] uppercase text-spotlight">
              {t.featured.eyebrow}
            </p>
            <h2 className="font-display text-3xl text-paper sm:text-4xl">
              {t.featured.title}
            </h2>
            <p className="mt-3 text-muted">{t.featured.sub}</p>
          </div>
          <Link to="/lists">
            <Button variant="ghost">{t.featured.seeAll}</Button>
          </Link>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((list, index) => (
            <ListCard key={list.id} list={list} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
