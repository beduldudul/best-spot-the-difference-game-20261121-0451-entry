// Tiny sounds, made with the Web Audio API and no files at all: a two-note
// chime for a find, a low buzz for a miss, a rising arpeggio for a win, and a
// soft tick for a plain click. Muted until the player turns sound on, and
// silent when the browser has no audio.

export function createAudio() {
  let context = null;
  let muted = false;
  let enabled = false;

  function ensure() {
    if (!context) {
      const AudioContext = window.AudioContext ?? window.webkitAudioContext;
      if (!AudioContext) return null;
      context = new AudioContext();
    }
    if (context.state === 'suspended') context.resume();
    return context;
  }

  function tone(freq, start, length, type, gain) {
    if (muted || !enabled) return;
    const audio = ensure();
    if (!audio) return;
    const osc = audio.createOscillator();
    const amp = audio.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    amp.gain.setValueAtTime(0, audio.currentTime + start);
    amp.gain.linearRampToValueAtTime(gain, audio.currentTime + start + 0.01);
    amp.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + start + length);
    osc.connect(amp);
    amp.connect(audio.destination);
    osc.start(audio.currentTime + start);
    osc.stop(audio.currentTime + start + length + 0.05);
  }

  return {
    unlock() {
      enabled = true;
      ensure();
    },
    toggleMute() {
      muted = !muted;
      return muted;
    },
    isMuted() {
      return muted;
    },
    found() {
      tone(660, 0, 0.16, 'sine', 0.18);
      tone(880, 0.09, 0.22, 'sine', 0.18);
    },
    wrong() {
      tone(140, 0, 0.22, 'sawtooth', 0.08);
    },
    hint() {
      tone(520, 0, 0.14, 'triangle', 0.12);
    },
    win() {
      [523, 659, 784, 1047].forEach((freq, i) => tone(freq, i * 0.11, 0.3, 'sine', 0.16));
    },
    click() {
      tone(440, 0, 0.06, 'triangle', 0.06);
    },
  };
}
