// Twin Tides — Spot the Difference
// config.js — every tunable number, the palette, and the board geometry in one place.

export const VIEW = { width: 1280, height: 720 };

export const PANEL = {
  width: 600,
  height: 520,
  top: 84,
  leftX: 20,
  rightX: 660,
  gap: 40,
};

export const HUD = { height: 76 };
export const FOOTER = { top: 612, height: 100 };

export const RULES = {
  rounds: 3,
  differencesPerRound: 7,
  timerStart: 120, // seconds per round
  timerMax: 150, // hard cap after +5s bonuses
  timeBonusPerFind: 5, // seconds added per find
  timeBonusPerSecondLeft: 5, // points per second left on round clear
  pointsPerFind: 100,
  streakBonus: 25, // extra points per consecutive find
  hearts: 3,
  hintCost: 50,
  hintCooldown: 10, // seconds between hints
  hintFlash: 3, // seconds a hinted difference glows
  foundLabelTime: 2.5, // seconds a found label stays on screen
};

export const BEST_KEY = 'twin-tides.best';

export const ROUND_NAMES = ['Harbor Morning', 'Market Day', 'Garden Dusk'];

export const PALETTE = {
  ink: '#1d2b3a',
  paper: '#fdf6e3',
  gold: '#f2b705',
  goldDeep: '#c98a04',
  coral: '#e4572e',
  teal: '#17a398',
  sea: '#2e6f8e',
  skyDay: '#aee3f5',
  skyWarm: '#ffd9a0',
  duskTop: '#2b2a55',
  duskBottom: '#f28c6b',
  panelBorder: '#233246',
  hudBg: '#16222f',
  hudText: '#f4ead5',
  danger: '#e4572e',
  ok: '#7bc96f',
};
