/** Tiny Web Audio effects and a looping chiptune soundtrack. */

export const MUTE_KEY = 'kids-maze-muted-v2';

export function loadMuted(): boolean {
  try {
    const raw = localStorage.getItem(MUTE_KEY);
    if (raw === '0') return false;
    if (raw === '1') return true;
  } catch {
    /* ignore */
  }
  return false;
}

export function persistMuted(muted: boolean) {
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  } catch {
    /* ignore */
  }
}

let audioCtx: AudioContext | null = null;
let musicBus: GainNode | null = null;
let musicTimer: number | null = null;
let musicStep = 0;
let nextMusicStepAt = 0;
let musicEnabled = false;
let musicSession = 0;

const MUSIC_BPM = 132;
const MUSIC_STEP_SECONDS = 60 / MUSIC_BPM / 2;
const MUSIC_LOOKAHEAD_SECONDS = 0.25;

// Two cheerful 16-step phrases in C major. Zeroes leave a little breathing room.
const MELODY = [
  659.25, 0, 783.99, 880, 783.99, 659.25, 587.33, 0,
  659.25, 783.99, 987.77, 880, 783.99, 659.25, 587.33, 523.25,
  659.25, 0, 783.99, 880, 1046.5, 987.77, 880, 783.99,
  698.46, 880, 783.99, 698.46, 659.25, 587.33, 523.25, 0,
];

const BASS_ROOTS = [130.81, 98, 110, 87.31, 130.81, 98, 87.31, 98];
const ARPEGGIOS = [
  [523.25, 659.25, 783.99],
  [493.88, 587.33, 783.99],
  [440, 523.25, 659.25],
  [349.23, 440, 523.25],
];

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

function musicTone(
  c: AudioContext,
  destination: AudioNode,
  frequency: number,
  start: number,
  duration: number,
  type: OscillatorType,
  volume: number,
) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function musicKick(c: AudioContext, destination: AudioNode, start: number) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(105, start);
  osc.frequency.exponentialRampToValueAtTime(48, start + 0.09);
  gain.gain.setValueAtTime(0.045, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.11);
  osc.connect(gain);
  gain.connect(destination);
  osc.start(start);
  osc.stop(start + 0.12);
}

function scheduleMusicStep(c: AudioContext, destination: AudioNode, step: number, start: number) {
  const phraseStep = step % MELODY.length;
  const melodyNote = MELODY[phraseStep];

  if (melodyNote) {
    musicTone(c, destination, melodyNote, start, MUSIC_STEP_SECONDS * 0.78, 'triangle', 0.035);
  }

  if (phraseStep % 4 === 0) {
    const bass = BASS_ROOTS[Math.floor(phraseStep / 4)];
    musicTone(c, destination, bass, start, MUSIC_STEP_SECONDS * 3.2, 'sine', 0.04);
    musicKick(c, destination, start);
  }

  if (phraseStep % 2 === 1) {
    const chord = ARPEGGIOS[Math.floor(phraseStep / 8)];
    const note = chord[Math.floor(phraseStep / 2) % chord.length];
    musicTone(c, destination, note * 2, start, MUSIC_STEP_SECONDS * 0.35, 'square', 0.008);
  }

  if (phraseStep === 14 || phraseStep === 30) {
    musicTone(c, destination, 1318.51, start, MUSIC_STEP_SECONDS * 1.5, 'sine', 0.018);
  }
}

function beginMusic(c: AudioContext, session: number) {
  if (!musicEnabled || musicTimer !== null || session !== musicSession) return;

  const bus = c.createGain();
  const now = c.currentTime;
  bus.gain.setValueAtTime(0.0001, now);
  bus.gain.exponentialRampToValueAtTime(0.42, now + 0.35);
  bus.connect(c.destination);
  musicBus = bus;
  musicStep = 0;
  nextMusicStepAt = now + 0.05;

  const schedule = () => {
    if (!musicEnabled || session !== musicSession || musicBus !== bus) return;
    while (nextMusicStepAt < c.currentTime + MUSIC_LOOKAHEAD_SECONDS) {
      scheduleMusicStep(c, bus, musicStep, nextMusicStepAt);
      musicStep = (musicStep + 1) % MELODY.length;
      nextMusicStepAt += MUSIC_STEP_SECONDS;
    }
  };

  schedule();
  musicTimer = window.setInterval(schedule, 100);
}

function startBackgroundMusic() {
  const c = ctx();
  if (!c || musicTimer !== null) return;
  const session = musicSession;

  if (c.state === 'running') {
    beginMusic(c, session);
    return;
  }

  void c.resume().then(() => beginMusic(c, session)).catch(() => {
    /* A later pointer or key gesture will try again. */
  });
}

function stopBackgroundMusic() {
  musicSession += 1;
  if (musicTimer !== null) {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }
  if (musicBus && audioCtx) {
    const bus = musicBus;
    const now = audioCtx.currentTime;
    bus.gain.cancelScheduledValues(now);
    bus.gain.setValueAtTime(Math.max(bus.gain.value, 0.0001), now);
    bus.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    window.setTimeout(() => bus.disconnect(), 180);
    musicBus = null;
  }
}

export function setBackgroundMusicEnabled(enabled: boolean) {
  musicEnabled = enabled;
  if (enabled) startBackgroundMusic();
  else stopBackgroundMusic();
}

function unlockMusic() {
  if (musicEnabled && musicTimer === null) startBackgroundMusic();
}

if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', unlockMusic);
  window.addEventListener('keydown', unlockMusic);
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

export function playCoin(muted: boolean) {
  if (muted) return;
  tone(880, 0.08, 'triangle', 0.055);
  tone(1320, 0.13, 'sine', 0.045, 0.07);
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
