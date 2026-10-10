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

// 4. If a requirements.json exists, validate it too
if (fs.existsSync('requirements/requirements.json')) {
  const d = JSON.parse(fs.readFileSync('requirements/requirements.json', 'utf8'));
  const v = validate(d);
  report(v, `requirements/requirements.json validates${v ? '' : ': ' + JSON.stringify(validate.errors.slice(0, 3))}`);
}

console.log(ok ? '\nALL CHECKS PASSED' : '\nSOME CHECKS FAILED');
process.exit(ok ? 0 : 1);
