# ChristianSprite, for AI agents

You are helping someone make pixel art with ChristianSprite, a free pixel-art editor and animator. You can draw
without a browser: `agent/sprite.mjs` runs the same tools the app's own assistant uses and saves a project the person
can open and change in ChristianSprite, plus PNG, GIF or sprite-sheet exports.

## What you need

Node.js 22 or later. Nothing to install: there are no packages.

## How to make a sprite

1. See the tools and what each one takes:

   ```bash
   node agent/sprite.mjs tools
   ```

2. Write a plan: a JSON file with the canvas size and a list of tool calls in order. `agent/example-plan.json` draws
   a small lantern.

   ```json
   { "name": "knight", "width": 32, "height": 32, "steps": [ { "tool": "set_palette", "input": { "colors": ["#00000000", "#140708"] } } ] }
   ```

   To change an existing project, add `"open": "that.asprite.json"`.

3. Run it:

   ```bash
   node agent/sprite.mjs run plan.json out
   ```

   It prints what each step did and saves `out/<name>.asprite.json` and `out/<name>-preview.png`, an enlarged view
   with a grid. A `view_canvas` step also saves a picture of that moment. Look at the previews: they are how you see
   your work. Fix what looks wrong and run again.

4. Export with an `export` step, for example `{ "tool": "export", "input": { "format": "sheet", "path": "knight/knight.png", "scale": 4 } }`.
   Files go into the output folder.

5. Give the person the `.asprite.json` (they open it at https://sprite.christiansystems.org/app/ with Open, or in the
   desktop app) and the exports.

## Drawing well

- Plan the palette first (a few ramps from dark to light), then the silhouette, then block in colours, then shade
  and highlight from one light direction, then outline.
- `draw_pixels` takes legend rows: each character is a palette index (`0`-`9`, then `a`-`z`, `A`-`Z`), and `.` is
  transparent. `canvas_info` shows the legend for the current palette. Rows like `4x. 3xa` repeat a character.
- `ramp_fill`, `outline`, `drop_shadow` and `shade_by_light_direction` do a lot in one step.
- Animate with `new_frame` or `copy_frame_with_transform`, and name loops with `set_tag`.

## Please

- Work in your own folder (`out/` or the person's). Do not change `src/` unless the person asks you to.
- Keep it kind: no cruel, sexual or hateful images.
- ChristianSprite is free and open source under the Christian Systems License (GPL-3.0-only). What the person makes
  is theirs.
