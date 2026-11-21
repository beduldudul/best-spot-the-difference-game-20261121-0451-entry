// The screenshot scenes behind ?shot=start|play|play2|end. Each one sets the
// game to a fixed, readable state — the cover mid-round with three differences
// found and four still hiding — so a screenshot is what a real game looks like
// at that moment, and the same seed always gives the same frame.

import { createGame, PHASE_PLAY, PHASE_WIN, startRound } from './game.js';
import { currentScene } from './game.js';

/** Found sets for the staged play shots: three found in round 1, two in round 2. */
const PLAY_FOUND = ['gull', 'stripe', 'flag'];
const PLAY2_FOUND = ['cat', 'price'];

function stagePlay(game, foundIds, timeLeft, score) {
  startRound(game);
  const scene = currentScene(game);
  for (const id of foundIds) {
    if (scene.diffs.some((d) => d.id === id)) game.found.add(id);
  }
  game.timeLeft = timeLeft;
  game.score = score;
  game.phase = PHASE_PLAY;
  game.message = `Found it — ${scene.diffs.find((d) => d.id === foundIds[foundIds.length - 1]).label}! ${7 - game.found.size} to go.`;
}

/**
 * Set `game` to the named scene and return the best score to show.
 * Unknown names stage the title.
 */
export function stageShot(name, game) {
  if (name === 'play') {
    stagePlay(game, PLAY_FOUND, 74, 350);
    return 350;
  }
  if (name === 'play2') {
    game.round = 1;
    stagePlay(game, PLAY2_FOUND, 92, 620);
    return 620;
  }
  if (name === 'end') {
    game.round = 2;
    startRound(game);
    for (const diff of currentScene(game).diffs) game.found.add(diff.id);
    game.score = 2480;
    game.timeLeft = 41;
    game.phase = PHASE_WIN;
    game.message = 'All rounds clear! Time bonus +205.';
    return 2480;
  }
  // start: the title over round 1, nothing found yet.
  game.phase = 'title';
  game.message = 'Find 7 differences. Click a difference on either picture.';
  return 0;
}
