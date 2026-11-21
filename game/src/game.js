// Twin Tides — Spot the Difference
// game.js — the rules, and nothing but the rules. No DOM, no canvas: this file
// runs in Node for tests as well as in the browser. State, scoring, timer,
// hearts, hints, streaks and round flow all live here.

import { BEST_KEY, RULES } from './config.js';
import { ROUNDS, buildFlags } from './scenes.js';

export const SCREENS = ['title', 'play', 'paused', 'roundClear', 'win', 'gameOver'];

function loadBest() {
  try {
    if (typeof localStorage === 'undefined') return 0;
    return Number(localStorage.getItem(BEST_KEY) || 0) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Best score is a nicety; a blocked storage must never break the game.
  }
}

export class TwinTidesGame {
  constructor() {
    this.screen = 'title';
    this.roundIndex = 0;
    this.found = new Set();
    this.hearts = RULES.hearts;
    this.timeLeft = RULES.timerStart;
    this.score = 0;
    this.best = loadBest();
    this.streak = 0;
    this.hintCooldown = 0;
    this.hintFlash = null; // { diff, until } — until is seconds of round time left
    this.lastFound = null; // { diff, at } — at is seconds of round time left
    this.message = 'Find 7 differences in each picture. Click one — on either side.';
    this.roundClearBonus = 0;
    this.totalFound = 0;
    this.muted = false;
  }

  get round() {
    return ROUNDS[this.roundIndex];
  }

  get foundCount() {
    return this.found.size;
  }

  get remaining() {
    return RULES.differencesPerRound - this.found.size;
  }

  get flagsA() {
    return buildFlags(this.roundIndex, false);
  }

  get flagsB() {
    return buildFlags(this.roundIndex, true);
  }

  // Prepare a round's board without changing the screen (used by the title
  // screen and by screenshot staging).
  prepareRound(index) {
    this.roundIndex = index;
    this.found = new Set();
    this.hearts = RULES.hearts;
    this.timeLeft = RULES.timerStart;
    this.streak = 0;
    this.hintCooldown = 0;
    this.hintFlash = null;
    this.lastFound = null;
    this.roundClearBonus = 0;
  }

  startGame() {
    this.score = 0;
    this.totalFound = 0;
    this.prepareRound(0);
    this.screen = 'play';
    this.message = `Round 1 — ${this.round.name}. Find all 7 differences!`;
  }

  startRound(index) {
    this.prepareRound(index);
    this.screen = 'play';
    this.message = `Round ${index + 1} — ${this.round.name}. Find all 7 differences!`;
  }

  retryRound() {
    this.startRound(this.roundIndex);
  }

  nextRound() {
    if (this.roundIndex + 1 >= ROUNDS.length) {
      this.finishWin();
      return;
    }
    this.startRound(this.roundIndex + 1);
  }

  finishWin() {
    this.screen = 'win';
    if (this.score > this.best) {
      this.best = this.score;
      saveBest(this.best);
    }
    this.message = 'You found every difference in all three scenes!';
  }

  // Advance the clock by dt seconds. Only ticks while playing.
  tick(dt) {
    if (this.screen !== 'play') return;
    this.timeLeft -= dt;
    if (this.hintCooldown > 0) this.hintCooldown = Math.max(0, this.hintCooldown - dt);
    if (this.hintFlash && this.timeLeft <= this.hintFlash.until - RULES.hintFlash) this.hintFlash = null;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.screen = 'gameOver';
      this.message = `Time ran out in ${this.round.name}. Press R to retry the round.`;
    }
  }

  // A click at panel-local coordinates (either panel — the pictures are twins).
  // Returns { type: 'found'|'miss'|'ignored', diff?, points? }.
  clickAt(x, y) {
    if (this.screen !== 'play') return { type: 'ignored' };
    const hit = this.round.diffs.find(
      (d) => !this.found.has(d.id) && (x - d.x) * (x - d.x) + (y - d.y) * (y - d.y) <= d.r * d.r,
    );
    if (hit) {
      this.found.add(hit.id);
      this.totalFound += 1;
      this.streak += 1;
      const points = RULES.pointsPerFind + RULES.streakBonus * (this.streak - 1);
      this.score += points;
      this.timeLeft = Math.min(RULES.timerMax, this.timeLeft + RULES.timeBonusPerFind);
      this.lastFound = { diff: hit, at: this.timeLeft };
      this.message = `Found it! ${hit.label}  (+${points})`;
      if (this.found.size >= RULES.differencesPerRound) {
        this.roundClearBonus = Math.ceil(this.timeLeft) * RULES.timeBonusPerSecondLeft;
        this.score += this.roundClearBonus;
        this.screen = 'roundClear';
        this.message = `Round clear! Time bonus +${this.roundClearBonus}.`;
        if (this.score > this.best) {
          this.best = this.score;
          saveBest(this.best);
        }
      }
      return { type: 'found', diff: hit, points };
    }
    // A wrong click costs a heart and breaks the streak.
    this.hearts -= 1;
    this.streak = 0;
    if (this.hearts <= 0) {
      this.hearts = 0;
      this.screen = 'gameOver';
      this.message = `Out of hearts in ${this.round.name}. Press R to retry the round.`;
    } else {
      this.message = 'Not a difference — one heart lost. Look closer!';
    }
    return { type: 'miss' };
  }

  // Spend 50 points to light one unfound difference for 3 seconds.
  // Returns the hinted diff, or null when no hint is available.
  useHint() {
    if (this.screen !== 'play') return null;
    if (this.hintCooldown > 0) {
      this.message = `Hint recharging — ${Math.ceil(this.hintCooldown)}s left.`;
      return null;
    }
    const remaining = this.round.diffs.filter((d) => !this.found.has(d.id));
    if (remaining.length === 0) return null;
    const diff = remaining[Math.floor(Math.random() * remaining.length)];
    this.score = Math.max(0, this.score - RULES.hintCost);
    this.hintCooldown = RULES.hintCooldown;
    this.hintFlash = { diff, until: this.timeLeft };
    this.message = `Hint (−${RULES.hintCost}): something sparkles… follow the gold ring!`;
    return diff;
  }

  togglePause() {
    if (this.screen === 'play') {
      this.screen = 'paused';
      this.message = 'Paused. Press P to keep hunting.';
    } else if (this.screen === 'paused') {
      this.screen = 'play';
      this.message = `Back to ${this.round.name} — ${this.remaining} to go.`;
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // Space / click to start or advance, depending on the screen.
  advance() {
    if (this.screen === 'title') this.startGame();
    else if (this.screen === 'roundClear') this.nextRound();
    else if (this.screen === 'win' || this.screen === 'gameOver') this.startGame();
  }
}
