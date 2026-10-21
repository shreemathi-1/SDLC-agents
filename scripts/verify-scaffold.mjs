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
const catalogue = JSON.parse(fs.readFileSync('.github/skills/innovation-discovery/references/innovation-catalogue.json', 'utf8'));
const catKeys = new Set(catalogue.entries.map(e => e.key));
const trendLib = JSON.parse(fs.readFileSync('.github/skills/tech-trend-analysis/references/trend-library.json', 'utf8'));
const trendKeys = new Set(trendLib.entries.map(e => e.key));
const SCORE_WEIGHTS = { relevance: 0.30, user_value: 0.25, business_value: 0.20, effort_inverse: 0.15, risk_inverse: 0.10 };
const WARNING_CHECKS = new Set(['TESTABILITY', 'DUPLICATION', 'AMBIGUITY', 'FEASIBILITY']);
const UNVERIFIED_NOTE = 'unverified; check before client presentation';
// "verbatim" = story text with Markdown emphasis markers dropped and whitespace collapsed
const norm = (s) => s.replace(/\*\*|\*/g, '').replace(/\s+/g, ' ').trim();
const checkDoc = (p) => checkData(JSON.parse(fs.readFileSync(p, 'utf8')));
const checkData = (d) => {
  const v = validate(d);
  if (!v) return [{ check: 'SCHEMA', severity: 'BLOCKING', msg: JSON.stringify(validate.errors.slice(0, 3)) }];
  const storyText = Object.fromEntries(d.stories
    .filter(s => fs.existsSync(s.path)).map(s => [s.id, norm(fs.readFileSync(s.path, 'utf8'))]));
  const qs = new Map(d.questions.map(q => [q.id, q]));
  const ids = d.requirements.map(r => r.id);
  const bad = [];
  const flag = (check, msg) => bad.push({ check, severity: WARNING_CHECKS.has(check) ? 'WARNING' : 'BLOCKING', msg });
  if (new Set(ids).size !== ids.length) flag('ID_REGISTRY', 'duplicate requirement IDs');
  for (const r of d.requirements) {
    if (r.origin === 'EXPLICIT') {
      const texts = r.source.map(id => storyText[id]).filter(Boolean);
      if (texts.length && !texts.some(t => t.includes(norm(r.evidence)))) flag('TRACEABILITY', `${r.id} evidence not verbatim in ${r.source.join(',')}`);
    }
    for (const q of r.open_questions) {
      if (!qs.has(q)) flag('CONSISTENCY', `${r.id} -> missing ${q}`);
      else if (!qs.get(q).blocks.includes(r.id)) flag('CONSISTENCY', `${q}.blocks lacks ${r.id}`);
    }
    if (r.type === 'NON_FUNCTIONAL' && r.nfr_metric.target === 'UNKNOWN' && r.origin !== 'UNKNOWN') flag('CONSISTENCY', `${r.id} target UNKNOWN but origin ${r.origin}`);
    if (['OUT', 'FUTURE'].includes(r.scope) && !r.scope_reason) flag('CONSISTENCY', `${r.id} scope ${r.scope} without scope_reason`);
    if (r.status === 'NEEDS_CLARIFICATION' && !r.open_questions.some(q => qs.get(q)?.status === 'OPEN')) flag('LIFECYCLE', `${r.id} NEEDS_CLARIFICATION without an OPEN question`);
  }
  // every referenced ID resolves
  const known = new Set([...ids, ...qs.keys(), ...d.risks.map(x => x.id), ...d.stories.map(x => x.id),
    ...d.innovations.map(x => x.id), ...d.trends.map(x => x.id)]);
  const refs = [
    ...d.requirements.flatMap(r => [...r.dependencies, ...r.business_rules, ...r.risks].map(x => [r.id, x])),
    ...d.questions.flatMap(q => q.blocks.map(x => [q.id, x])),
    ...d.ambiguities.flatMap(a => [[`ambiguity(${a.requirement})`, a.requirement], [`ambiguity(${a.requirement})`, a.question]]),
    ...d.gaps.flatMap(g => [g.question, ...(g.resulting_requirements ?? [])].map(x => [`gap(${g.category})`, x])),
    ...d.risks.flatMap(k => k.related.map(x => [k.id, x])),
    ...d.trends.flatMap(t => t.applies_to.map(x => [t.id, x])),
    ...d.innovations.flatMap(i => i.dependencies.filter(x => /^[A-Z]+-\d{3,}$/.test(x)).map(x => [i.id, x])),
  ];
  for (const [from, to] of refs) if (!known.has(to)) flag('CONSISTENCY', `${from} -> unknown ${to}`);
  // business rules: links point at BR items, and every BR governs something
  const byId = new Map(d.requirements.map(r => [r.id, r]));
  for (const r of d.requirements) for (const b of r.business_rules)
    if (byId.has(b) && byId.get(b).type !== 'BUSINESS_RULE') flag('CONSISTENCY', `${r.id}.business_rules -> ${b} is not a BUSINESS_RULE`);
  for (const b of d.requirements.filter(r => r.type === 'BUSINESS_RULE' && r.status !== 'DEPRECATED'))
    if (!d.requirements.some(r => r.business_rules.includes(b.id))) flag('CONSISTENCY', `${b.id} governs no requirement`);
  // dependency cycles must be recorded as a risk covering every member
  const state = new Map(); const stack = [];
  const visit = (id) => {
    state.set(id, 1); stack.push(id);
    for (const n of byId.get(id)?.dependencies ?? []) {
      if (state.get(n) === 1) {
        const cyc = stack.slice(stack.indexOf(n));
        if (!d.risks.some(k => cyc.every(c => k.related.includes(c)))) flag('CONSISTENCY', `dependency cycle ${cyc.join('->')}->${n} has no risk`);
      } else if (!state.has(n)) visit(n);
    }
    stack.pop(); state.set(id, 2);
  };
  for (const id of ids) if (!state.has(id)) visit(id);
  // questions: OPEN ones block something and offer an option; WITHDRAWN ones are no longer linked
  for (const q of d.questions) {
    if (q.status === 'OPEN' && q.blocks.length === 0) flag('COMPLETENESS', `${q.id} is OPEN but blocks nothing`);
    if (q.status === 'OPEN' && !/^Option:/.test(q.suggested_default_option)) flag('COMPLETENESS', `${q.id} default is not phrased "Option: …"`);
    if (q.status === 'WITHDRAWN' && d.requirements.some(r => r.open_questions.includes(q.id))) flag('CONSISTENCY', `${q.id} is WITHDRAWN but still linked`);
  }
  // priorities and phases: scope agrees, dependencies come no later, MUST items depend only on MUST items
  const phaseIx = { MVP: 0, PHASE_2: 1, PHASE_3: 2, FUTURE: 3 };
  for (const r of d.requirements.filter(r => r.status !== 'DEPRECATED')) {
    if (['OUT', 'FUTURE'].includes(r.scope) && (r.priority !== 'NOT_NOW' || r.phase !== 'FUTURE')) flag('CONSISTENCY', `${r.id} scope ${r.scope} needs priority NOT_NOW and phase FUTURE`);
    for (const dep of r.dependencies.map(x => byId.get(x)).filter(Boolean)) {
      if (phaseIx[dep.phase] > phaseIx[r.phase]) flag('CONSISTENCY', `${r.id} (${r.phase}) depends on later ${dep.id} (${dep.phase})`);
      if (r.priority === 'MUST' && dep.priority !== 'MUST') flag('CONSISTENCY', `${r.id} is MUST but depends on ${dep.id} (${dep.priority})`);
    }
  }
  // human-only changes leave a human change_log entry
  for (const r of d.requirements) {
    const human = r.change_log.some(c => c.by === 'human');
    if ((r.priority_status === 'CONFIRMED' || ['APPROVED', 'BASELINED'].includes(r.status)) && !human)
      flag('LIFECYCLE', `${r.id} ${r.status}/${r.priority_status} without a human change_log entry`);
  }
  // traceability: every active story yields a requirement; only promoted items lack a source
  for (const st of d.stories.filter(x => x.status !== 'REMOVED'))
    if (!d.requirements.some(r => r.source.includes(st.id))) flag('TRACEABILITY', `${st.id} is traced by no requirement`);
  for (const r of d.requirements) if (r.source.length === 0 && !r.promoted_from) flag('TRACEABILITY', `${r.id} has no source story`);
  // innovations and trends: catalogue/library keys exist, score maths, verification note
  const innById = new Map(d.innovations.map(i => [i.id, i]));
  if (innById.size !== d.innovations.length) flag('ID_REGISTRY', 'duplicate INN IDs');
  if (new Set(d.trends.map(t => t.id)).size !== d.trends.length) flag('ID_REGISTRY', 'duplicate TRD IDs');
  for (const i of d.innovations) {
    if (i.catalogue_key && !catKeys.has(i.catalogue_key)) flag('CONSISTENCY', `${i.id} unknown catalogue_key ${i.catalogue_key}`);
    const expect = Object.entries(SCORE_WEIGHTS).reduce((a, [k, w]) => a + w * i.score[k], 0);
    if (Math.abs(expect - i.score.weighted_total) > 0.01) flag('CONSISTENCY', `${i.id} weighted_total ${i.score.weighted_total} != ${expect.toFixed(2)}`);
  }
  for (const t of d.trends) {
    if (t.library_key && !trendKeys.has(t.library_key)) flag('CONSISTENCY', `${t.id} unknown library_key ${t.library_key}`);
    if (!t.verified && t.verification_note !== UNVERIFIED_NOTE) flag('TRACEABILITY', `${t.id} unverified without the standard note`);
  }
  // scope contamination: innovation content reaches requirements only through an ACCEPTed promotion
  for (const r of d.requirements.filter(r => r.promoted_from)) {
    const i = innById.get(r.promoted_from);
    if (!i || i.decision !== 'ACCEPT' || i.promoted_to !== r.id) flag('SCOPE_CONTAMINATION', `${r.id} promoted_from ${r.promoted_from} without a matching ACCEPT/promoted_to`);
  }
  for (const i of d.innovations.filter(i => i.promoted_to))
    if (byId.get(i.promoted_to)?.promoted_from !== i.id) flag('SCOPE_CONTAMINATION', `${i.id}.promoted_to ${i.promoted_to} does not point back`);
  const innTitles = new Map(d.innovations.map(i => [norm(i.title).toLowerCase(), i.id]));
  for (const r of d.requirements.filter(r => !r.promoted_from))
    if (innTitles.has(norm(r.title).toLowerCase())) flag('SCOPE_CONTAMINATION', `${r.id} has the title of ${innTitles.get(norm(r.title).toLowerCase())} but was not promoted`);
  // more contamination: invented numbers, INN/TRD content in requirement text, agent-answered questions, gaps answered early
  const answers = d.questions.filter(q => q.status === 'ANSWERED').map(q => q.answer).join(' ');
  for (const r of d.requirements.filter(r => r.nfr_metric)) {
    const known = [r.evidence ?? '', ...r.source.map(id => storyText[id] ?? ''), answers].join(' ');
    for (const n of r.nfr_metric.target.match(/\d+(\.\d+)?/g) ?? [])
      if (!new RegExp(`(?<![\\d.])${n.replace('.', '\\.')}(?![\\d.])`).test(known)) flag('SCOPE_CONTAMINATION', `${r.id} target "${r.nfr_metric.target}" uses ${n}, found in no story or answer`);
  }
  for (const r of d.requirements) if (/\b(INN|TRD)-\d{3,}/.test(`${r.title} ${r.description}`) && !r.promoted_from)
    flag('SCOPE_CONTAMINATION', `${r.id} text cites an innovation or trend`);
  for (const q of d.questions) if (q.status === 'ANSWERED' && /agent|copilot|claude|assistant|ai\b/i.test(q.answered_by ?? ''))
    flag('SCOPE_CONTAMINATION', `${q.id} answered by "${q.answered_by}"; only a human answers questions`);
  for (const g of d.gaps) if (g.resulting_requirements?.length && qs.get(g.question)?.status !== 'ANSWERED')
    flag('SCOPE_CONTAMINATION', `gap(${g.category}) produced ${g.resulting_requirements.join(',')} while ${g.question} is unanswered`);
  // warnings: testability and duplication
  for (const r of d.requirements.filter(r => !['CONSTRAINT', 'ASSUMPTION', 'DEPENDENCY'].includes(r.type)
      && !['NEEDS_CLARIFICATION', 'DEPRECATED', 'DRAFT'].includes(r.status) && r.acceptance_criteria.length === 0))
    flag('TESTABILITY', `${r.id} has no acceptance criteria`);
  const seen = new Map();
  for (const r of d.requirements.filter(r => r.status !== 'DEPRECATED'))
    for (const k of [`t:${norm(r.title).toLowerCase()}`, r.evidence && `e:${norm(r.evidence).toLowerCase()}`].filter(Boolean)) {
      if (seen.has(k)) flag('DUPLICATION', `${r.id} duplicates ${seen.get(k)} (${k.startsWith('t:') ? 'title' : 'evidence'})`);
      else seen.set(k, r.id);
    }
  return bad;
};
const reportDoc = (p) => {
  const issues = checkDoc(p);
  const blocking = issues.filter(i => i.severity === 'BLOCKING');
  report(blocking.length === 0, `${p} (schema + gate checks)${blocking.length ? ': ' + blocking.map(i => `[${i.check}] ${i.msg}`).join('; ') : ''}`);
  for (const w of issues.filter(i => i.severity === 'WARNING')) console.log(`warn   [${w.check}] ${w.msg}`);
};
const skillExamples = fs.readdirSync('.github/skills')
  .map(s => `.github/skills/${s}/references/worked-example.draft.json`).filter(p => fs.existsSync(p));
