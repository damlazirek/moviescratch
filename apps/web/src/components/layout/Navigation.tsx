import { NavLink } from "react-router-dom";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { cn } from "@/lib/cn";

export function Navigation() {
  const { t } = useLocale();
  const links = [
    { to: "/", label: t.nav.home, end: true },
    { to: "/lists", label: t.nav.lists, end: false },
    { to: "/watched", label: t.nav.watched, end: false },
  ] as const;

  return (
    <header className="relative z-20 border-b border-line/80 bg-ink/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <NavLink to="/" className="font-marquee text-2xl text-paper tracking-[0.08em]">
          SCRATCH
        </NavLink>

        <div className="flex items-center gap-2 sm:gap-4">
          <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    "font-ui px-3 py-2 text-sm tracking-wide text-muted transition-colors duration-[var(--duration-fast)] hover:text-paper",
                    isActive && "text-paper",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
