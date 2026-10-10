// Verifies the agent scaffold: frontmatter of every Copilot customization file,
// the JSON Schema compiles under draft 2020-12, and the schema's conditional rules hold.
// Run from the repo root: npm run verify
import fs from 'node:fs';
import path from 'node:path';
import { load as yamlLoad } from 'js-yaml';
import Ajv2020 from 'ajv/dist/2020.js';

const fm = (p) => {
  const t = fs.readFileSync(p, 'utf8');
  const m = t.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) throw new Error('no frontmatter: ' + p);
  return yamlLoad(m[1]);
};

let ok = true;
const report = (pass, msg) => { if (!pass) ok = false; console.log((pass ? 'ok   ' : 'FAIL ') + msg); };

// 1. Frontmatter
const agentFiles = fs.readdirSync('.github/agents').map(f => `.github/agents/${f}`);
report(agentFiles.every(f => f.endsWith('.agent.md')), `agents/ contains only *.agent.md files (${agentFiles.length})`);
const files = [
  ...agentFiles,
  ...fs.readdirSync('.github/instructions').map(f => `.github/instructions/${f}`),
  ...fs.readdirSync('.github/skills').map(d => `.github/skills/${d}/SKILL.md`),
];
for (const f of files) {
  try {
    const y = fm(f);
    const checks = [];
    if (f.includes('/skills/')) {
      const dir = path.basename(path.dirname(f));
      checks.push(['name==dir', y.name === dir], ['name fmt', /^[a-z0-9-]{1,64}$/.test(y.name)],
        ['desc<=1024', typeof y.description === 'string' && y.description.length <= 1024]);
      // every linked reference file must exist
      const body = fs.readFileSync(f, 'utf8');
      for (const m of body.matchAll(/\]\((references\/[^)#]+)\)/g)) {
        checks.push([`link ${m[1]}`, fs.existsSync(path.join(path.dirname(f), m[1]))]);
      }
    }
    if (f.endsWith('.agent.md')) checks.push(['tools array', Array.isArray(y.tools)]);
    if (f.endsWith('.instructions.md')) checks.push(['applyTo', typeof y.applyTo === 'string']);
    const bad = checks.filter(([, v]) => v === false).map(([k]) => k);
    report(bad.length === 0, `${f}${bad.length ? '  failed: ' + bad.join(', ') : ''}`);
  } catch (e) { report(false, `${f} ${e.message}`); }
}

// 2. Schema compiles
const schemaPath = '.github/skills/requirements-extraction/references/requirement-schema.json';
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: false });
const validate = ajv.compile(schema);
report(true, 'schema compiles (draft 2020-12)');

// 3. Conditional rules
const run = '2026-09-20T10:00Z';
const base = {
  id: 'FR-001', version: 1, title: 'Create task', description: 'User creates a task', type: 'FUNCTIONAL',
  source: ['US-001'], evidence: 'As a user I want to create a task', origin: 'EXPLICIT', rationale: null, promoted_from: null,
  confidence: 'HIGH', priority: 'MUST', priority_status: 'PROPOSED', status: 'DRAFT', phase: 'MVP', scope: 'IN',
  dependencies: [], business_rules: [], acceptance_criteria: ['Given a logged-in user When they submit a title Then a task is created'],
  open_questions: [], risks: [], client_visible: true, created_in_run: run, change_log: [{ date: '2026-09-20', by: 'agent', change: 'created' }],
};
const doc = (reqs) => ({
  schema_version: '1.0',
  project: { name: 'X', domain: ['saas-b2b'], description: 'd', input_dir: 'user-stories/', last_run: run, last_run_mode: 'analyze' },
  stories: [{ id: 'US-001', title: 't', path: 'user-stories/US-001.md', source_refs: [] }],
  requirements: reqs, ambiguities: [], gaps: [], questions: [], risks: [], innovations: [], trends: [],
  validation: { last_run: null, gate: 'NONE', result: 'NOT_RUN', issues: [] },
});
const cases = [
  ['valid EXPLICIT FR', doc([base]), true],
  ['EXPLICIT without evidence', doc([{ ...base, evidence: null }]), false],
  ['INFERRED without rationale', doc([{ ...base, origin: 'INFERRED', evidence: null }]), false],
  ['UNKNOWN without question', doc([{ ...base, origin: 'UNKNOWN', evidence: null }]), false],
  ['UNKNOWN with question', doc([{ ...base, origin: 'UNKNOWN', evidence: null, open_questions: ['Q-001'] }]), true],
  ['NFR without metric', doc([{ ...base, id: 'NFR-001', type: 'NON_FUNCTIONAL' }]), false],
  ['NFR with metric', doc([{ ...base, id: 'NFR-001', type: 'NON_FUNCTIONAL', nfr_metric: { metric: 'p95', target: '≤ 300 ms', measurement: 'load test' } }]), true],
  ['type/prefix mismatch', doc([{ ...base, id: 'NFR-001' }]), false],
  ['promoted_from with origin EXPLICIT', doc([{ ...base, promoted_from: 'INN-001' }]), false],
  ['promoted_from with origin RECOMMENDED', doc([{ ...base, promoted_from: 'INN-001', origin: 'RECOMMENDED', rationale: 'accepted by dev', evidence: null, source: [] }]), true],
  ['bad acceptance criterion format', doc([{ ...base, acceptance_criteria: ['user can create task'] }]), false],
  ['unknown extra property', doc([{ ...base, foo: 1 }]), false],
  ['APPROVED is schema-valid (gate enforces who set it)', doc([{ ...base, status: 'APPROVED' }]), true],
];
for (const [name, d, expect] of cases) {
  const v = validate(d);
  report(v === expect, `${name} -> valid=${v} (expected ${expect})`);
}

