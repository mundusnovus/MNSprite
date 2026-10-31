# Asteria Sprite

<img src="src/icons/sprite-256.png" alt="" width="96">

A free pixel-art editor and animator from **Asteria Technology**. Draw by hand, or tell the assistant what you
want and watch it build the sprite on the canvas, one undoable step at a time.

Use it at **asteria.technology/sprite**, install it from there as an app, or download it for macOS,
Windows or Linux.

## What it does

- Layers with blend modes, frames, tags, onion skin and playback; indexed and full-colour modes.
- Pencil, shading and dither brushes, fills, shapes, selections, mirror and tiled drawing.
- Outline, drop shadow, light-direction shading, RotSprite-style rotation and Scale2x.
- Palettes: make ramps, import GPL, hex, JASC or PNG, and start from classic presets.
- Export sprite sheets with Aseprite-compatible JSON and Godot resources, plus PNG, GIF and APNG.
  `.aseprite` files open read-only.

## What is new since Vigil Sprite

- **Runs anywhere.** In a browser tab, as an installed app that works offline, or in our desktop shells.
- **Your key, your device.** The assistant uses your own Anthropic key. It is stored only on your device
  and sent only to Anthropic.
- **New assistant tools.** `ramp_fill` (dithered gradients), `draw_text` (lettering in the Asteria Pixel pixel
  face) and `texture` (scanlines, checker, grain, noise).
- **Easier to use.** Light and dark themes in Asteria Technology colours, and a layout that works on phones
  and tablets.

Files saved by Vigil Sprite (`.asprite.json`) still open.

## Ask your agent

An AI agent that can run code (Claude in Cowork, ChatGPT in agent mode or Codex) can make things with this app from
the command line. Point it at this repository and ask it to read [AGENTS.md](AGENTS.md).

## Run it from source

There is nothing to build. Serve `src/app/` with any web server:

```bash
python3 -m http.server -d src/app 8000
```

Then open http://localhost:8000. Details for developers are in [docs/sprite.md](docs/sprite.md).

Asteria Sprite is original code. It is not Aseprite and is not affiliated with it.

## License

Free and open source under the **Asteria License 1.0** (GPL-3.0-only); see
[LICENSING.md](LICENSING.md).
