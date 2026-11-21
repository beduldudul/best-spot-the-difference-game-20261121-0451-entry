// Everything the player sees: the two panels, the rings on found differences,
// the HUD (timer, score, counter, hearts), and the title, pause, round-clear,
// win and game-over screens.

import { DIFFS_PER_ROUND, FIELD, FOOTER, HEARTS, HUD, PALETTE, PANEL, ROUNDS } from './config.js';
import { currentScene, diffsLeft, hintDiff, PHASE_OVER, PHASE_PAUSED, PHASE_PLAY, PHASE_ROUND_CLEAR, PHASE_TITLE, PHASE_WIN } from './game.js';
import { diffFlags } from './scenes.js';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawMarker(ctx, x, y, pulse) {
  const r = 26 + (pulse ? Math.sin(performance.now() / 180) * 3 : 0);
  ctx.strokeStyle = PALETTE.ring;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = PALETTE.ringSoft;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = PALETTE.ring;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - r + 8, y);
  ctx.lineTo(x - r + 16, y + 8);
  ctx.lineTo(x + r - 8, y - 10);
  ctx.stroke();
}

function drawPanel(ctx, game, scene, altered, ox, found) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(ox, PANEL.top, PANEL.width, PANEL.height);
  ctx.clip();
  ctx.translate(ox, PANEL.top);
  scene.draw(ctx, diffFlags(ROUNDS[game.round].scene, altered));
  // Rings on the differences already found, on both panels alike.
  for (const diff of scene.diffs) {
    if (found.has(diff.id)) drawMarker(ctx, diff.x, diff.y, false);
  }
  // The hint's pulsing ring, on both panels alike.
  const hint = hintDiff(game);
  if (hint) drawMarker(ctx, hint.x, hint.y, true);
  ctx.restore();
  ctx.strokeStyle = PALETTE.panelEdge;
  ctx.lineWidth = 3;
  ctx.strokeRect(ox, PANEL.top, PANEL.width, PANEL.height);
  ctx.fillStyle = 'rgba(23, 26, 38, 0.85)';
  ctx.fillRect(ox + 10, PANEL.top + 10, 92, 26);
  ctx.fillStyle = PALETTE.text;
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(altered ? 'PICTURE B' : 'PICTURE A', ox + 20, PANEL.top + 28);
}

function drawHearts(ctx, x, y, hearts) {
  for (let i = 0; i < HEARTS; i += 1) {
    const cx = x + i * 28;
    ctx.fillStyle = i < hearts ? PALETTE.heart : PALETTE.heartEmpty;
    ctx.beginPath();
    ctx.moveTo(cx, y + 6);
    ctx.bezierCurveTo(cx - 9, y - 3, cx - 16, y + 5, cx, y + 14);
    ctx.bezierCurveTo(cx + 16, y + 5, cx + 9, y - 3, cx, y + 6);
    ctx.fill();
  }
}

