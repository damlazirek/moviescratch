import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "ticket";
  size?: "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "font-ui inline-flex items-center justify-center gap-2 tracking-wide transition-colors duration-[var(--duration-fast)] disabled:opacity-50",
        size === "md" && "px-5 py-2.5 text-sm",
        size === "lg" && "px-7 py-3.5 text-base",
        variant === "primary" &&
          "bg-spotlight text-ink hover:bg-[color-mix(in_srgb,var(--color-spotlight)_88%,white)]",
        variant === "ghost" &&
          "border border-line bg-transparent text-paper hover:border-foil-light/40 hover:text-paper",
        variant === "ticket" &&
          "bg-ticket text-paper hover:bg-[color-mix(in_srgb,var(--color-ticket)_90%,white)]",
        className,
      )}
      {...props}
    />
  );
}
