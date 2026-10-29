'use strict';
// Loads the pure modules the way index.html does (plain scripts setting window.AS.*, no `module`), so lookups
// between modules are checked under browser names, not just Node's require() paths.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs'), path = require('path'), vm = require('vm');

const APP = path.join(__dirname, '..', 'app');
function loadBrowserGlobals() {
  const html = fs.readFileSync(path.join(APP, 'index.html'), 'utf8');
  const order = [...html.matchAll(/<script src="js\/([a-z-]+)\.js"><\/script>/g)].map((m) => m[1]);
  const pure = ['zlib', 'png', 'gif', 'color', 'model', 'draw', 'export', 'aseprite', 'session', 'tools', 'ai', 'rpc'];
  const ctx = { console, Uint8Array, Uint16Array, Uint32Array, Int32Array, Float32Array, Float64Array, Map, Set, Promise, TextEncoder, TextDecoder };
  ctx.window = ctx;
  vm.createContext(ctx);
  order.filter((n) => pure.includes(n)).forEach((n) => vm.runInContext(fs.readFileSync(path.join(APP, 'js', n + '.js'), 'utf8'), ctx, { filename: n + '.js' }));
  return ctx.AS;
}

test('page globals: every module the page loads is registered', () => {
  const AS = loadBrowserGlobals();
  for (const n of ['zlib', 'png', 'gif', 'color', 'model', 'draw', 'exporter', 'aseprite', 'session', 'tools', 'ai', 'rpc']) assert.ok(AS[n], 'AS.' + n);
});

test('page globals: the export tool writes a PNG', async () => {
  const AS = loadBrowserGlobals();
  const S = new AS.session.Session(new AS.model.Doc({ w: 4, h: 4, mode: 'rgba' }));
  await AS.tools.run(S, 'draw_shape', { shape: 'rect', x0: 0, y0: 0, x1: 3, y1: 3, color: '#e3261c', fill: true });
  const files = {};
  const res = await AS.tools.run(S, 'export', { format: 'png', path: 'red.png', scale: 2 }, { write: (p, d) => { files[p] = d; return Promise.resolve({ path: p }); } });
  assert.strictEqual(res.ok, true);
  assert.deepStrictEqual(Array.from(files['red.png'].slice(0, 8)), [137, 80, 78, 71, 13, 10, 26, 10]);
});
