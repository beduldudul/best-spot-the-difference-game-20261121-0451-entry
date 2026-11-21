# Twin Tides — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/beduldudul/best-spot-the-difference-game-20261121-0451-entry/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/beduldudul/best-spot-the-difference-game-20261121-0451-entry/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Entry for the make.fun bounty
[Make the best spot the difference game](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451).

Twin Tides is a complete spot-the-difference game that runs offline in a
desktop browser from its own files. Two near-identical pictures sit side by
side — a harbour morning, a market day, a garden at dusk — and seven changes
hide between them. Click a difference on either picture to ring it, watch the
counter climb, and beat the clock before the tide runs out.

## How it plays

- Three rounds, seven differences each, harder as the light fades.
- Click a difference on either picture: a ring marks it on both, with a
  chime and a few seconds back on the clock.
- A wrong click costs a heart. Three hearts a round; lose them, or let the
  timer run out, and the round starts over.
- Hints (H) light one hiding difference for a few seconds, for 50 points.
- Streaks pay: consecutive finds earn a growing bonus.
- P pauses, M mutes, R retries the round, Space starts.

## Run

```sh
node serve.ts
```

Then open http://localhost:8080. Or open game/index.html through any static
server. No network request, no build step, no library.

## Layout

- game/index.html — the page, loads the game.
- game/src/main.js — boot, the one loop, screens.
- game/src/config.js — tuning, palette, rounds.
- game/src/scenes.js — the three hand-drawn scenes and their differences.
- game/src/game.js — rounds, finds, clock, hearts, hints, score.
- game/src/render.js — panels, markers, HUD, screens.
- game/src/input.js — mouse and keyboard.
- game/src/audio.js — WebAudio chimes, no sound files.
- game/src/shots.js — the staged scenes behind ?shot= for screenshots.
- game/src/random.js — a seeded generator.
- main.ts — hands game/ and screenshots/ in and writes dossier.json.
- screenshots/ — four real renders of the game's own code.

## License

MIT. See LICENSE.
