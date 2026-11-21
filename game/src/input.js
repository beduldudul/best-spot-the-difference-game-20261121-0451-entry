// Mouse and keyboard. Clicks land on one of the two panels and are mapped back
// to panel-local coordinates for the hit test; keys drive hint, pause, sound
// and retry. A click also starts the game from the title and win screens.

import { PANEL } from './config.js';

export const ACTION_CONFIRM = 1;
export const ACTION_PAUSE = 2;
export const ACTION_HINT = 4;
export const ACTION_RETRY = 8;
export const ACTION_MUTE = 16;

/** Map a canvas click to a panel-local point, or null when it misses both. */
export function panelPoint(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;
  if (y < PANEL.top || y > PANEL.top + PANEL.height) return null;
  if (x >= PANEL.leftX && x <= PANEL.leftX + PANEL.width) {
    return { x: x - PANEL.leftX, y: y - PANEL.top };
  }
  if (x >= PANEL.rightX && x <= PANEL.rightX + PANEL.width) {
    return { x: x - PANEL.rightX, y: y - PANEL.top };
  }
  return null;
}

export function createInput(canvas, onClick, onAction) {
  const actions = { bits: 0 };
  canvas.addEventListener('click', (event) => {
    const point = panelPoint(canvas, event.clientX, event.clientY);
    if (point) onClick(point.x, point.y);
    else onAction(ACTION_CONFIRM);
  });
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === ' ' || key === 'enter') {
      event.preventDefault();
      onAction(ACTION_CONFIRM);
    } else if (key === 'p' || key === 'escape') onAction(ACTION_PAUSE);
    else if (key === 'h') onAction(ACTION_HINT);
    else if (key === 'r') onAction(ACTION_RETRY);
    else if (key === 'm') onAction(ACTION_MUTE);
  });
  return actions;
}
