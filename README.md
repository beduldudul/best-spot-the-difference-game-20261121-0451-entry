# Twin Tides — Spot the Difference

[![make.fun bounty](https://img.shields.io/badge/make.fun-bounty-blue)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![game](https://img.shields.io/badge/game-spot--the--difference-teal)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![offline](https://img.shields.io/badge/plays-offline-green)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

**Twin Tides** is an original spot-the-difference game for the [make.fun bounty](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451): two near-identical pictures side by side, seven differences hiding in each, three hand-drawn scenes to hunt through. Everything is drawn procedurally on canvas — no image files, no libraries, no network requests.

## How to play

- **Click a difference** on either picture — it gets a gold ring and a check on both sides.
- **3 rounds, 7 differences each** (21 total): Harbor Morning, Market Day, Garden Dusk.
- **120 seconds per round**, +5s per find (cap 150s). Each find is **+100 points**, plus **+25 per find in a row** (streak bonus). Clearing a round adds **+5 points per second left**.
- **3 hearts per round** — a wrong click costs one. Timer out or hearts out ends the round.
- **H** — hint (−50 points, lights one unfound difference for 3s, 10s cooldown).
- **P** pause · **M** mute · **R** retry the round · **Space** start / next.
- Best score is kept in `localStorage` under `twin-tides.best`.

## How to run

```sh
node serve.ts
# open http://localhost:8080
```

Or serve `game/` with any static server (`python3 -m http.server` from `game/`). Open `game/index.html` — it plays offline in desktop Chrome.

## Screenshots

`?shot=` stages the game for screenshots: `start` (title), `play` (round 1, 3 found), `play2` (round 2, 2 found), `end` (win screen). See `shots.json`.

## Layout

- `game/index.html` — the page, loads `game/src/main.js`
- `game/src/config.js` — tuning, palette, board geometry
- `game/src/random.js` — seeded RNG (both panels match except the 7 differences)
- `game/src/scenes.js` — the three scenes + the difference lists + flags builder
- `game/src/game.js` — rules: state, scoring, timer, hearts, hints, rounds
- `game/src/render.js` — panels, markers, HUD, overlays
- `game/src/input.js` — mouse mapping + keyboard
- `game/src/audio.js` — WebAudio chimes (no sound files)
- `game/src/shots.js` — screenshot staging
- `game/src/main.js` — boot + frame loop + `?shot=` support
- `main.ts` — the entry program: copies `game/` + `screenshots/` to the output dir and writes `dossier.json`
- `serve.ts` — tiny static server for local play

## License

MIT — see `LICENSE`.
