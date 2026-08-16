import { forwardRef, useId } from "react";
import { cn } from "@/lib/cn";

type ScratchCoinProps = {
  visible?: boolean;
  pressing?: boolean;
  className?: string;
};

/**
 * Small cinematic scratching coin — follows pointer via transform (ref).
 * Keep it small: a real coin over a card, not a giant UI cursor.
 */
export const ScratchCoin = forwardRef<HTMLDivElement, ScratchCoinProps>(
  function ScratchCoin({ visible = false, pressing = false, className }, ref) {
    const uid = useId().replace(/:/g, "");
    const face = `coin-face-${uid}`;
    const rim = `coin-rim-${uid}`;
    const shine = `coin-shine-${uid}`;

    return (
      <div
        ref={ref}
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-[20]",
          "will-change-transform",
          "transition-[opacity,filter] duration-150 ease-out",
          visible ? "opacity-100" : "opacity-0",
          className,
        )}
        style={{
          width: 40,
          height: 40,
          filter: pressing
            ? "drop-shadow(0 3px 4px rgba(0,0,0,0.55))"
            : "drop-shadow(0 5px 8px rgba(0,0,0,0.45))",
        }}
      >
        <svg
          viewBox="0 0 40 40"
          width="40"
          height="40"
          className="block overflow-visible max-[640px]:origin-center"
        >
          <defs>
            <linearGradient id={face} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d8c49a" />
              <stop offset="35%" stopColor="#b8955a" />
              <stop offset="70%" stopColor="#9a7540" />
              <stop offset="100%" stopColor="#c4a66a" />
            </linearGradient>
            <linearGradient id={rim} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ead9b0" />
              <stop offset="50%" stopColor="#8a6838" />
              <stop offset="100%" stopColor="#c9ae78" />
            </linearGradient>
            <radialGradient id={shine} cx="32%" cy="28%" r="55%">
              <stop offset="0%" stopColor="rgba(255,248,230,0.55)" />
              <stop offset="45%" stopColor="rgba(255,248,230,0.08)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>

          <circle cx="20" cy="21.5" r="17.5" fill={`url(#${rim})`} opacity="0.85" />
          <circle cx="20" cy="20" r="17.2" fill={`url(#${face})`} />
          <circle
            cx="20"
            cy="20"
            r="15.2"
            fill="none"
            stroke="#6e542c"
            strokeWidth="0.7"
            opacity="0.55"
          />
          <circle
            cx="20"
            cy="20"
            r="13.6"
            fill="none"
            stroke="#e8d6ae"
            strokeWidth="0.45"
            opacity="0.35"
          />

          <circle cx="20" cy="20" r="4.2" fill="none" stroke="#5a4528" strokeWidth="1.1" />
          <circle cx="20" cy="20" r="1.5" fill="#5a4528" />
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <circle
                key={deg}
                cx={20 + Math.cos(rad) * 7.2}
                cy={20 + Math.sin(rad) * 7.2}
                r="1.35"
                fill="#5a4528"
                opacity="0.85"
              />
            );
          })}

          <circle cx="20" cy="20" r="17.2" fill={`url(#${shine})`} />
        </svg>
      </div>
    );
  },
);
