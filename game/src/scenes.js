// Twin Tides — Spot the Difference
// scenes.js — the three hand-drawn scenes. Every scene is a function that paints
// one 600x520 panel from a flags object: all flags false paints the original
// (Picture A), all flags true paints the altered twin (Picture B). Decorative
// details come from a seeded RNG, so the two panels match everywhere except the
// seven flagged differences. Each difference carries its panel-local centre,
// hit radius and the friendly label shown when it is found.

import { ROUND_NAMES } from './config.js';
import { makeRng, range } from './random.js';

// ---------------------------------------------------------------- helpers

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function poly(ctx, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function cloud(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.beginPath();
  ctx.arc(x, y, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 20 * s, y - 8 * s, 22 * s, 0, Math.PI * 2);
  ctx.arc(x + 44 * s, y, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 22 * s, y + 8 * s, 20 * s, 0, Math.PI * 2);
  ctx.fill();
}

function gull(ctx, x, y, s, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x - 9 * s, y, 9 * s, Math.PI * 1.15, Math.PI * 1.95);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 9 * s, y, 9 * s, Math.PI * 1.05, Math.PI * 1.85);
  ctx.stroke();
}

// ---------------------------------------------------------------- Round 1: Harbor Morning

const HARBOR_FLAGS = ['gullGone', 'stripeBlue', 'extraCrate', 'boatFlag', 'sunRaysGone', 'ropeCoil', 'windowDark'];

