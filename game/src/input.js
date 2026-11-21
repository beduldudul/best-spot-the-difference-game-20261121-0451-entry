// Twin Tides — Spot the Difference
// input.js — mouse clicks mapped onto the 1280x720 board, plus the keyboard:
// Space/Enter start and advance, P pause, M mute, H hint, R retry the round.

import { PANEL } from './config.js';

export function attachInput(canvas, game, sound, onAction) {
  function toBoard(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * 1280,
      y: ((clientY - rect.top) / rect.height) * 720,
    };
  }

  // Which panel (if any) holds a board point, and its panel-local coordinates.
  function panelAt(x, y) {
    if (y < PANEL.top || y > PANEL.top + PANEL.height) return null;
    if (x >= PANEL.leftX && x <= PANEL.leftX + PANEL.width) {
      return { x: x - PANEL.leftX, y: y - PANEL.top };
    }
    if (x >= PANEL.rightX && x <= PANEL.rightX + PANEL.width) {
      return { x: x - PANEL.rightX, y: y - PANEL.top };
    }
    return null;
  }

  canvas.addEventListener('click', (event) => {
    sound.ensure();
    const p = toBoard(event.clientX, event.clientY);
    if (game.screen === 'play') {
      const local = panelAt(p.x, p.y);
      if (!local) return;
      const result = game.clickAt(local.x, local.y);
      if (result.type === 'found') {
        sound.found();
        if (game.screen === 'roundClear') sound.roundClear();
      } else if (result.type === 'miss') {
        sound.miss();
        if (game.screen === 'gameOver') sound.gameOver();
      }
      onAction();
      return;
    }
    // On any overlay screen, a click advances.
    const before = game.screen;
    game.advance();
    if (game.screen !== before) {
      sound.click();
      if (game.screen === 'win') sound.win();
      onAction();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === ' ' || key === 'enter') {
      event.preventDefault();
      sound.ensure();
      const before = game.screen;
      game.advance();
      if (game.screen !== before) {
        sound.click();
        if (game.screen === 'win') sound.win();
        onAction();
      }
    } else if (key === 'p') {
      game.togglePause();
      onAction();
    } else if (key === 'm') {
      const muted = game.toggleMute();
      sound.muted = muted;
      game.message = muted ? 'Sound off. Press M to bring the chimes back.' : 'Sound on.';
      onAction();
    } else if (key === 'h') {
      const diff = game.useHint();
      if (diff) sound.hint();
      onAction();
    } else if (key === 'r') {
      if (game.screen === 'gameOver' || game.screen === 'play' || game.screen === 'paused') {
        game.retryRound();
        sound.click();
        onAction();
      }
    }
  });
}
