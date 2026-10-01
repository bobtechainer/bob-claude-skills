#!/usr/bin/env python3
"""QC scoreboard — deterministic scoring from qc/spec-matrix.md + qc/defects.md.

Usage: python3 qc_score.py <project>/qc
Exit 0 = gate PASSED, exit 1 = LOOP, exit 2 = parse error.
"""
import re
import sys
from pathlib import Path

# stdout tren Windows la cp1252 -> in dong yeu cau tieng Viet la crash.
# Ban goc trong ths-materials-builder khong co doan nay vi noi dung o do la tieng Anh.
try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

SEV_WEIGHT = {"P0": 10, "P1": 4, "P2": 1}


def rows(md_path):
    """Yield cell lists for every data row of every markdown table."""
    for line in md_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line.startswith("|") or set(line) <= {"|", "-", " ", ":"}:
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if cells and cells[0].lower() != "id":
            yield cells


def main(qc_dir):
    spec = Path(qc_dir) / "spec-matrix.md"
    defects = Path(qc_dir) / "defects.md"
    if not spec.exists():
        print(f"parse error: {spec} missing")
        return 2

    total_w = done_w = impl_w = 0
    unverified, open_spec = [], []
    for cells in rows(spec):
        if len(cells) < 5:
            continue
        sid, req, _verify, w, status = cells[0], cells[1], cells[2], cells[3], cells[4]
        try:
            w = int(re.sub(r"\D", "", w) or 0)
        except ValueError:
            continue
        total_w += w
        if status.startswith("✓"):
            done_w += w
        elif status.startswith("~"):
            impl_w += w
            unverified.append(f"{sid} {req}")
        else:
            open_spec.append(f"{sid} {req}")

    sev_open = {"P0": 0, "P1": 0, "P2": 0}
    stalled = []
    if defects.exists():
        for cells in rows(defects):
            if len(cells) < 5:
                continue
            did, sev, desc, seen, status = cells[:5]
            if status.lower().startswith("open") and sev in sev_open:
                sev_open[sev] += 1
                if int(re.sub(r"\D", "", seen) or 0) >= 3:
                    stalled.append(f"{did} ({sev}) {desc}")

    completeness = 100.0 * done_w / total_w if total_w else 0.0
    bug_score = max(
        0, 100 - sum(SEV_WEIGHT[s] * n for s, n in sev_open.items())
    )
    gate = completeness >= 100.0 and sev_open["P0"] == 0 and sev_open["P1"] == 0

    print(f"Completeness: {completeness:.1f}% ({done_w}/{total_w} weighted)")
    if impl_w:
        print(f"Implemented-unverified: {100.0 * impl_w / total_w:.1f}% "
              f"({len(unverified)} items) — NOT counted as done")
        for u in unverified:
            print(f"  ~ {u}")
    print(f"Bug score: {bug_score}/100 "
          f"(open P0={sev_open['P0']} P1={sev_open['P1']} P2={sev_open['P2']})")
    for s in stalled:
        print(f"STALLED (>=3 iterations) — ESCALATE TO USER: {s}")
    print(f"Verdict: {'GATE PASSED — run final sweep' if gate else 'LOOP'}")
    return 0 if gate else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "qc"))
