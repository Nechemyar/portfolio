// node scripts/run-m.mjs <take> [--frames-only]
import { encode } from './capture-m.mjs';
import { TAKES } from './takes-m.mjs';
const which = process.argv[2];
if (!TAKES[which]) { console.log('takes:', Object.keys(TAKES).join(' ')); process.exit(1); }
await TAKES[which]();
if (!process.argv.includes('--frames-only')) encode(TAKES[which].seqName || which, TAKES[which].out);
