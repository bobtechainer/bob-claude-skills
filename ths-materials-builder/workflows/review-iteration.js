export const meta = {
  name: 'review-iteration',
  description: 'One loop iteration: 4-lens parallel review of a 3D learning page',
  whenToUse: 'Invoked by vivid-page-builder gate 3b after each BUILD increment',
  phases: [
    { title: 'Review', detail: 'code / logic / UI / interaction lenses in parallel' },
    { title: 'Merge', detail: 'dedupe findings, map to defect rows' },
  ],
}
// args: { project: "<abs path>", page: "<abs path to index.html>", specPath: "<abs path to qc/spec-matrix.md>" }
const FINDINGS = {
  type: 'object',
  required: ['findings'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['sev', 'defect', 'evidence'],
        properties: {
          sev: { enum: ['P0', 'P1', 'P2'] },
          defect: { type: 'string' },
          evidence: { type: 'string' },
          specId: { type: 'string' },
          fix: { type: 'string' },
        },
      },
    },
    verifiedSpecIds: { type: 'array', items: { type: 'string' } },
  },
}

const ctx = `Project: ${args.project}. Page: ${args.page}. Spec matrix: ${args.specPath}.
Read references/review-lenses.md in the vivid-page-builder skill for your lens rules.
Report findings only — no fixes applied. Every P0/P1 needs reproducible evidence
(probe numbers or screenshot path). Also list spec-matrix IDs your lens VERIFIED.`

phase('Review')
const lenses = [
  { key: 'code', prompt: `${ctx}\nLENS 1 — CODE: review the git diff since last commit for three.js misuse, leaks, per-frame allocations, dead code, event/race bugs.` },
  { key: 'logic', prompt: `${ctx}\nLENS 2 — LOGIC/PHYSICS: run the numeric probes from the spec matrix via the page's window.__ hooks (serve the page, drive it headless). Walk the playbook Phase-3 honesty checklist. Report expected-vs-actual per failed probe.` },
  { key: 'ui', prompt: `${ctx}\nLENS 3 — UI/VISUAL: screenshot the canonical states in the spec matrix, judge against the design doc + Phase-1 legibility rules (tunnels read as tunnels, everything anchored, no overlap at 1280×720).` },
  { key: 'interaction', prompt: `${ctx}\nLENS 4 — INTERACTION: script pointer drags through full travel (fast/slow/release-with-velocity/rotated camera), assert constraint axis, carrier attachment, no clipping, no console errors.` },
]
const results = await parallel(lenses.map(l => () =>
  agent(l.prompt, { label: `lens:${l.key}`, phase: 'Review', schema: FINDINGS })))

phase('Merge')
const all = results.filter(Boolean).flatMap((r, i) =>
  r.findings.map(f => ({ ...f, lens: lenses[i].key })))
const verified = [...new Set(results.filter(Boolean).flatMap(r => r.verifiedSpecIds || []))]
// dedupe by defect text similarity key
const seen = new Map()
for (const f of all) {
  const key = f.defect.toLowerCase().replace(/[^a-z0-9]+/g, ' ').slice(0, 60)
  if (!seen.has(key)) seen.set(key, f)
  else if (SEV_ORDER(f.sev) < SEV_ORDER(seen.get(key).sev)) seen.set(key, f)
}
function SEV_ORDER(s) { return { P0: 0, P1: 1, P2: 2 }[s] }
const deduped = [...seen.values()].sort((a, b) => SEV_ORDER(a.sev) - SEV_ORDER(b.sev))
log(`${deduped.length} unique findings (${all.length} raw), ${verified.length} spec items verified`)
return { findings: deduped, verifiedSpecIds: verified }
// Main loop then: update qc/defects.md (+Seen counters) and spec-matrix
// statuses, run scripts/qc_score.py, and act on the verdict.