function drawHarbor(ctx, ox, oy, f) {
  const rng = makeRng(1101);
  // Sky and sea.
  let g = ctx.createLinearGradient(0, 0, 0, 300);
  g.addColorStop(0, '#8fd0ea');
  g.addColorStop(1, '#ffe9b8');
  ctx.fillStyle = g;
  ctx.fillRect(ox, oy, 600, 300);
  g = ctx.createLinearGradient(0, 300, 0, 520);
  g.addColorStop(0, '#3f8fb5');
  g.addColorStop(1, '#1f5d7d');
  ctx.fillStyle = g;
  ctx.fillRect(ox, oy + 300, 600, 220);

  // Sun with rays (rays vanish in Picture B).
  circle(ctx, ox + 500, oy + 70, 34, '#ffd94d');
  circle(ctx, ox + 500, oy + 70, 26, '#ffe98a');
  if (!f.sunRaysGone) {
    ctx.strokeStyle = '#ffd94d';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const x1 = ox + 500 + Math.cos(a) * 44;
      const y1 = oy + 70 + Math.sin(a) * 44;
      const x2 = ox + 500 + Math.cos(a) * 58;
      const y2 = oy + 70 + Math.sin(a) * 58;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  // Clouds and gulls.
  cloud(ctx, ox + 90, oy + 60, 1.1);
  cloud(ctx, ox + 330, oy + 42, 0.9);
  cloud(ctx, ox + 430, oy + 130, 0.7);
  if (!f.gullGone) gull(ctx, ox + 260, oy + 95, 1, '#2c3e50');
  gull(ctx, ox + 380, oy + 120, 0.8, '#2c3e50');
  gull(ctx, ox + 160, oy + 140, 0.7, '#3a5068');

  // Distant headland.
  poly(ctx, [[ox + 0, oy + 300], [ox + 0, oy + 262], [ox + 90, oy + 278], [ox + 150, oy + 300]], '#7fae7a');

  // Lighthouse on the left point.
  rect(ctx, ox + 66, oy + 296, 72, 8, '#5d5348'); // rock base
  poly(ctx, [[ox + 78, oy + 300], [ox + 126, oy + 300], [ox + 120, oy + 128], [ox + 84, oy + 128]], '#f7f3e8');
  // Two stripes: the middle one changes colour in Picture B.
  poly(ctx, [[ox + 82, oy + 226], [ox + 122, oy + 226], [ox + 120, oy + 196], [ox + 84, oy + 196]], f.stripeBlue ? '#2f6fb2' : '#d94f3d');
  poly(ctx, [[ox + 80, oy + 268], [ox + 124, oy + 268], [ox + 122, oy + 244], [ox + 82, oy + 244]], '#d94f3d');
  rect(ctx, ox + 80, oy + 112, 44, 18, '#2c3e50'); // lamp room
  circle(ctx, ox + 102, oy + 121, 7, '#ffe98a');
  poly(ctx, [[ox + 76, oy + 112], [ox + 128, oy + 112], [ox + 102, oy + 92]], '#c0392b'); // cap
  // Light beam across the morning sky.
  ctx.fillStyle = 'rgba(255,233,138,0.28)';
  ctx.beginPath();
  ctx.moveTo(ox + 124, oy + 118);
  ctx.lineTo(ox + 320, oy + 84);
  ctx.lineTo(ox + 320, oy + 128);
  ctx.lineTo(ox + 124, oy + 128);
  ctx.closePath();
  ctx.fill();

  // Sailboat, mid-sea.
  poly(ctx, [[ox + 330, oy + 330], [ox + 330, oy + 258], [ox + 386, oy + 330]], '#fff8e7');
  ctx.strokeStyle = '#8a6d4b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ox + 330, oy + 252);
  ctx.lineTo(ox + 330, oy + 334);
  ctx.stroke();
  poly(ctx, [[ox + 318, oy + 330], [ox + 402, oy + 330], [ox + 388, oy + 348], [ox + 332, oy + 348]], '#a34d2d');
  ellipse(ctx, ox + 360, oy + 352, 46, 5, 'rgba(255,255,255,0.35)');

  // Little rowboat with a flag (the flag appears in Picture B).
  ctx.strokeStyle = '#6b4f2a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ox + 252, oy + 372);
  ctx.lineTo(ox + 252, oy + 322);
  ctx.stroke();
  poly(ctx, [[ox + 228, oy + 372], [ox + 282, oy + 372], [ox + 272, oy + 386], [ox + 238, oy + 386]], '#7a5a33');
  if (f.boatFlag) poly(ctx, [[ox + 252, oy + 322], [ox + 252, oy + 338], [ox + 270, oy + 330]], '#e4572e');

  // Buoys and wave sparkle (seeded, identical in both panels).
  for (let i = 0; i < 7; i++) {
    const wx = ox + range(rng, 30, 580);
    const wy = oy + range(rng, 310, 500);
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.quadraticCurveTo(wx + 12, wy - 5, wx + 26, wy);
    ctx.stroke();
  }
  circle(ctx, ox + 470, oy + 420, 9, '#e4572e');
  rect(ctx, ox + 466, oy + 404, 8, 12, '#f2b705');

  // Boathouse on the right.
  rect(ctx, ox + 470, oy + 330, 112, 100, '#e8c39a');
  poly(ctx, [[ox + 460, oy + 332], [ox + 592, oy + 332], [ox + 526, oy + 288]], '#a34d2d');
  rect(ctx, ox + 506, oy + 368, 40, 62, '#6b4f2a'); // door
  circle(ctx, ox + 540, oy + 400, 2.5, '#f2b705');
  // Window: warm and lit in A, dark in B.
  rect(ctx, ox + 512, oy + 322, 26, 26, '#5d5348');
  rect(ctx, ox + 515, oy + 325, 20, 20, f.windowDark ? '#2b3442' : '#ffe98a');
  ctx.strokeStyle = '#5d5348';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ox + 525, oy + 325);
  ctx.lineTo(ox + 525, oy + 345);
  ctx.moveTo(ox + 515, oy + 335);
  ctx.lineTo(ox + 535, oy + 335);
  ctx.stroke();

  // Wooden dock along the bottom.
  rect(ctx, ox + 30, oy + 420, 260, 34, '#8a6d4b');
  rect(ctx, ox + 30, oy + 420, 260, 6, '#a87f52');
  ctx.strokeStyle = '#6b4f2a';
  ctx.lineWidth = 2;
  for (let x = 50; x < 290; x += 30) {
    ctx.beginPath();
    ctx.moveTo(ox + x, oy + 426);
    ctx.lineTo(ox + x, oy + 454);
    ctx.stroke();
  }
  rect(ctx, ox + 44, oy + 454, 12, 46, '#6b4f2a');
  rect(ctx, ox + 260, oy + 454, 12, 46, '#6b4f2a');
  // Lower landing with the rope coil (coil appears in Picture B).
  rect(ctx, ox + 60, oy + 484, 110, 20, '#8a6d4b');
  if (f.ropeCoil) {
    ctx.strokeStyle = '#d9c08a';
    ctx.lineWidth = 4;
    for (let r = 12; r >= 4; r -= 4) {
      ctx.beginPath();
      ctx.arc(ox + 96, oy + 494, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  // Extra crate on the dock (appears in Picture B).
  if (f.extraCrate) {
    rect(ctx, ox + 196, oy + 424, 34, 34, '#b98a4e');
    ctx.strokeStyle = '#6b4f2a';
    ctx.lineWidth = 2;
    ctx.strokeRect(ox + 196, oy + 424, 34, 34);
    ctx.beginPath();
    ctx.moveTo(ox + 196, oy + 424);
    ctx.lineTo(ox + 230, oy + 458);
    ctx.moveTo(ox + 230, oy + 424);
    ctx.lineTo(ox + 196, oy + 458);
    ctx.stroke();
  }
  // A crate that is always there, for company.
  rect(ctx, ox + 150, oy + 432, 26, 26, '#b98a4e');
  ctx.strokeStyle = '#6b4f2a';
  ctx.lineWidth = 2;
  ctx.strokeRect(ox + 150, oy + 432, 26, 26);
}

// ---------------------------------------------------------------- Round 2: Market Day

const MARKET_FLAGS = ['awningColor', 'catGone', 'balloonColor', 'appleOrange', 'priceSix', 'breadGone', 'birdLands'];

function drawMarket(ctx, ox, oy, f) {
  const rng = makeRng(2202);
  // Warm morning sky and cobbled street.
  let g = ctx.createLinearGradient(0, 0, 0, 260);
  g.addColorStop(0, '#ffd9a0');
  g.addColorStop(1, '#ffeecf');
  ctx.fillStyle = g;
  ctx.fillRect(ox, oy, 600, 260);
  g = ctx.createLinearGradient(0, 260, 0, 520);
  g.addColorStop(0, '#cbb59a');
  g.addColorStop(1, '#a98f73');
  ctx.fillStyle = g;
  ctx.fillRect(ox, oy + 260, 600, 260);
  // Cobbles (seeded, identical in both panels).
  ctx.strokeStyle = 'rgba(90,70,50,0.35)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 40; i++) {
    const cx = ox + range(rng, 10, 590);
    const cy = oy + range(rng, 270, 510);
    ctx.beginPath();
    ctx.ellipse(cx, cy, 16, 8, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  circle(ctx, ox + 70, oy + 62, 30, '#ffd94d');
  circle(ctx, ox + 70, oy + 62, 22, '#ffe98a');
  cloud(ctx, ox + 300, oy + 52, 0.9);
  cloud(ctx, ox + 470, oy + 36, 0.7);

  // Bunting strung across the square.
  ctx.strokeStyle = '#5d5348';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ox + 20, oy + 96);
  ctx.quadraticCurveTo(ox + 300, oy + 132, ox + 580, oy + 92);
  ctx.stroke();
  const buntColors = ['#e4572e', '#f2b705', '#17a398', '#2f6fb2'];
  for (let i = 0; i < 12; i++) {
    const t = i / 11;
    const bx = ox + 30 + t * 540;
    const by = oy + 100 + Math.sin(t * Math.PI) * 22;
    poly(ctx, [[bx - 9, by], [bx + 9, by], [bx, by + 18]], buntColors[i % 4]);
  }

  // Stall 2 (right) with its roof and striped awning — the awning stripes
  // change colour in Picture B.
  rect(ctx, ox + 350, oy + 150, 220, 14, '#7a5a33');
  poly(ctx, [[ox + 344, oy + 152], [ox + 576, oy + 152], [ox + 556, oy + 112], [ox + 364, oy + 112]], '#8a6d4b');
  const awnA = f.awningColor ? '#e8873a' : '#17a398';
  const awnB = '#fdf6e3';
  for (let i = 0; i < 10; i++) {
    rect(ctx, ox + 350 + i * 22, oy + 196, 22, 34, i % 2 === 0 ? awnA : awnB);
  }
  ctx.strokeStyle = '#5d5348';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ox + 350, oy + 196);
  ctx.lineTo(ox + 570, oy + 196);
  ctx.moveTo(ox + 350, oy + 230);
  ctx.lineTo(ox + 570, oy + 230);
  ctx.stroke();
  if (f.birdLands) {
    ellipse(ctx, ox + 522, oy + 50, 10, 7, '#2c3e50');
    circle(ctx, ox + 530, oy + 44, 5, '#2c3e50');
    poly(ctx, [[ox + 534, oy + 43], [ox + 540, oy + 45], [ox + 534, oy + 47]], '#f2b705');
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ox + 518, oy + 56);
    ctx.lineTo(ox + 512, oy + 62);
    ctx.stroke();
  }
  // Balloons tied to stall 2 (middle one changes colour in Picture B).
  ctx.strokeStyle = '#5d5348';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(ox + 470, oy + 112);
  ctx.lineTo(ox + 452, oy + 160);
  ctx.moveTo(ox + 470, oy + 112);
  ctx.lineTo(ox + 470, oy + 160);
  ctx.moveTo(ox + 470, oy + 112);
  ctx.lineTo(ox + 488, oy + 160);
  ctx.stroke();
  ellipse(ctx, ox + 452, oy + 88, 13, 17, '#2f6fb2');
  ellipse(ctx, ox + 470, oy + 96, 14, 18, f.balloonColor ? '#8e44ad' : '#e4572e');
  ellipse(ctx, ox + 488, oy + 88, 13, 17, '#f2b705');

  // Stall 1 (left): striped awning whose stripes change colour in Picture B.
  const stripeA = f.awningColor ? '#e8873a' : '#17a398';
  const stripeB = '#fdf6e3';
  for (let i = 0; i < 8; i++) {
    rect(ctx, ox + 40 + i * 30, oy + 150, 30, 42, i % 2 === 0 ? stripeA : stripeB);
  }
  poly(ctx, [[ox + 40, oy + 150], [ox + 280, oy + 150], [ox + 268, oy + 128], [ox + 52, oy + 128]], '#5d5348');
  ctx.strokeStyle = '#5d5348';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ox + 46, oy + 192);
  ctx.lineTo(ox + 46, oy + 330);
  ctx.moveTo(ox + 274, oy + 192);
  ctx.lineTo(ox + 274, oy + 330);
  ctx.stroke();
  // Counter with cloth.
  rect(ctx, ox + 40, oy + 300, 240, 78, '#8a6d4b');
  rect(ctx, ox + 40, oy + 300, 240, 16, '#e4572e');
  // Bread basket (vanishes in Picture B).
  if (!f.breadGone) {
    ellipse(ctx, ox + 95, oy + 292, 30, 12, '#c98a4e');
    ellipse(ctx, ox + 82, oy + 284, 12, 8, '#e8c39a');
    ellipse(ctx, ox + 95, oy + 282, 12, 8, '#e8c39a');
    ellipse(ctx, ox + 108, oy + 284, 12, 8, '#e8c39a');
  }
  // Fruit pile: red apples, one turns orange in Picture B.
  const appleSpots = [[130, 292], [148, 286], [166, 292], [139, 276], [157, 276]];
  appleSpots.forEach(([ax, ay], i) => {
    const isOrange = f.appleOrange && i === 0;
    circle(ctx, ox + ax, oy + ay, 10, isOrange ? '#f08a1d' : '#d9382b');
    ctx.strokeStyle = '#3f7a34';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ox + ax, oy + ay - 10);
    ctx.lineTo(ox + ax + 4, oy + ay - 15);
    ctx.stroke();
  });
  // Jars on stall 2's counter.
  rect(ctx, ox + 360, oy + 268, 200, 62, '#8a6d4b');
  rect(ctx, ox + 360, oy + 268, 200, 12, '#17a398');
  const jarColors = ['#e8b4b8', '#a8d5a2', '#f2d06b'];
  jarColors.forEach((c, i) => {
    rect(ctx, ox + 380 + i * 56, oy + 244, 34, 34, c);
    rect(ctx, ox + 384 + i * 56, oy + 236, 26, 10, '#5d5348');
  });

  // Price sign hanging between the stalls: 5 in A, 6 in B.
  ctx.strokeStyle = '#5d5348';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ox + 300, oy + 128);
  ctx.lineTo(ox + 300, oy + 150);
  ctx.stroke();
  rect(ctx, ox + 272, oy + 150, 56, 52, '#fdf6e3');
  ctx.strokeStyle = '#2c3e50';
  ctx.lineWidth = 3;
  ctx.strokeRect(ox + 272, oy + 150, 56, 52);
  ctx.fillStyle = '#2c3e50';
  ctx.font = 'bold 34px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(f.priceSix ? '6' : '5', ox + 300, oy + 178);
  ctx.font = '12px Georgia, serif';
  ctx.fillText('coins', ox + 300, oy + 196);

  // Crates, flower pots and the cat on the cobbles.
  rect(ctx, ox + 300, oy + 380, 44, 36, '#b98a4e');
  rect(ctx, ox + 348, oy + 392, 36, 24, '#a87f52');
  circle(ctx, ox + 520, oy + 430, 16, '#c96f4a');
  circle(ctx, ox + 520, oy + 412, 12, '#7bc96f');
  circle(ctx, ox + 516, oy + 404, 5, '#e4572e');
  circle(ctx, ox + 524, oy + 404, 5, '#f2b705');
  // The cat (wanders off in Picture B).
  if (!f.catGone) {
    ellipse(ctx, ox + 130, oy + 448, 26, 16, '#e8873a');
    circle(ctx, ox + 152, oy + 436, 13, '#e8873a');
    poly(ctx, [[ox + 142, oy + 428], [ox + 146, oy + 416], [ox + 150, oy + 428]], '#e8873a');
    poly(ctx, [[ox + 154, oy + 428], [ox + 160, oy + 416], [ox + 162, oy + 428]], '#e8873a');
    ctx.strokeStyle = '#e8873a';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(ox + 106, oy + 452);
    ctx.quadraticCurveTo(ox + 92, oy + 440, ox + 98, oy + 424);
    ctx.stroke();
    ctx.fillStyle = '#2c3e50';
    circle(ctx, ox + 156, oy + 434, 1.8, '#2c3e50');
  }
}

