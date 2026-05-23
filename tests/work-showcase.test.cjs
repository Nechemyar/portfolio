const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => readFileSync(path.join(root, file), 'utf8');

test('Phase 2 work showcase markup exposes cards for pinned scroll behavior', () => {
  const html = read('index.html');

  assert.match(html, /class="work-showcase__cards"[^>]*data-work-showcase/);
  assert.equal((html.match(/data-work-card/g) || []).length, 2);
  assert.equal((html.match(/class="work-showcase__result"/g) || []).length, 2);
  assert.match(html, /class="work-showcase__card-count">01 \/ 02</);
  assert.match(html, /class="work-showcase__card-count">02 \/ 02</);
});

test('Phase 2 work showcase JavaScript is wired and handles desktop, mobile, and reduced motion', () => {
  const main = read('js/main.js');
  const module = read('js/modules/WorkShowcase.js');

  assert.match(main, /import WorkShowcase from '\.\/modules\/WorkShowcase\.js';/);
  assert.match(main, /new WorkShowcase\(\)/);
  assert.match(module, /gsap\.matchMedia\(\)/);
  assert.match(module, /prefers-reduced-motion: reduce/);
  assert.match(module, /min-width: 769px/);
  assert.match(module, /ScrollTrigger\.create\(/);
  assert.match(module, /start:\s*'center center'/);
  assert.match(module, /pin:\s*true/);
});

test('Phase 2 work showcase CSS supports pinned desktop cards and stacked mobile cards', () => {
  const scss = read('scss/components/_work-showcase.scss');

  assert.match(scss, /\.work-showcase__cards\s*\{[\s\S]*position:\s*relative/);
  assert.match(scss, /\.work-showcase__card\s*\{[\s\S]*min-height:\s*min\(78vh,\s*780px\)/);
  assert.match(scss, /@media \(min-width: 769px\)/);
  assert.match(scss, /@media \(max-width: 768px\)[\s\S]*position:\s*relative/);
  assert.match(scss, /@media \(prefers-reduced-motion: reduce\)/);
});

test('Phase 2 headings match the hero pitch heading weight', () => {
  const scss = read('scss/components/_work-showcase.scss');

  assert.match(scss, /\.work-showcase__title\s*\{[\s\S]*font-weight:\s*500/);
  assert.match(scss, /\.work-showcase__card-copy\s*\{[\s\S]*h3\s*\{[\s\S]*font-weight:\s*500/);
});
