import { Link } from "react-router-dom";
import { motion } from "motion/react";
import type { ListMeta } from "@/data/lists";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { cn } from "@/lib/cn";
import { motionTokens } from "@/lib/motion";

type ListCardProps = {
  list: ListMeta;
  index?: number;
  className?: string;
};

export function ListCard({ list, index = 0, className }: ListCardProps) {
  const { t, tf } = useLocale();
  const copy = t.listsCopy[list.id];
  const description = copy?.description ?? list.description;

  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: motionTokens.base,
        delay: index * motionTokens.stagger,
        ease: motionTokens.easeOutExpo,
      }}
      className={cn("list-none", className)}
    >
      <Link
        to={`/lists/${list.id}`}
        className="group relative block overflow-hidden border border-line bg-stage outline-none transition-[border-color,transform] duration-[var(--duration-fast)] hover:border-foil/45 focus-visible:border-spotlight"
      >
        <div
          className="relative aspect-[16/10] overflow-hidden"
          style={{ background: list.visual.wash }}
          aria-hidden
        >
          <div className="absolute inset-0 opacity-40 transition-opacity duration-[var(--duration-base)] group-hover:opacity-55 foil-sheen" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,transparent_0%,rgba(11,10,9,0.55)_70%)]" />
          <span className="font-marquee absolute left-4 top-4 text-3xl tracking-[0.12em] text-paper/15 transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:text-paper/25 sm:text-4xl">
            {list.visual.label}
          </span>
          <span
            className="absolute bottom-0 left-0 h-0.5 w-0 transition-[width] duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:w-full"
            style={{ backgroundColor: list.visual.accent }}
          />
        </div>

        <div className="relative p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-marquee text-2xl tracking-wide text-paper">
              {list.name}
            </h2>
            <span className="font-ui shrink-0 text-xs text-muted">
              {tf(t.lists.filmCount, { count: list.count })}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted transition-colors duration-[var(--duration-fast)] group-hover:text-paper/80">
            {description}
          </p>
          <p
            className="font-ui mt-5 text-xs tracking-[0.16em] uppercase opacity-70 transition-opacity duration-[var(--duration-fast)] group-hover:opacity-100"
            style={{ color: list.visual.accent }}
          >
            {t.lists.enter}
          </p>
        </div>
      </Link>
    </motion.li>
  );
}