for (const p of [...skillExamples, 'requirements/.state/draft.json', 'requirements/requirements.json'])
  if (fs.existsSync(p)) reportDoc(p);
// published IDs must be committed in the registry (step 15 raises the counters)
if (fs.existsSync('requirements/requirements.json')) {
  const d = JSON.parse(fs.readFileSync('requirements/requirements.json', 'utf8'));
  const reg = JSON.parse(fs.readFileSync('requirements/.state/id-registry.json', 'utf8'));
  const all = [...d.requirements, ...d.questions, ...d.risks, ...d.innovations, ...d.trends].map(x => x.id);
  const over = all.filter(id => { const [pre, num] = id.split('-'); return Number(num) > (reg.counters[pre] ?? 0); });
  report(over.length === 0, `requirements.json IDs are within id-registry counters${over.length ? ': ' + over.join(', ') : ''}`);
}

// 4b. Gate test: the contamination case must yield exactly the BLOCKING issues its validation block records
{
  const p = '.github/skills/requirements-validation-gate/references/contamination-case.draft.json';
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  const got = checkData(d).filter(i => i.severity === 'BLOCKING');
  const want = d.validation.issues.filter(i => i.severity === 'BLOCKING');
  const idsIn = (m) => m.match(/\b(US|FR|NFR|BR|DR|IR|SR|CR|CON|ASM|DEP|RISK|Q|INN|TRD)-\d{3,}\b/g) ?? [];
  const missed = want.filter(w => !got.some(g => g.check === w.check && idsIn(g.msg).includes(w.items[0])));
  const extra = got.filter(g => !want.some(w => w.check === g.check && idsIn(g.msg).includes(w.items[0])));
  report(d.validation.result === 'FAIL' && missed.length === 0 && extra.length === 0,
    `${p}: gate blocks all ${want.length} planted leaks${missed.length ? '; missed ' + missed.map(m => m.items[0]).join(',') : ''}${extra.length ? '; unexpected ' + extra.map(e => `[${e.check}] ${e.msg}`).join('; ') : ''}`);
}

