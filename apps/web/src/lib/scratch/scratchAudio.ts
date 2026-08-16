/**
 * Procedural foil-scratch SFX via Web Audio (no asset files).
 * Soft noise while dragging; short whoosh on full reveal.
 */

let audioCtx: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;
let scratchSource: AudioBufferSourceNode | null = null;
let scratchGain: GainNode | null = null;
let scratchFilter: BiquadFilterNode | null = null;
let running = false;
let lastTick = 0;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  return audioCtx;
}

async function resume(): Promise<AudioContext | null> {
  const ctx = getCtx();
  if (!ctx) return null;
  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch {
      return null;
    }
  }
  return ctx;
}

function makeNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer;
  const duration = 1.2;
  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i += 1) {
    // Brown-ish noise — closer to paper/foil scrape than white hiss
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  noiseBuffer = buffer;
  return buffer;
}

/** Call on first pointerdown (browser autoplay unlock). */
export async function unlockScratchAudio(): Promise<void> {
  await resume();
}

export async function startScratchSound(): Promise<void> {
  if (running) return;
  const ctx = await resume();
  if (!ctx) return;

  const buffer = makeNoiseBuffer(ctx);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1400;
  filter.Q.value = 0.85;

  const gain = ctx.createGain();
  gain.gain.value = 0.0001;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.045, now + 0.04);

  try {
    source.start();
  } catch {
    return;
  }

  scratchSource = source;
  scratchFilter = filter;
  scratchGain = gain;
  running = true;
  lastTick = performance.now();
}

/** intensity 0–1 from stroke speed */
export function updateScratchSound(intensity: number): void {
  if (!running || !scratchGain || !scratchFilter || !audioCtx) return;
  const t = audioCtx.currentTime;
  const i = Math.max(0.05, Math.min(1, intensity));
  const targetGain = 0.018 + i * 0.055;
  const targetFreq = 900 + i * 1600;
  scratchGain.gain.cancelScheduledValues(t);
  scratchGain.gain.setTargetAtTime(targetGain, t, 0.03);
  scratchFilter.frequency.setTargetAtTime(targetFreq, t, 0.04);
}

export function stopScratchSound(): void {
  if (!running) return;
  const ctx = audioCtx;
  const gain = scratchGain;
  const source = scratchSource;
  running = false;
  scratchGain = null;
  scratchFilter = null;
  scratchSource = null;

  if (!ctx || !gain || !source) return;
  const t = ctx.currentTime;
  try {
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    window.setTimeout(() => {
      try {
        source.stop();
      } catch {
        /* already stopped */
      }
      try {
        source.disconnect();
        gain.disconnect();
      } catch {
        /* ignore */
      }
    }, 120);
  } catch {
    try {
      source.stop();
    } catch {
      /* ignore */
    }
  }
}

/** Soft foil peel when card fully reveals */
export function playRevealSound(): void {
  void (async () => {
    const ctx = await resume();
    if (!ctx) return;
    const now = ctx.currentTime;

    const noise = ctx.createBufferSource();
    noise.buffer = makeNoiseBuffer(ctx);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2400, now);
    filter.frequency.exponentialRampToValueAtTime(280, now + 0.35);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    try {
      noise.start(now);
      noise.stop(now + 0.42);
    } catch {
      /* ignore */
    }
  })();
}

/** Map pointer travel to scratch intensity (call from scratchAt). */
export function intensityFromDelta(
  dx: number,
  dy: number,
  dtMs: number,
): number {
  const dt = Math.max(8, dtMs);
  const speed = Math.hypot(dx, dy) / dt; // px per ms
  return Math.min(1, speed * 2.4);
}

export function scratchSoundActive(): boolean {
  return running;
}

export function markScratchTick(): number {
  const now = performance.now();
  const dt = now - lastTick;
  lastTick = now;
  return dt;
}