// 4. Requirements documents: the worked example, plus draft.json / requirements.json when present.
//    Schema validity, plus cross-checks the schema cannot express.
// "verbatim" = story text with Markdown emphasis markers dropped and whitespace collapsed
const norm = (s) => s.replace(/\*\*|\*/g, '').replace(/\s+/g, ' ').trim();
const checkDoc = (p) => {
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  const v = validate(d);
  report(v, `${p} validates${v ? '' : ': ' + JSON.stringify(validate.errors.slice(0, 3))}`);
  if (!v) return;
  const storyText = Object.fromEntries(d.stories
    .filter(s => fs.existsSync(s.path)).map(s => [s.id, norm(fs.readFileSync(s.path, 'utf8'))]));
  const qs = new Map(d.questions.map(q => [q.id, q]));
  const ids = d.requirements.map(r => r.id);
  const bad = [];
  if (new Set(ids).size !== ids.length) bad.push('duplicate requirement IDs');
  for (const r of d.requirements) {
    if (r.origin === 'EXPLICIT') {
      const texts = r.source.map(id => storyText[id]).filter(Boolean);
      if (texts.length && !texts.some(t => t.includes(norm(r.evidence)))) bad.push(`${r.id} evidence not verbatim in ${r.source.join(',')}`);
    }
    for (const q of r.open_questions) {
      if (!qs.has(q)) bad.push(`${r.id} -> missing ${q}`);
      else if (!qs.get(q).blocks.includes(r.id)) bad.push(`${q}.blocks lacks ${r.id}`);
    }
    if (r.type === 'NON_FUNCTIONAL' && r.nfr_metric.target === 'UNKNOWN' && r.origin !== 'UNKNOWN') bad.push(`${r.id} target UNKNOWN but origin ${r.origin}`);
  }
  report(bad.length === 0, `${p} cross-checks (evidence verbatim, question links, NFR targets)${bad.length ? ': ' + bad.join('; ') : ''}`);
};
for (const p of [
  '.github/skills/requirements-extraction/references/worked-example.draft.json',
  'requirements/.state/draft.json',
  'requirements/requirements.json',
]) if (fs.existsSync(p)) checkDoc(p);

// 5. User stories (format of user-story-authoring/references/story-template.md)
const storyDirs = ['examples/sample-user-stories', 'user-stories'].filter(d => fs.existsSync(d));
const seenUs = new Map();
for (const dir of storyDirs) {
  for (const f of fs.readdirSync(dir, { recursive: true }).filter(f => f.endsWith('.md'))) {
    const p = path.join(dir, f);
    const bad = [];
    let y;
    try { y = fm(p); } catch { report(false, `${p} has no frontmatter`); continue; }
    const body = fs.readFileSync(p, 'utf8');
    if (!/^US-\d{3,}$/.test(y.id ?? '')) bad.push('id');
    else {
      if (!path.basename(f).startsWith(y.id + '-')) bad.push('file name must start with id');
      if (seenUs.has(`${dir}:${y.id}`)) bad.push(`duplicate id with ${seenUs.get(`${dir}:${y.id}`)}`);
      seenUs.set(`${dir}:${y.id}`, p);
    }
    for (const k of ['**As a**', '**I want**', '**So that**', '## Acceptance criteria']) if (!body.includes(k)) bad.push(`missing ${k}`);
    const section = (h) => (body.split(`\n## ${h}\n`)[1] ?? '').split('\n## ')[0];
    for (const l of section('Acceptance criteria').split('\n').filter(l => l.startsWith('- ') && l !== '- none'))
      if (!/^- Given .* [Ww]hen .* [Tt]hen .*/.test(l)) bad.push(`criterion not Given/when/then: ${l.slice(0, 40)}`);
    // story-authoring output: quotes must be verbatim in the raw sources
    if (Array.isArray(y.source)) {
      const raw = y.source.filter(s => fs.existsSync(s)).map(s => norm(fs.readFileSync(s, 'utf8'))).join('\n');
      if (!body.includes("\n## Client's words\n")) bad.push("missing ## Client's words");
      if (!body.includes('\n## Open points\n')) bad.push('missing ## Open points');
      for (const q of section("Client's words").split('\n').filter(l => l.startsWith('> ')))
        if (raw && !raw.includes(norm(q.slice(2)))) bad.push(`quote not verbatim in source: ${q.slice(2, 50)}`);
    }
    report(bad.length === 0, `${p} story format${bad.length ? ': ' + bad.join('; ') : ''}`);
  }
}

console.log(ok ? '\nALL CHECKS PASSED' : '\nSOME CHECKS FAILED');
process.exit(ok ? 0 : 1);
