import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { motionTokens } from "@/lib/motion";

export function HomePage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,color-mix(in_srgb,var(--color-spotlight)_12%,transparent),transparent_55%),linear-gradient(180deg,var(--color-velvet)_0%,var(--color-ink)_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent"
        />

        <div className="relative mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl flex-col justify-center px-5 py-16 sm:px-8 sm:py-24">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionTokens.base, ease: motionTokens.easeOutExpo }}
            className="font-marquee mb-4 text-sm tracking-[0.2em] text-spotlight sm:text-base"
          >
            SCRATCH
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: motionTokens.base,
              delay: 0.06,
              ease: motionTokens.easeOutExpo,
            }}
            className="font-display max-w-3xl text-4xl leading-[1.05] text-balance text-paper sm:text-6xl md:text-7xl"
          >
            Stop scrolling.
            <br />
            Start scratching.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: motionTokens.base,
              delay: 0.12,
              ease: motionTokens.easeOutExpo,
            }}
            className="mt-6 max-w-md text-lg text-muted sm:text-xl"
          >
            Can&apos;t decide what to watch? Let fate pick your next movie.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: motionTokens.base,
              delay: 0.18,
              ease: motionTokens.easeOutExpo,
            }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link to="/lists">
              <Button size="lg">Choose a list</Button>
            </Link>
            <Link to="/lists">
              <Button size="lg" variant="ghost">
                Browse lists
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: motionTokens.reveal, delay: 0.28 }}
            aria-hidden
            className="mt-16 h-px w-full max-w-md bg-gradient-to-r from-foil via-foil-light/50 to-transparent"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: motionTokens.base, delay: 0.35 }}
            className="font-ui mt-4 text-xs tracking-[0.18em] uppercase text-muted"
          >
            Foil · Velvet · One choice
          </motion.p>
        </div>
      </section>
    </div>
  );
}
