/** Motion tokens — keep durations consistent across the app. */
export const motionTokens = {
  instant: 0.12,
  fast: 0.2,
  base: 0.32,
  reveal: 0.7,
  stagger: 0.05,
  easeOutExpo: [0.22, 1, 0.36, 1] as const,
} as const;
