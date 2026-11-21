// The game state and its rules: rounds, finds, the clock, hearts, hints, score.
// Nothing here draws; render.js paints what this holds.

import { DIFFS_PER_ROUND, FIND_BONUS_SECONDS, HEARTS, HINT, POINTS, ROUND_MAX_SECONDS, ROUND_SECONDS, ROUNDS, WRONG_BEFORE_HEART } from './config.js';
import { SCENES } from './scenes.js';

export const PHASE_TITLE = 'title';
export const PHASE_PLAY = 'play';
export const PHASE_PAUSED = 'paused';
export const PHASE_ROUND_CLEAR = 'round-clear';
export const PHASE_WIN = 'win';
export const PHASE_OVER = 'over';

/** A fresh game: round 0, nothing found, full clock and hearts. */
export function createGame() {
  return {
    phase: PHASE_TITLE,
    round: 0,
    found: new Set(),
    score: 0,
    streak: 0,
    timeLeft: ROUND_SECONDS,
    hearts: HEARTS,
    wrongStreak: 0,
    hintLeft: 0,
    hintCooldown: 0,
    hintTarget: null,
    message: 'Find 7 differences. Click a difference on either picture.',
    best: 0,
    roundScore: 0,
    totalFound: 0,
  };
}

/** The scene key and differences of the current round. */
export function currentScene(game) {
  return SCENES[ROUNDS[game.round].scene];
}

export function diffsLeft(game) {
  return DIFFS_PER_ROUND - game.found.size;
}

/** Start (or restart) the current round with a full clock and hearts. */
export function startRound(game) {
  game.found = new Set();
  game.streak = 0;
  game.timeLeft = ROUND_SECONDS;
  game.hearts = HEARTS;
  game.wrongStreak = 0;
  game.hintLeft = 0;
  game.hintCooldown = 0;
  game.hintTarget = null;
  game.phase = PHASE_PLAY;
  game.message = `${ROUNDS[game.round].name}: find ${DIFFS_PER_ROUND} differences.`;
}

/** Advance the clock; returns 'time-up' when it runs out. */
export function tick(game, dt) {
  if (game.phase !== PHASE_PLAY) return null;
  game.timeLeft -= dt;
  if (game.hintLeft > 0) {
    game.hintLeft -= dt;
    if (game.hintLeft <= 0) game.hintTarget = null;
  }
  if (game.hintCooldown > 0) game.hintCooldown -= dt;
  if (game.timeLeft <= 0) {
    game.timeLeft = 0;
    game.phase = PHASE_OVER;
    game.message = 'Out of time! Press R to try this round again.';
    return 'time-up';
  }
  return null;
}

/**
 * A click at panel-local (x, y) on either picture. Returns 'found', 'wrong'
 * or 'none' (a click on an already-found difference). `now` is only used for
 * the streak; the caller passes performance.now() / 1000.
 */
export function clickAt(game, x, y) {
  if (game.phase !== PHASE_PLAY) return 'none';
  const scene = currentScene(game);
  for (const diff of scene.diffs) {
    if (game.found.has(diff.id)) continue;
    const dx = x - diff.x;
    const dy = y - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) {
      game.found.add(diff.id);
      game.totalFound += 1;
      const bonus = game.streak * POINTS.streak;
      game.score += POINTS.find + bonus;
      game.streak += 1;
      game.wrongStreak = 0;
      game.timeLeft = Math.min(ROUND_MAX_SECONDS, game.timeLeft + FIND_BONUS_SECONDS);
      game.message = `Found it — ${diff.label}! ${diffsLeft(game)} to go.`;
      if (game.found.size >= DIFFS_PER_ROUND) {
        const timeBonus = Math.round(game.timeLeft) * POINTS.timePerSecond;
        game.roundScore = game.score;
        game.score += timeBonus;
        game.phase = game.round + 1 >= ROUNDS.length ? PHASE_WIN : PHASE_ROUND_CLEAR;
        game.message = game.phase === PHASE_WIN
          ? `All rounds clear! Time bonus +${timeBonus}.`
          : `Round clear! Time bonus +${timeBonus}. Press Space for the next round.`;
      }
      return 'found';
    }
  }
  game.streak = 0;
  game.wrongStreak += 1;
  game.message = 'Not quite — look closer.';
  if (game.wrongStreak >= WRONG_BEFORE_HEART) {
    game.wrongStreak = 0;
    game.hearts -= 1;
    if (game.hearts <= 0) {
      game.phase = PHASE_OVER;
      game.message = 'Out of hearts! Press R to try this round again.';
      return 'over';
    }
  }
  return 'wrong';
}

/** Light one unfound difference for a few seconds. Costs points, then rests. */
export function useHint(game) {
  if (game.phase !== PHASE_PLAY) return 'none';
  if (game.hintCooldown > 0 || game.hintLeft > 0) return 'none';
  if (game.score < POINTS.hint) return 'none';
  const scene = currentScene(game);
  const remaining = scene.diffs.filter((d) => !game.found.has(d.id));
  if (remaining.length === 0) return 'none';
  game.score -= POINTS.hint;
  game.hintTarget = remaining[Math.floor(Math.random() * remaining.length)].id;
  game.hintLeft = HINT.showSeconds;
  game.hintCooldown = HINT.cooldownSeconds;
  game.message = `Hint: something hides near the ${game.hintTarget}. (-${POINTS.hint} points)`;
  return 'hint';
}

/** Move to the next round after a round-clear. */
export function nextRound(game) {
  if (game.phase !== PHASE_ROUND_CLEAR) return;
  game.round += 1;
  startRound(game);
}

/** The hint's ring, when one is showing: the difference it points at. */
export function hintDiff(game) {
  if (!game.hintTarget || game.hintLeft <= 0) return null;
  return currentScene(game).diffs.find((d) => d.id === game.hintTarget) ?? null;
}
