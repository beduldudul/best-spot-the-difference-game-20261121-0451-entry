// The three scenes. Each one draws into a 600x520 panel, and each takes a `diffs`
// object: for the left panel every flag is false (the original), for the right
// panel every flag is true (the altered twin). A difference is one small change
// a careful eye can catch and a fair one: nothing hides behind another object,
// and every one sits inside the picture.
//
// Each scene also lists its differences: an id, the panel-local x/y of its
// centre, a hit radius, and the friendly line shown when it is found.

function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, 340);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 600, 340);
}

function cloud(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.beginPath();
  ctx.ellipse(x, y, 42 * s, 20 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 28 * s, y + 6 * s, 28 * s, 15 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 30 * s, y + 6 * s, 30 * s, 16 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}

function gull(ctx, x, y, s) {
  ctx.strokeStyle = '#3a4257';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 12 * s, y);
  ctx.quadraticCurveTo(x - 5 * s, y - 8 * s, x, y);
  ctx.quadraticCurveTo(x + 5 * s, y - 8 * s, x + 12 * s, y);
  ctx.stroke();
}

function sun(ctx, x, y, rays) {
  if (rays) {
    ctx.strokeStyle = '#f2a93b';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * 44, y + Math.sin(a) * 44);
      ctx.lineTo(x + Math.cos(a) * 56, y + Math.sin(a) * 56);
      ctx.stroke();
    }
  }
  ctx.fillStyle = '#ffd94d';
  ctx.beginPath();
  ctx.arc(x, y, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffe98a';
  ctx.beginPath();
  ctx.arc(x, y, 24, 0, Math.PI * 2);
  ctx.fill();
}

function sea(ctx) {
  const g = ctx.createLinearGradient(0, 340, 0, 520);
  g.addColorStop(0, '#4d8fb5');
  g.addColorStop(1, '#2f6a8f');
  ctx.fillStyle = g;
  ctx.fillRect(0, 340, 600, 180);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  for (const [x, y, w] of [[60, 380, 70], [220, 410, 90], [400, 385, 80], [120, 450, 100], [330, 460, 70], [480, 440, 90]]) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + w / 2, y - 6, x + w, y);
    ctx.stroke();
  }
}

function lighthouse(ctx, stripe) {
  // Tower.
  ctx.fillStyle = '#f7f3e8';
  ctx.beginPath();
  ctx.moveTo(70, 340);
  ctx.lineTo(80, 150);
  ctx.lineTo(120, 150);
  ctx.lineTo(130, 340);
  ctx.closePath();
  ctx.fill();
  // Middle stripe: red in the original, blue in the altered twin.
  ctx.fillStyle = stripe ? '#3f6fb5' : '#d94f3d';
  ctx.beginPath();
  ctx.moveTo(74, 240);
  ctx.lineTo(78, 200);
  ctx.lineTo(122, 200);
  ctx.lineTo(126, 240);
  ctx.closePath();
  ctx.fill();
  // Light room and roof.
  ctx.fillStyle = '#2f3547';
  ctx.fillRect(76, 128, 48, 24);
  ctx.fillStyle = '#ffe98a';
  ctx.fillRect(82, 133, 36, 14);
  ctx.fillStyle = '#d94f3d';
  ctx.beginPath();
  ctx.moveTo(72, 128);
  ctx.lineTo(100, 104);
  ctx.lineTo(128, 128);
  ctx.closePath();
  ctx.fill();
  // Beam.
  ctx.fillStyle = 'rgba(255, 233, 138, 0.25)';
  ctx.beginPath();
  ctx.moveTo(124, 140);
  ctx.lineTo(220, 116);
  ctx.lineTo(220, 158);
  ctx.lineTo(124, 148);
  ctx.closePath();
  ctx.fill();
}

