// Twin Tides — Spot the Difference
// main.js — boot the game, run the frame loop, and support ?shot=<name> for
// screenshots: stage the shot, paint twice, then raise window.__shotReady.

import { TwinTidesGame } from './game.js';
import { drawGame } from './render.js';
import { attachInput } from './input.js';
import { SoundBank } from './audio.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const game = new TwinTidesGame();
const sound = new SoundBank();
game.prepareRound(0);
game.screen = 'title';

let needsDraw = true;
attachInput(canvas, game, sound, () => {
  needsDraw = true;
});

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (game.screen === 'play') {
    const before = game.screen;
    game.tick(dt);
    if (game.screen !== before && game.screen === 'gameOver') sound.gameOver();
  }
  drawGame(ctx, game);
  needsDraw = false;
  requestAnimationFrame(frame);
}

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot) {
  stageShot(game, shot);
  // Paint twice, then signal readiness for the screenshot tool.
  drawGame(ctx, game);
  drawGame(ctx, game);
  window.__shotReady = true;
} else {
  requestAnimationFrame(frame);
}
