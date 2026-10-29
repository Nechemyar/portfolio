"""python run.py <outdir> project:id [project:id ...] [--clinical-bg black|white]
Generates raw plates one at a time (parallel runs cross-write files)."""
import subprocess, sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
from prompts import JOBS, p, BLACK, WHITE

WRAP = "/c/Users/neche/.claude/codex-bridge/bin/codex-imagegen"
args = sys.argv[1:]
bg = None
if "--clinical-bg" in args:
    i = args.index("--clinical-bg"); bg = {"black": BLACK, "white": WHITE}[args[i + 1]]; del args[i:i + 2]
out, jobs = args[0], args[1:]
log = {}
for j in jobs:
    proj, jid = j.split(":")
    prompt, _ = JOBS[proj][jid]
    if proj == "clinical" and not jid.startswith("01"):
        prompt = p(bg, prompt)
    dst = os.path.join(out, proj, f"{jid}-raw.png")
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    r = subprocess.run(["bash", WRAP, prompt, dst, "--size", "1600x2000"], stdin=subprocess.DEVNULL, capture_output=True, text=True)
    print(j, r.returncode, r.stdout.strip()[-200:], r.stderr.strip()[-300:], flush=True)
    log[j] = prompt
    with open(os.path.join(out, proj, f"{jid}-prompt.txt"), "w", encoding="utf-8") as f:
        f.write(prompt)
