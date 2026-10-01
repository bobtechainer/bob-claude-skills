# Spec matrix template

qc/spec-matrix.md is the single source of truth for completeness %.
One row per verifiable requirement from the approved design doc.
The playbook Phase-3 honesty checklist items are ALWAYS injected as rows.

## Format

```markdown
# Spec matrix — <project>
Updated: <date> · iteration <n>

| ID  | Requirement                        | Verify | W | Status |
|-----|------------------------------------|--------|---|--------|
| S01 | coil centered on rail, magnet passes bore | shot:x=0 | 3 | ✓ |
| S12 | Lenz braking damps free pass-through      | probe:decay | 5 | ~ |
| S13 | dial mA == telemetry mA (±3%)             | probe:cal   | 3 | ✗ |
```

## Columns
- Verify: `shot:<state>` (screenshot judged by UI lens),
  `probe:<name>` (numeric assert by logic lens),
  `code:<what>` (static check by code lens),
  `drag:<script>` (interaction lens).
- W (weight): 5 = core teaching point, 3 = supporting physics/UX,
  1 = polish.
- Status: `✓` verified · `~` implemented but unverified · `✗` open.
  Only `✓` counts toward completeness. `~` is listed separately —
  never report `~` as done.

## Severity mapping for defects (qc/defects.md)

```markdown
| ID | Sev | Defect | Seen | Status |
|----|-----|--------|------|--------|
| D01 | P0 | magnet clips coil bore at v>10 | 2 | open |
```
P0 = breaks core teaching or physics honesty. P1 = wrong but usable.
P2 = polish. `Seen` = iterations this defect has survived (stall guard
escalates at 3).
