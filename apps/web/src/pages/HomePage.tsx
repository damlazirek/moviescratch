import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { FeaturedLists } from "@/components/home/FeaturedLists";
import { ScratchTeaser } from "@/components/home/ScratchTeaser";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { motionTokens } from "@/lib/motion";

export function HomePage() {
  const { t } = useLocale();

  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,color-mix(in_srgb,var(--color-spotlight)_10%,transparent),transparent_50%),linear-gradient(180deg,var(--color-velvet)_0%,var(--color-ink)_72%)]"
        />

        <div className="relative mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: motionTokens.base, ease: motionTokens.easeOutExpo }}
              className="font-marquee mb-4 text-sm tracking-[0.2em] text-spotlight sm:text-base"
            >
              {t.home.brand}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: motionTokens.base,
                delay: 0.06,
                ease: motionTokens.easeOutExpo,
              }}
              className="font-display max-w-xl text-4xl leading-[1.05] text-balance text-paper sm:text-5xl lg:text-6xl"
            >
              {t.home.headlineLine1}
              <br />
              {t.home.headlineLine2}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: motionTokens.base,
                delay: 0.12,
                ease: motionTokens.easeOutExpo,
              }}
              className="mt-5 max-w-md text-lg text-muted"
            >
              {t.home.sub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: motionTokens.base,
                delay: 0.18,
                ease: motionTokens.easeOutExpo,
              }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link to="/lists">
                <Button size="lg">{t.home.chooseList}</Button>
              </Link>
              <a href="#featured">
                <Button size="lg" variant="ghost">
                  {t.home.featuredCta}
                </Button>
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: motionTokens.reveal,
              delay: 0.16,
              ease: motionTokens.easeOutExpo,
            }}
            className="h-full min-h-[340px] lg:min-h-[480px]"
          >
            <ScratchTeaser />
          </motion.div>
        </div>
      </section>

      <div id="featured">
        <FeaturedLists />
      </div>
    </div>
  );
}