function sailboat(ctx, x, y, s, flag) {
  // Hull.
  ctx.fillStyle = '#8a5a33';
  ctx.beginPath();
  ctx.moveTo(x - 34 * s, y);
  ctx.lineTo(x + 34 * s, y);
  ctx.lineTo(x + 22 * s, y + 14 * s);
  ctx.lineTo(x - 22 * s, y + 14 * s);
  ctx.closePath();
  ctx.fill();
  // Mast and sail.
  ctx.strokeStyle = '#5a3d24';
  ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 52 * s);
  ctx.stroke();
  ctx.fillStyle = '#fdf6e3';
  ctx.beginPath();
  ctx.moveTo(x, y - 50 * s);
  ctx.lineTo(x, y - 6 * s);
  ctx.lineTo(x + 26 * s, y - 6 * s);
  ctx.closePath();
  ctx.fill();
  if (flag) {
    ctx.fillStyle = '#d94f3d';
    ctx.beginPath();
    ctx.moveTo(x, y - 52 * s);
    ctx.lineTo(x + 16 * s, y - 47 * s);
    ctx.lineTo(x, y - 42 * s);
    ctx.closePath();
    ctx.fill();
  }
}

function dock(ctx, crate, rope) {
  ctx.fillStyle = '#7a5a38';
  ctx.fillRect(0, 458, 270, 62);
  ctx.strokeStyle = '#5a3d24';
  ctx.lineWidth = 2;
  for (let x = 0; x <= 270; x += 45) {
    ctx.beginPath();
    ctx.moveTo(x, 458);
    ctx.lineTo(x, 520);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(0, 482);
  ctx.lineTo(270, 482);
  ctx.stroke();
  // Crates.
  ctx.fillStyle = '#b98a4a';
  ctx.fillRect(36, 424, 34, 34);
  ctx.fillRect(74, 424, 34, 34);
  ctx.fillRect(54, 392, 34, 32);
  ctx.strokeStyle = '#7a5a38';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 424, 34, 34);
  ctx.strokeRect(74, 424, 34, 34);
  ctx.strokeRect(54, 392, 34, 32);
  if (crate) {
    ctx.fillStyle = '#b98a4a';
    ctx.fillRect(196, 424, 34, 34);
    ctx.strokeStyle = '#7a5a38';
    ctx.strokeRect(196, 424, 34, 34);
  }
  if (rope) {
    ctx.strokeStyle = '#d9c08a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(96, 494, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(96, 494, 8, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function boathouse(ctx, lit) {
  ctx.fillStyle = '#a86a42';
  ctx.fillRect(470, 300, 110, 60);
  ctx.fillStyle = '#7a4a2c';
  ctx.beginPath();
  ctx.moveTo(462, 300);
  ctx.lineTo(525, 268);
  ctx.lineTo(588, 300);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = lit ? '#ffe98a' : '#3a4257';
  ctx.fillRect(508, 322, 34, 26);
  ctx.strokeStyle = '#5a3d24';
  ctx.lineWidth = 2;
  ctx.strokeRect(508, 322, 34, 26);
  ctx.beginPath();
  ctx.moveTo(525, 322);
  ctx.lineTo(525, 348);
  ctx.stroke();
}

function drawHarbor(ctx, d) {
  sky(ctx, '#a8d4e6', '#fdf3d0');
  sun(ctx, 500, 70, !d.sunrays);
  cloud(ctx, 120, 70, 1);
  cloud(ctx, 320, 48, 0.8);
  cloud(ctx, 450, 116, 0.7);
  if (!d.gull) gull(ctx, 260, 95, 1);
  gull(ctx, 150, 120, 0.9);
  gull(ctx, 380, 140, 0.8);
  sea(ctx);
  lighthouse(ctx, d.stripe);
  sailboat(ctx, 250, 392, 1, !d.flag);
  sailboat(ctx, 420, 408, 0.8, true);
  boathouse(ctx, !d.window);
  dock(ctx, d.crate, !d.rope);
}

export const HARBOR_DIFFS = [
  { id: 'gull', x: 260, y: 95, r: 24, label: 'a gull that flew away' },
  { id: 'stripe', x: 100, y: 220, r: 28, label: 'the lighthouse stripe changed colour' },
  { id: 'crate', x: 213, y: 441, r: 26, label: 'an extra crate on the dock' },
  { id: 'flag', x: 258, y: 345, r: 22, label: "the boat's little flag" },
  { id: 'sunrays', x: 500, y: 70, r: 44, label: 'the sun lost its rays' },
  { id: 'rope', x: 96, y: 494, r: 24, label: 'a coil of rope on the dock' },
  { id: 'window', x: 525, y: 335, r: 24, label: 'the boathouse window went dark' },
];

function awning(ctx, x, y, w, colourA, colourB) {
  for (let i = 0; i < 6; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? colourA : colourB;
    ctx.fillRect(x + (i * w) / 6, y, w / 6, 26);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(x, y + 22, w, 4);
}

function stall(ctx, x, baseY, awningA, awningB) {
  ctx.strokeStyle = '#5a3d24';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x + 8, baseY - 120);
  ctx.lineTo(x + 8, baseY);
  ctx.moveTo(x + 192, baseY - 120);
  ctx.lineTo(x + 192, baseY);
  ctx.stroke();
  awning(ctx, x, baseY - 122, 200, awningA, awningB);
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(x, baseY - 40, 200, 40);
  ctx.fillStyle = '#b98a4a';
  ctx.fillRect(x - 6, baseY - 48, 212, 10);
}

function fruitPile(ctx, x, y, swapOne) {
  const fruits = ['#d94f3d', '#e8833a', '#d94f3d', '#e8833a', '#d94f3d'];
  fruits.forEach((colour, i) => {
    ctx.fillStyle = i === 2 && swapOne ? '#f2a93b' : colour;
    ctx.beginPath();
    ctx.arc(x + i * 22 - 44, y - (i % 2) * 10, 11, 0, Math.PI * 2);
    ctx.fill();
  });
}

function cat(ctx, x, y) {
  ctx.fillStyle = '#3a3f4d';
  ctx.beginPath();
  ctx.ellipse(x, y, 18, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 14, y - 12, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 7, y - 20);
  ctx.lineTo(x + 10, y - 30);
  ctx.lineTo(x + 14, y - 20);
  ctx.closePath();
  ctx.moveTo(x + 16, y - 21);
  ctx.lineTo(x + 20, y - 30);
  ctx.lineTo(x + 23, y - 20);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#3a3f4d';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 16, y + 4);
  ctx.quadraticCurveTo(x - 30, y - 8, x - 26, y - 20);
  ctx.stroke();
}

function balloon(ctx, x, y, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.ellipse(x, y, 14, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#5a3d24';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y + 18);
  ctx.quadraticCurveTo(x + 6, y + 44, x - 2, y + 70);
  ctx.stroke();
}

function drawMarket(ctx, d) {
  sky(ctx, '#f7d9a0', '#fdf3d0');
  cloud(ctx, 140, 60, 0.9);
  cloud(ctx, 430, 50, 0.8);
  // Back wall and ground.
  ctx.fillStyle = '#e8c99a';
  ctx.fillRect(0, 300, 600, 220);
  ctx.fillStyle = '#c9a06a';
  ctx.fillRect(0, 430, 600, 90);
  // Stalls.
  stall(ctx, 40, 340, '#d94f3d', '#fdf6e3');
  stall(ctx, 330, 340, d.awning ? '#4d8f5a' : '#d94f3d', '#fdf6e3');
  // Goods on the counters.
  fruitPile(ctx, 130, 300, d.fruit);
  ctx.fillStyle = '#7a5a38';
  ctx.fillRect(400, 282, 90, 12);
  ctx.fillStyle = '#e8c99a';
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.arc(412 + i * 16, 280, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  if (!d.basket) {
    ctx.fillStyle = '#a86a42';
    ctx.beginPath();
    ctx.ellipse(95, 296, 26, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e8c99a';
    ctx.beginPath();
    ctx.ellipse(95, 290, 22, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Hanging sign with a price.
  ctx.fillStyle = '#2f3547';
  ctx.fillRect(268, 150, 64, 40);
  ctx.fillStyle = '#f2ead8';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FRESH', 300, 168);
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.fillText(d.price ? '6' : '5', 300, 184);
  ctx.textAlign = 'left';
  // Balloons on the right stall.
  balloon(ctx, 430, 110, '#d94f3d');
  balloon(ctx, 470, 96, d.balloon ? '#4d8f5a' : '#3f6fb5');
  balloon(ctx, 510, 114, '#f2c94c');
  // The cat, and the bird that only lands in the altered twin.
  if (!d.cat) cat(ctx, 130, 452);
  if (d.bird) {
    ctx.fillStyle = '#3a4257';
    ctx.beginPath();
    ctx.ellipse(520, 52, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(530, 46, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  // Bunting across the top.
  ctx.strokeStyle = '#5a3d24';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 18);
  ctx.quadraticCurveTo(300, 52, 600, 14);
  ctx.stroke();
  const bunting = ['#d94f3d', '#f2c94c', '#3f6fb5', '#4d8f5a'];
  for (let i = 0; i < 12; i += 1) {
    const x = 25 + i * 48;
    const y = 18 + Math.sin((i / 11) * Math.PI) * 22;
    ctx.fillStyle = bunting[i % 4];
    ctx.beginPath();
    ctx.moveTo(x - 9, y);
    ctx.lineTo(x + 9, y);
    ctx.lineTo(x, y + 16);
    ctx.closePath();
    ctx.fill();
  }
}

export const MARKET_DIFFS = [
  { id: 'awning', x: 430, y: 222, r: 28, label: 'the awning changed its stripes' },
  { id: 'cat', x: 130, y: 448, r: 26, label: 'the market cat wandered off' },
  { id: 'balloon', x: 470, y: 96, r: 24, label: 'a balloon changed colour' },
  { id: 'fruit', x: 130, y: 292, r: 24, label: 'an apple turned into an orange' },
  { id: 'price', x: 300, y: 176, r: 24, label: 'the price tag changed' },
  { id: 'basket', x: 95, y: 292, r: 26, label: 'a basket of bread vanished' },
  { id: 'bird', x: 522, y: 50, r: 22, label: 'a bird landed on the roof' },
];

function firefly(ctx, x, y, glow) {
  if (glow) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, 16);
    g.addColorStop(0, 'rgba(255, 233, 138, 0.8)');
    g.addColorStop(1, 'rgba(255, 233, 138, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#ffe98a';
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();
}

function flower(ctx, x, y, colour) {
  ctx.strokeStyle = '#3f6b3a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 22);
  ctx.stroke();
  ctx.fillStyle = colour;
  for (let i = 0; i < 5; i += 1) {
    const a = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * 7, y + Math.sin(a) * 7, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#f2c94c';
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawGarden(ctx, d) {
  const g = ctx.createLinearGradient(0, 0, 0, 520);
  g.addColorStop(0, '#3a2d5c');
  g.addColorStop(0.6, '#8a4a6b');
  g.addColorStop(1, '#e8a06a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 600, 520);
  // Stars.
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (const [x, y] of [[40, 40], [150, 26], [260, 60], [360, 30], [470, 44], [540, 90], [200, 90], [330, 110]]) {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  // Moon: a crescent in the original, a fuller moon in the altered twin.
  ctx.fillStyle = '#fdf3d0';
  ctx.beginPath();
  ctx.arc(80, 70, 30, 0, Math.PI * 2);
  ctx.fill();
  if (!d.moon) {
    ctx.fillStyle = '#3a2d5c';
    ctx.beginPath();
    ctx.arc(92, 64, 26, 0, Math.PI * 2);
    ctx.fill();
  }
  // Ground and path.
  ctx.fillStyle = '#2f4a2f';
  ctx.fillRect(0, 380, 600, 140);
  ctx.fillStyle = '#c9b896';
  const stones = [[250, 470, 0], [290, 445, 1], [330, 470, 0], [370, 445, 1]];
  stones.forEach(([x, y], i) => {
    ctx.fillStyle = i === 2 && d.stone ? '#8a6a9a' : '#c9b896';
    ctx.beginPath();
    ctx.ellipse(x, y, 26, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  // Fountain.
  ctx.fillStyle = '#8a8fa3';
  ctx.beginPath();
  ctx.ellipse(300, 330, 70, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#6a7a9a';
  ctx.fillRect(292, 250, 16, 84);
  ctx.fillStyle = '#a8c8e6';
  ctx.beginPath();
  ctx.ellipse(300, 328, 58, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(168, 200, 230, 0.9)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, 250);
  ctx.quadraticCurveTo(280, 210, 262, 240);
  ctx.moveTo(300, 250);
  ctx.quadraticCurveTo(320, 210, 338, 240);
  ctx.stroke();
  if (!d.droplet) {
    ctx.fillStyle = '#a8c8e6';
    ctx.beginPath();
    ctx.arc(300, 222, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  // Bench.
  ctx.fillStyle = '#6a4a2c';
  ctx.fillRect(440, 380, 110, 10);
  if (!d.slat) ctx.fillRect(440, 398, 110, 10);
  ctx.fillRect(440, 416, 110, 10);
  ctx.fillRect(448, 388, 8, 48);
  ctx.fillRect(534, 388, 8, 48);
  // Flowers along the bottom.
  flower(ctx, 60, 470, '#e86a8a');
  flower(ctx, 110, 480, '#e86a8a');
  flower(ctx, 150, 468, d.flower ? '#6a9ad9' : '#e86a8a');
  flower(ctx, 480, 480, '#e86a8a');
  flower(ctx, 530, 468, '#f2c94c');
  // Fireflies.
  firefly(ctx, 180, 180, true);
  firefly(ctx, 260, 140, true);
  firefly(ctx, 350, 200, true);
  if (d.firefly) firefly(ctx, 420, 180, true);
  firefly(ctx, 500, 240, true);
  // The butterfly that only visits the altered twin.
  if (d.butterfly) {
    ctx.fillStyle = '#e86a8a';
    ctx.beginPath();
    ctx.ellipse(192, 376, 10, 7, -0.5, 0, Math.PI * 2);
    ctx.ellipse(208, 376, 10, 7, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3a2d5c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 372);
    ctx.lineTo(200, 384);
    ctx.stroke();
  }
}

export const GARDEN_DIFFS = [
  { id: 'firefly', x: 420, y: 180, r: 20, label: 'one more firefly woke up' },
  { id: 'flower', x: 150, y: 468, r: 22, label: 'a flower changed colour' },
  { id: 'moon', x: 80, y: 70, r: 36, label: 'the moon grew fuller' },
  { id: 'slat', x: 495, y: 403, r: 24, label: 'a bench slat went missing' },
  { id: 'droplet', x: 300, y: 222, r: 20, label: 'a drop of fountain water' },
  { id: 'butterfly', x: 200, y: 378, r: 22, label: 'a butterfly fluttered in' },
  { id: 'stone', x: 330, y: 470, r: 24, label: 'a stepping stone changed colour' },
];

/** The scenes by key: draw function plus its difference list. */
export const SCENES = {
  harbor: { draw: drawHarbor, diffs: HARBOR_DIFFS },
  market: { draw: drawMarket, diffs: MARKET_DIFFS },
  garden: { draw: drawGarden, diffs: GARDEN_DIFFS },
};

/** Build the flags object for a panel: false everywhere for the left panel,
// true everywhere for the right panel. */
export function diffFlags(sceneKey, altered) {
  const flags = {};
  for (const diff of SCENES[sceneKey].diffs) flags[diff.id] = altered;
  return flags;
}
