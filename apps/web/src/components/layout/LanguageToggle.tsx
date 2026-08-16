import { useLocale } from "@/lib/i18n/LocaleContext";
import type { Locale } from "@/lib/i18n/messages";
import { cn } from "@/lib/cn";

const OPTIONS: { id: Locale; label: string }[] = [
  { id: "tr", label: "TR" },
  { id: "en", label: "EN" },
];

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      role="group"
      aria-label={t.nav.lang}
      className={cn("flex items-center gap-0.5", className)}
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => setLocale(opt.id)}
          aria-pressed={locale === opt.id}
          className={cn(
            "font-ui px-2 py-1 text-xs tracking-wide transition-colors",
            locale === opt.id
              ? "text-paper"
              : "text-muted hover:text-paper",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