// ---------------------------------------------------------------- Round 3: Garden Dusk

const GARDEN_FLAGS = ['extraFirefly', 'flowerColor', 'moonFull', 'benchSlatGone', 'droplet', 'butterfly', 'stoneColor'];

function drawGarden(ctx, ox, oy, f) {
  const rng = makeRng(3303);
  // Dusk sky and lawn.
  let g = ctx.createLinearGradient(0, 0, 0, 340);
  g.addColorStop(0, '#2b2a55');
  g.addColorStop(0.6, '#6b4a7a');
  g.addColorStop(1, '#f28c6b');
  ctx.fillStyle = g;
  ctx.fillRect(ox, oy, 600, 340);
  g = ctx.createLinearGradient(0, 340, 0, 520);
  g.addColorStop(0, '#3f7a34');
  g.addColorStop(1, '#2c5a26');
  ctx.fillStyle = g;
  ctx.fillRect(ox, oy + 340, 600, 180);

  // Stars (seeded, identical in both panels).
  for (let i = 0; i < 46; i++) {
    const sx = ox + range(rng, 8, 592);
    const sy = oy + range(rng, 8, 200);
    const sr = range(rng, 1, 2.4);
    ctx.fillStyle = `rgba(255,255,255,${range(rng, 0.5, 1).toFixed(2)})`;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Moon: crescent in A, full in B.
  circle(ctx, ox + 80, oy + 70, 30, '#fdf6d8');
  if (!f.moonFull) {
    circle(ctx, ox + 92, oy + 62, 26, '#3a3560');
  } else {
    circle(ctx, ox + 72, oy + 62, 5, '#e8ddb0');
    circle(ctx, ox + 90, oy + 78, 4, '#e8ddb0');
    circle(ctx, ox + 84, oy + 58, 3, '#e8ddb0');
  }

  // Trees framing the garden.
  poly(ctx, [[ox + 0, oy + 340], [ox + 0, oy + 190], [ox + 46, oy + 150], [ox + 70, oy + 210], [ox + 58, oy + 340]], '#24401f');
  poly(ctx, [[ox + 600, oy + 340], [ox + 600, oy + 200], [ox + 556, oy + 158], [ox + 532, oy + 220], [ox + 544, oy + 340]], '#24401f');
  // Hedge along the back of the lawn.
  ctx.fillStyle = '#2c5a26';
  for (let x = 0; x < 600; x += 46) {
    ctx.beginPath();
    ctx.arc(ox + x + 23, oy + 348, 26, Math.PI, 0);
    ctx.fill();
  }

  // Fountain in the middle.
  ellipse(ctx, ox + 300, oy + 322, 92, 26, '#8a6d4b');
  ellipse(ctx, ox + 300, oy + 318, 82, 20, '#7ec8e3');
  ellipse(ctx, ox + 300, oy + 316, 66, 15, '#a5dcf0');
  rect(ctx, ox + 292, oy + 252, 16, 66, '#cbb59a');
  ellipse(ctx, ox + 300, oy + 252, 34, 10, '#cbb59a');
  ellipse(ctx, ox + 300, oy + 250, 26, 7, '#a5dcf0');
  // Water jets.
  ctx.strokeStyle = '#a5dcf0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ox + 300, oy + 250);
  ctx.quadraticCurveTo(ox + 282, oy + 224, ox + 272, oy + 252);
  ctx.moveTo(ox + 300, oy + 250);
  ctx.quadraticCurveTo(ox + 318, oy + 224, ox + 328, oy + 252);
  ctx.moveTo(ox + 300, oy + 250);
  ctx.lineTo(ox + 300, oy + 216);
  ctx.stroke();
  // A droplet flying free (appears in Picture B).
  if (f.droplet) {
    circle(ctx, ox + 300, oy + 222, 5, '#cfeeff');
    circle(ctx, ox + 300, oy + 234, 3, '#cfeeff');
  }

  // Bench on the right: one slat goes missing in Picture B.
  rect(ctx, ox + 452, oy + 402, 8, 40, '#5d3a1a');
  rect(ctx, ox + 540, oy + 402, 8, 40, '#5d3a1a');
  rect(ctx, ox + 446, oy + 384, 108, 10, '#8a6d4b');
  if (!f.benchSlatGone) rect(ctx, ox + 446, oy + 398, 108, 10, '#8a6d4b');
  rect(ctx, ox + 446, oy + 412, 108, 8, '#6b4f2a');
  // Bench backrest.
  rect(ctx, ox + 446, oy + 356, 108, 8, '#8a6d4b');
  rect(ctx, ox + 446, oy + 370, 108, 8, '#8a6d4b');
  rect(ctx, ox + 452, oy + 348, 8, 40, '#5d3a1a');
  rect(ctx, ox + 540, oy + 348, 8, 40, '#5d3a1a');

  // Stepping stones to the fountain (one changes colour in Picture B).
  const stones = [[300, 500], [330, 470], [288, 448], [316, 424]];
  stones.forEach(([sx, sy], i) => {
    const isChanged = f.stoneColor && i === 1;
    ellipse(ctx, ox + sx, oy + sy, 26, 11, isChanged ? '#c96f4a' : '#b8b0a4');
    ellipse(ctx, ox + sx, oy + sy, 20, 8, isChanged ? '#d98a68' : '#cfc8bc');
  });

  // Flower bed along the bottom.
  rect(ctx, ox + 30, oy + 452, 240, 56, '#2c5a26');
  const flowerSpots = [[70, 478], [110, 490], [150, 468], [190, 488], [230, 474]];
  flowerSpots.forEach(([fx, fy], i) => {
    ctx.strokeStyle = '#3f7a34';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ox + fx, oy + fy + 8);
    ctx.lineTo(ox + fx, oy + fy + 26);
    ctx.stroke();
    const petal = f.flowerColor && i === 2 ? '#5b8def' : '#f27bb1';
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2;
      circle(ctx, ox + fx + Math.cos(a) * 7, oy + fy + Math.sin(a) * 7, 5, petal);
    }
    circle(ctx, ox + fx, oy + fy, 5, '#f2b705');
  });
  // A second flower cluster on the right.
  [[560, 470], [580, 492], [540, 496]].forEach(([fx, fy]) => {
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2;
      circle(ctx, ox + fx + Math.cos(a) * 6, oy + fy + Math.sin(a) * 6, 4.5, '#e8e4f2');
    }
    circle(ctx, ox + fx, oy + fy, 4.5, '#f2b705');
  });

  // Fireflies (seeded): the same five glow in both panels, a sixth joins in B.
  const flies = [[120, 210], [220, 160], [360, 150], [480, 210], [520, 300]];
  if (f.extraFirefly) flies.push([420, 180]);
  flies.forEach(([fx, fy]) => {
    circle(ctx, ox + fx, oy + fy, 7, 'rgba(220,255,120,0.25)');
    circle(ctx, ox + fx, oy + fy, 3, '#dcff78');
  });

  // A butterfly flutters in (appears in Picture B).
  if (f.butterfly) {
    ellipse(ctx, ox + 192, oy + 372, 9, 6, '#f27bb1');
    ellipse(ctx, ox + 208, oy + 372, 9, 6, '#f27bb1');
    ellipse(ctx, ox + 194, oy + 384, 7, 5, '#e85d9e');
    ellipse(ctx, ox + 206, oy + 384, 7, 5, '#e85d9e');
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ox + 200, oy + 366);
    ctx.lineTo(ox + 200, oy + 390);
    ctx.stroke();
  }
}