// 5. Innovation catalogue and trend library
{
  const levels = new Set([1, 2, 3, 4]), cx = new Set(['S', 'M', 'L', 'XL']), caps = new Set(catalogue.capabilities);
  const bad = [];
  if (catalogue.entries.length < 150) bad.push(`only ${catalogue.entries.length} entries (need 150+)`);
  if (catKeys.size !== catalogue.entries.length) bad.push('duplicate keys');
  for (const c of catalogue.categories) {
    const n = catalogue.entries.filter(e => e.category === c).length;
    if (n < 10) bad.push(`category ${c} has ${n} entries (need 10+)`);
  }
  for (const e of catalogue.entries) {
    if (!/^[a-z0-9-]+$/.test(e.key)) bad.push(`key ${e.key}`);
    if (!catalogue.categories.includes(e.category)) bad.push(`${e.key} category ${e.category}`);
    if (!levels.has(e.level) || !cx.has(e.complexity)) bad.push(`${e.key} level/complexity`);
    if (!e.domains?.length || !e.description || !e.typical_risk || !e.technology?.length) bad.push(`${e.key} missing fields`);
    for (const r of e.requires) if (!caps.has(r)) bad.push(`${e.key} requires unknown capability ${r}`);
  }
  report(bad.length === 0, `innovation-catalogue.json (${catalogue.entries.length} entries, ${catalogue.categories.length} categories)${bad.length ? ': ' + bad.slice(0, 5).join('; ') : ''}`);
  const adoption = new Set(['EMERGING', 'GROWING', 'MAINSTREAM', 'DECLINING']);
  const tbad = trendLib.entries.filter(e => !adoption.has(e.adoption_level) || !e.domains?.length || !e.description).map(e => e.key);
  if (trendKeys.size !== trendLib.entries.length) tbad.push('duplicate keys');
  report(tbad.length === 0, `trend-library.json (${trendLib.entries.length} trends)${tbad.length ? ': ' + tbad.join(', ') : ''}`);
}

// 6. User stories (format of user-story-authoring/references/story-template.md)
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
