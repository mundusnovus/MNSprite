#!/usr/bin/env node
// ChristianSprite for agents: the same tools the in-app assistant uses, run from the command line with Node 22+.
//   node agent/sprite.mjs tools                      list every tool with its input schema (JSON)
//   node agent/sprite.mjs run plan.json [out-dir]    run a plan and save the project, previews and exports
//   node agent/sprite.mjs view project.asprite.json  print an ASCII picture and facts about a saved project
// A plan: { "name": "lantern", "width": 16, "height": 16, "mode": "rgba", "open": "earlier.asprite.json",
//           "steps": [ { "tool": "set_palette", "input": { ... } }, ... ] }
// See AGENTS.md.
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const JS = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'app', 'js');
const M = require(join(JS, 'model.js')), { Session } = require(join(JS, 'session.js')), T = require(join(JS, 'tools.js'));
const [cmd, arg, outArg] = process.argv.slice(2);

function save(S, out, name) {
  const p = join(out, name + '.asprite.json');
  writeFileSync(p, JSON.stringify(S.doc.toJSON()));
  return p;
}
async function run(planPath, out) {
  const plan = JSON.parse(readFileSync(planPath, 'utf8'));
  const doc = plan.open ? M.Doc.fromJSON(readFileSync(resolve(dirname(planPath), plan.open), 'utf8')) : new M.Doc({ w: plan.width || 32, h: plan.height || 32, mode: plan.mode || 'rgba' });
  const S = new Session(doc), name = (plan.name || 'sprite').replace(/[^\w-]+/g, '-');
  mkdirSync(out, { recursive: true });
  const io = { write: async (rel, data) => { const p = join(out, T.checkRel(rel)); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, data); return { path: p }; } };
  let n = 0;
  for (const step of plan.steps || []) {
    n++;
    try {
      const r = await T.run(S, step.tool, step.input || {}, io);
      if (r && r.image) writeFileSync(join(out, `step-${n}-${step.tool}.png`), Buffer.from(r.image.base64, 'base64')); // what the assistant would see
      console.log(`${n}. ${step.tool}: ${(r && (r.text || r.message)) || 'ok'}`.split('\n')[0]);
    } catch (e) {
      console.error(`${n}. ${step.tool} failed: ${e.message}`);
      process.exitCode = 1;
      break;
    }
  }
  const view = await T.run(S, 'view_canvas', { scale: 8 }).catch(() => null);
  if (view && view.image) writeFileSync(join(out, name + '-preview.png'), Buffer.from(view.image.base64, 'base64'));
  console.log('saved ' + save(S, out, name) + (view ? ' and ' + name + '-preview.png' : ''));
}

if (cmd === 'tools') console.log(JSON.stringify(T.definitions(), null, 1));
else if (cmd === 'run' && arg) await run(arg, resolve(outArg || 'out'));
else if (cmd === 'view' && arg) { const S = new Session(M.Doc.fromJSON(readFileSync(arg, 'utf8'))); const r = await T.run(S, 'canvas_info', {}); console.log(r.text || JSON.stringify(r, null, 1)); }
else { console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 8).map((l) => l.replace(/^\/\/ ?/, '')).join('\n')); process.exitCode = cmd ? 1 : 0; }
