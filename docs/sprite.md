# MNSprite for developers

## Layout

```
src/
  app/                 what ships; serve this folder
    index.html         the page; data-app="sprite" tells the host which app it is
    style.css          the app's layout and look
    brand/             Mundus Novus tokens, mn-app.css, mn-host.js, the Chancel font
    js/                the app (below)
    manifest.webmanifest, sw.js, icons
  icons/               the app icon at every size, .icns and .ico
  test/                tests (Node)
```

## The code, `src/app/js/`

Pure logic, which runs in Node for the tests and in the browser as `AS.*`:

| File | What it does |
| --- | --- |
| `zlib.js` | Inflate and deflate |
| `png.js`, `gif.js` | PNG, APNG and GIF encoders and the PNG decoder |
| `color.js` | Palettes, importers and presets |
| `model.js` | The document: layers, frames, tags, compositing, undo |
| `draw.js` | Drawing, fills, dithering and transforms |
| `export.js` | Sheets, Aseprite-compatible JSON, Godot resources |
| `aseprite.js` | The `.aseprite` reader (import only, written from the public spec) |
| `tools.js` | The assistant's tools |
| `ai.js` | The assistant's instructions and its tool-use loop |
| `rpc.js` | Lets a desktop shell drive the app |

The interface is in `ui-base.js`, `editor.js`, `panels.js` and `app.js`. Files and the assistant's key
go through `window.csHost` (`brand/mn-host.js`).

## The assistant's tools

`canvas_info set_canvas resize set_palette draw_pixels draw_shape fill_region ramp_fill draw_text texture
new_layer new_frame delete_frame delete_layer select layer_properties set_frame_duration set_tag
copy_frame_with_transform shift rotate mirror recolor outline drop_shadow shade_by_light_direction clear
view_canvas undo export`

Each tool is checked and applied as one undo step. `view_canvas` sends the model an enlarged picture of
the frame with a grid, so it can see what it drew.

## Tests

```bash
node --test src/test/
```
