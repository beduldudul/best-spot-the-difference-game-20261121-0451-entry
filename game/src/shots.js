// Twin Tides — Spot the Difference
// shots.js — staging for screenshots. Each named shot puts the game into a
// photogenic state through the same public methods a player uses (startRound
// and clickAt), so every screenshot is a real render of the game's own code.
//
//   start — the title screen over round 1, Harbor Morning
//   play  — round 1 in play, 3 differences found, 4 still hiding
//   play2 — round 2 in play, 2 differences found, 5 still hiding
//   end   — the win screen after all three rounds are cleared

export function stageShot(game, name) {
  if (name === 'start') {
    game.prepareRound(0);
    game.screen = 'title';
    game.message = 'Find 7 differences in each picture. Click one — on either side.';
  } else if (name === 'play') {
    game.startRound(0);
    for (const diff of game.round.diffs.slice(0, 3)) game.clickAt(diff.x, diff.y);
  } else if (name === 'play2') {
    game.score = 350;
    game.startRound(1);
    for (const diff of game.round.diffs.slice(0, 2)) game.clickAt(diff.x, diff.y);
  } else if (name === 'end') {
    game.startGame();
    for (let r = 0; r < 3; r++) {
      for (const diff of game.round.diffs) game.clickAt(diff.x, diff.y);
      if (r < 2) game.nextRound();
    }
    game.finishWin();
  }
  return game;
}