// ---------------------------------------------------------------- rounds

export const ROUNDS = [
  {
    name: ROUND_NAMES[0],
    draw: drawHarbor,
    flags: HARBOR_FLAGS,
    diffs: [
      { id: 'gull', x: 260, y: 95, r: 24, label: 'The gull flew away', flag: 'gullGone' },
      { id: 'stripe', x: 100, y: 220, r: 26, label: 'Lighthouse stripe turned blue', flag: 'stripeBlue' },
      { id: 'crate', x: 213, y: 441, r: 24, label: 'An extra crate on the dock', flag: 'extraCrate' },
      { id: 'flag', x: 258, y: 345, r: 20, label: 'A flag on the little boat', flag: 'boatFlag' },
      { id: 'rays', x: 500, y: 70, r: 44, label: 'The sun lost its rays', flag: 'sunRaysGone' },
      { id: 'rope', x: 96, y: 494, r: 22, label: 'A rope coil on the landing', flag: 'ropeCoil' },
      { id: 'window', x: 525, y: 335, r: 22, label: 'The boathouse window went dark', flag: 'windowDark' },
    ],
  },
  {
    name: ROUND_NAMES[1],
    draw: drawMarket,
    flags: MARKET_FLAGS,
    diffs: [
      { id: 'awning', x: 430, y: 222, r: 30, label: 'The awning stripes changed colour', flag: 'awningColor' },
      { id: 'cat', x: 130, y: 448, r: 30, label: 'The cat wandered off', flag: 'catGone' },
      { id: 'balloon', x: 470, y: 96, r: 24, label: 'A balloon changed colour', flag: 'balloonColor' },
      { id: 'apple', x: 130, y: 292, r: 20, label: 'An apple became an orange', flag: 'appleOrange' },
      { id: 'price', x: 300, y: 176, r: 28, label: 'The price went from 5 to 6', flag: 'priceSix' },
      { id: 'bread', x: 95, y: 292, r: 24, label: 'The bread basket vanished', flag: 'breadGone' },
      { id: 'bird', x: 522, y: 50, r: 22, label: 'A bird landed on the roof', flag: 'birdLands' },
    ],
  },
  {
    name: ROUND_NAMES[2],
    draw: drawGarden,
    flags: GARDEN_FLAGS,
    diffs: [
      { id: 'firefly', x: 420, y: 180, r: 22, label: 'One more firefly', flag: 'extraFirefly' },
      { id: 'flower', x: 150, y: 468, r: 22, label: 'A flower changed colour', flag: 'flowerColor' },
      { id: 'moon', x: 80, y: 70, r: 34, label: 'The moon grew fuller', flag: 'moonFull' },
      { id: 'slat', x: 495, y: 403, r: 26, label: 'A bench slat went missing', flag: 'benchSlatGone' },
      { id: 'droplet', x: 300, y: 222, r: 20, label: 'A fountain droplet in mid-air', flag: 'droplet' },
      { id: 'butterfly', x: 200, y: 378, r: 24, label: 'A butterfly fluttered in', flag: 'butterfly' },
      { id: 'stone', x: 330, y: 470, r: 26, label: 'A stepping stone changed colour', flag: 'stoneColor' },
    ],
  },
];

// Build the flags object for one panel of a round: every flag false paints the
// original, every flag true paints the altered twin.
export function buildFlags(roundIndex, altered) {
  const flags = {};
  for (const key of ROUNDS[roundIndex].flags) flags[key] = altered;
  return flags;
}
