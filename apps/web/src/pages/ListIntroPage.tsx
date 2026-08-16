import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { getListMeta } from "@/data/lists";
import { useLocale } from "@/lib/i18n/LocaleContext";

export function ListIntroPage() {
  const { listId = "" } = useParams();
  const { t, tf } = useLocale();
  const meta = getListMeta(listId);
  const copy = t.listsCopy[listId];
  const name = meta?.name ?? t.intro.listFallback;
  const count = meta?.count ?? 0;
  const line =
    copy?.tagline ?? meta?.tagline ?? t.intro.taglineFallback;
  const wash = meta?.visual.wash;

  return (
    <div className="relative isolate overflow-hidden">
      {wash && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ background: wash }}
        />
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/75 to-ink"
      />

      <div className="relative mx-auto flex min-h-[calc(100dvh-8rem)] max-w-3xl flex-col justify-center px-5 py-16 sm:px-8">
        <p className="font-ui mb-3 text-xs tracking-[0.2em] uppercase text-muted">
          {count
            ? tf(t.intro.titles, { count })
            : t.intro.wallFallback}
        </p>
        <h1 className="font-marquee text-4xl tracking-wide text-paper sm:text-6xl">
          {name}
        </h1>
        <p className="font-display mt-6 text-2xl text-foil-light sm:text-3xl">
          {line}
        </p>
        <p className="mt-4 max-w-md text-muted">{t.intro.body}</p>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link to={`/lists/${listId}/scratch`}>
            <Button size="lg">{t.intro.openWall}</Button>
          </Link>
          <Link to="/lists">
            <Button size="lg" variant="ghost">
              {t.intro.backLists}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
