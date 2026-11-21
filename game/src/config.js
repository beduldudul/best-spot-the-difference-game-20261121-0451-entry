// Every tuning number, colour and level in one place. The playfield is a fixed
// 1280x720 logical area; the renderer scales it to the window, so no rule below
// depends on the screen size.

export const FIELD = { width: 1280, height: 720 };

/** The two picture panels: each 600 wide, 520 tall, side by side. */
export const PANEL = { width: 600, height: 520, top: 84, leftX: 20, rightX: 660 };

/** HUD strip at the top and the message strip at the bottom. */
export const HUD = { height: 72 };
export const FOOTER = { top: 616, height: 88 };

/** How many differences each round hides. */
export const DIFFS_PER_ROUND = 7;

/** Seconds on the clock when a round starts; each find adds a few back. */
export const ROUND_SECONDS = 120;
export const FIND_BONUS_SECONDS = 5;
export const ROUND_MAX_SECONDS = 150;

/** Wrong clicks before a heart is lost; hearts per round. */
export const HEARTS = 3;
export const WRONG_BEFORE_HEART = 1;

/** Points: a find, a streak bonus per consecutive find, a hint's cost, a time bonus. */
export const POINTS = { find: 100, streak: 25, hint: 50, timePerSecond: 5 };

/** A hint lights one unfound difference for this long, then rests this long. */
export const HINT = { showSeconds: 3, cooldownSeconds: 10 };

/** Rounds: name, scene key, and a short line shown under the title. */
export const ROUNDS = [
  { name: 'Harbor Morning', scene: 'harbor', tagline: 'Seven changes hide in the harbour light.' },
  { name: 'Market Day', scene: 'market', tagline: 'Seven changes hide among the stalls.' },
  { name: 'Garden Dusk', scene: 'garden', tagline: 'Seven changes hide as the fireflies wake.' },
];

export const PALETTE = {
  backdrop: '#171a26',
  panel: '#232838',
  panelEdge: '#3a4157',
  hud: '#1d2233',
  text: '#f2ead8',
  muted: '#9aa3b8',
  accent: '#f2c94c',
  accentSoft: '#ffd97a',
  good: '#7ddc8a',
  bad: '#e5534b',
  ring: '#ffd94d',
  ringSoft: 'rgba(255, 217, 77, 0.25)',
  timerBack: '#2a3040',
  timerLow: '#e5534b',
  timerOk: '#7ddc8a',
  heart: '#ff6b81',
  heartEmpty: '#3a4157',
  button: '#2f6fb2',
  buttonEdge: '#5b9bd5',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Where the best score is kept between visits (this browser only). */
export const BEST_KEY = 'twin-tides.best';