function drawHud(ctx, game) {
  ctx.fillStyle = PALETTE.hud;
  ctx.fillRect(0, 0, FIELD.width, HUD.height);
  ctx.fillStyle = PALETTE.text;
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Twin Tides', 20, 32);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = '15px system-ui, sans-serif';
  ctx.fillText(`${ROUNDS[game.round].name}  ·  Round ${game.round + 1} of ${ROUNDS.length}`, 20, 56);
  // Timer bar.
  const barX = 330;
  const barW = 420;
  ctx.fillStyle = PALETTE.timerBack;
  roundRect(ctx, barX, 18, barW, 16, 8);
  ctx.fill();
  const frac = Math.max(0, game.timeLeft / 120);
  ctx.fillStyle = frac < 0.25 ? PALETTE.timerLow : PALETTE.timerOk;
  if (frac > 0) {
    roundRect(ctx, barX, 18, barW * frac, 16, 8);
    ctx.fill();
  }
  ctx.fillStyle = PALETTE.text;
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.ceil(game.timeLeft)}s`, barX + barW / 2, 46);
  // Found counter.
  const left = diffsLeft(game);
  ctx.fillStyle = left === 0 ? PALETTE.good : PALETTE.accent;
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`Found ${DIFFS_PER_ROUND - left} / ${DIFFS_PER_ROUND}`, 1080, 32);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText(`Score ${game.score}  ·  Best ${game.best}`, 1080, 56);
  drawHearts(ctx, 1120, 14, game.hearts);
  ctx.textAlign = 'left';
}

function drawFooter(ctx, game) {
  ctx.fillStyle = PALETTE.hud;
  ctx.fillRect(0, FOOTER.top, FIELD.width, FOOTER.height);
  ctx.fillStyle = PALETTE.text;
  ctx.font = '16px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(game.message, 20, FOOTER.top + 30);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('Click a difference  ·  H hint  ·  P pause  ·  M sound  ·  R retry round', 20, FOOTER.top + 58);
  // Round dots.
  for (let i = 0; i < ROUNDS.length; i += 1) {
    ctx.fillStyle = i < game.round ? PALETTE.good : i === game.round ? PALETTE.accent : PALETTE.panelEdge;
    ctx.beginPath();
    ctx.arc(1200 - (ROUNDS.length - 1 - i) * 26, FOOTER.top + 52, 7, 0, Math.PI * 2);
    ctx.fill();
  }
}

function overlay(ctx, title, lines, accent) {
  ctx.fillStyle = 'rgba(10, 12, 20, 0.72)';
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  ctx.fillStyle = PALETTE.panel;
  roundRect(ctx, 340, 170, 600, 360, 18);
  ctx.fill();
  ctx.strokeStyle = PALETTE.panelEdge;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = 'bold 40px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, 640, 240);
  ctx.fillStyle = PALETTE.text;
  ctx.font = '18px system-ui, sans-serif';
  lines.forEach((line, i) => ctx.fillText(line, 640, 300 + i * 34));
  ctx.textAlign = 'left';
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  return {
    draw(game) {
      ctx.fillStyle = PALETTE.backdrop;
      ctx.fillRect(0, 0, FIELD.width, FIELD.height);
      const scene = currentScene(game);
      drawPanel(ctx, game, scene, false, PANEL.leftX, game.found);
      drawPanel(ctx, game, scene, true, PANEL.rightX, game.found);
      drawHud(ctx, game);
      drawFooter(ctx, game);
      if (game.phase === PHASE_TITLE) {
        overlay(ctx, 'Twin Tides', [
          'Two pictures. Seven differences. One careful eye.',
          ROUNDS.map((r) => r.name).join('  ·  '),
          '',
          'Click a difference on either picture. Hints cost 50 points.',
          'Press Space or click to start.',
        ], PALETTE.accent);
      } else if (game.phase === PHASE_PAUSED) {
        overlay(ctx, 'Paused', ['Take a breath. The tide waits.', '', 'Press P or click to keep playing.'], PALETTE.text);
      } else if (game.phase === PHASE_ROUND_CLEAR) {
        overlay(ctx, 'Round Clear!', [
          `${ROUNDS[game.round].name} — all ${DIFFS_PER_ROUND} differences found.`,
          `Score ${game.score}  ·  Best ${game.best}`,
          '',
          'Press Space for the next round.',
        ], PALETTE.good);
      } else if (game.phase === PHASE_WIN) {
        overlay(ctx, 'You Found Them All!', [
          `All ${ROUNDS.length * DIFFS_PER_ROUND} differences across three shores.`,
          `Final score ${game.score}  ·  Best ${game.best}`,
          '',
          'Press Space to play again.',
        ], PALETTE.accent);
      } else if (game.phase === PHASE_OVER) {
        overlay(ctx, game.hearts <= 0 ? 'Out of Hearts' : "Time's Up", [
          `You found ${DIFFS_PER_ROUND - diffsLeft(game)} of ${DIFFS_PER_ROUND} in ${ROUNDS[game.round].name}.`,
          `Score ${game.score}  ·  Best ${game.best}`,
          '',
          'Press R to try this round again.',
        ], PALETTE.bad);
      }
    },
  };
}
