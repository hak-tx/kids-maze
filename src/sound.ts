/** Tiny Web Audio beeps. Stay silent unless the player unmutes. */

export const MUTE_KEY = 'kids-maze-muted';

export function loadMuted(): boolean {
  try {
    const raw = localStorage.getItem(MUTE_KEY);
    if (raw === '0') return false;
    if (raw === '1') return true;
  } catch {
    /* ignore */
  }
  return true;
}

export function persistMuted(muted: boolean) {
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  } catch {
    /* ignore */
  }
}

let audioCtx: AudioContext | null = null;

function ctx(): AudioContext | null {
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  return audioCtx;
}

function tone(
  frequency: number,
  duration: number,
  type: OscillatorType,
  gainValue: number,
  delay = 0,
) {
  const c = ctx();
  if (!c) return;
  if (c.state === 'suspended') void c.resume();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  const t0 = c.currentTime + delay;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(gainValue, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

let lastMoveAt = 0;

export function playMove(muted: boolean) {
  if (muted) return;
  const now = performance.now();
  if (now - lastMoveAt < 70) return;
  lastMoveAt = now;
  tone(620, 0.07, 'triangle', 0.05);
}

export function playHint(muted: boolean) {
  if (muted) return;
  tone(740, 0.1, 'sine', 0.05);
  tone(980, 0.12, 'sine', 0.04, 0.08);
}

export function playWin(muted: boolean) {
  if (muted) return;
  tone(523, 0.14, 'triangle', 0.06, 0);
  tone(659, 0.14, 'triangle', 0.06, 0.11);
  tone(784, 0.18, 'triangle', 0.07, 0.22);
  tone(1046, 0.28, 'sine', 0.05, 0.36);
}

export function playTap(muted: boolean) {
  if (muted) return;
  tone(480, 0.05, 'sine', 0.04);
}
