// Twin Tides — Spot the Difference
// audio.js — WebAudio chimes, synthesized live. No sound files, no network.

export class SoundBank {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.ctx = new AC();
      } catch {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  // One short tone: frequency, start delay, length, waveform, volume.
  tone(freq, delay, dur, type, vol) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  click() {
    this.tone(660, 0, 0.07, 'triangle', 0.12);
  }

  found() {
    this.tone(880, 0, 0.12, 'sine', 0.22);
    this.tone(1318, 0.09, 0.2, 'sine', 0.22);
    this.tone(1760, 0.18, 0.28, 'sine', 0.16);
  }

  miss() {
    this.tone(180, 0, 0.22, 'sawtooth', 0.12);
    this.tone(140, 0.1, 0.26, 'sawtooth', 0.1);
  }

  hint() {
    this.tone(1046, 0, 0.1, 'triangle', 0.16);
    this.tone(1568, 0.08, 0.16, 'triangle', 0.14);
  }

  roundClear() {
    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, i * 0.11, 0.22, 'sine', 0.2));
  }

  win() {
    [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => this.tone(f, i * 0.13, 0.3, 'sine', 0.2));
  }

  gameOver() {
    [392, 330, 262].forEach((f, i) => this.tone(f, i * 0.16, 0.3, 'triangle', 0.16));
  }
}
