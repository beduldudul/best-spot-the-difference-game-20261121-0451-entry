// Boot and the one loop: input is read as it arrives, the clock advances in
// real time, and the renderer paints what is there. The game moves between six
// screens: title, play, paused, round-clear, win and game over.
//
// ?seed=N is accepted and ignored for play (the scenes are fixed); ?shot=start|
// play|play2|end (with &seed=N) stages that scene instead of running the loop,
// paints it twice and sets window.__shotReady for a screenshot.
import { BEST_KEY, FIELD } from './config.js';
import { ACTION_CONFIRM, ACTION_HINT, ACTION_MUTE, ACTION_PAUSE, ACTION_RETRY, createInput } from './input.js';
import { createAudio } from './audio.js';
import { clickAt, createGame, nextRound, PHASE_OVER, PHASE_PAUSED, PHASE_PLAY, PHASE_ROUND_CLEAR, PHASE_TITLE, PHASE_WIN, startRound, tick, useHint } from './game.js';
import { createRenderer } from './render.js';
import { stageShot } from './shots.js';

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
canvas.width = FIELD.width;
canvas.height = FIELD.height;
const status = document.getElementById('status');
const game = createGame();
const renderer = createRenderer(canvas);
const audio = createAudio();

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best score then lasts this visit only.
  }
}

game.best = readBest();

function refreshBest() {
  if (game.score > game.best) {
    game.best = game.score;
    saveBest(game.best);
  }
}

function runShot(name) {
  game.best = stageShot(name, game);
  let painted = 0;
  function paint() {
    renderer.draw(game);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas, onClick, onAction);
  let last = performance.now();

  function announce(message) {
    status.textContent = message;
  }

  function startFromTitle() {
    audio.unlock();
    game.round = 0;
    game.score = 0;
    game.totalFound = 0;
    startRound(game);
    announce('Playing. Find 7 differences.');
  }

  function onClick(x, y) {
    audio.unlock();
    if (game.phase === PHASE_TITLE) {
      startFromTitle();
      return;
    }
    if (game.phase === PHASE_WIN) {
      startFromTitle();
      return;
    }
    if (game.phase === PHASE_PAUSED) {
      game.phase = PHASE_PLAY;
      announce('Playing.');
      return;
    }
    if (game.phase !== PHASE_PLAY) return;
    const result = clickAt(game, x, y);
    if (result === 'found') {
      audio.found();
      refreshBest();
      announce(game.message);
    } else if (result === 'wrong') {
      audio.wrong();
      announce(game.message);
    } else if (result === 'over') {
      audio.wrong();
      refreshBest();
      announce(game.message);
    } else {
      audio.click();
    }
  }

  function onAction(bits) {
    if (bits & ACTION_MUTE) {
      const muted = audio.toggleMute();
      game.message = muted ? 'Sound off. Press M to turn it back on.' : 'Sound on.';
      return;
    }
    if (bits & ACTION_HINT) {
      if (useHint(game) === 'hint') audio.hint();
      return;
    }
    if (bits & ACTION_RETRY) {
      if (game.phase === PHASE_OVER) {
        startRound(game);
        announce('Playing. Find 7 differences.');
      }
      return;
    }
    if (bits & ACTION_PAUSE) {
      if (game.phase === PHASE_PLAY) {
        game.phase = PHASE_PAUSED;
        announce('Paused.');
      } else if (game.phase === PHASE_PAUSED) {
        game.phase = PHASE_PLAY;
        announce('Playing.');
      }
      return;
    }
    if (bits & ACTION_CONFIRM) {
      audio.unlock();
      if (game.phase === PHASE_TITLE || game.phase === PHASE_WIN) startFromTitle();
      else if (game.phase === PHASE_ROUND_CLEAR) {
        nextRound(game);
        announce('Playing. Find 7 differences.');
      }
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.25);
    last = now;
    const event = tick(game, dt);
    if (event === 'time-up') {
      refreshBest();
      announce(game.message);
    }
    renderer.draw(game);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && game.phase === PHASE_PLAY) {
      game.phase = PHASE_PAUSED;
      announce('Paused.');
    }
  });

  announce('Twin Tides. Press Space or click to start.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
