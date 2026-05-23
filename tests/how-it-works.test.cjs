const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => readFileSync(path.join(root, file), 'utf8');

test('Phase 3 how it works markup exposes scroll sequence steps and visual stage', () => {
  const html = read('index.html');

  assert.match(html, /class="how-it-works__inner"[^>]*data-how-it-works/);
  assert.match(html, /class="how-it-works__screen"/);
  assert.equal((html.match(/data-process-step/g) || []).length, 3);
  assert.equal((html.match(/class="how-it-works__screen-state"/g) || []).length, 3);
});

test('Phase 3 how it works JavaScript pins desktop and reveals mobile steps', () => {
  const main = read('js/main.js');
  const module = read('js/modules/HowItWorks.js');

  assert.match(main, /import HowItWorks from '\.\/modules\/HowItWorks\.js';/);
  assert.match(main, /new HowItWorks\(\)/);
  assert.match(module, /gsap\.matchMedia\(\)/);
  assert.match(module, /min-width: 769px/);
  assert.match(module, /max-width: 768px/);
  assert.match(module, /ScrollTrigger\.create\(/);
  assert.match(module, /pin:\s*this\.inner/);
  assert.match(module, /prefers-reduced-motion: reduce/);
});

test('Phase 3 how it works CSS supports pinned desktop sequence, mobile stack, and hero-weight headings', () => {
  const scss = read('scss/components/_how-it-works.scss');

  assert.match(scss, /\.how-it-works__title\s*\{[\s\S]*font-weight:\s*500/);
  assert.match(scss, /\.how-it-works__stage\s*\{[\s\S]*display:\s*grid/);
  assert.match(scss, /\.how-it-works__screen\s*\{[\s\S]*position:\s*relative/);
  assert.match(scss, /@media \(max-width: 768px\)[\s\S]*grid-template-columns:\s*1fr/);
  assert.match(scss, /@media \(prefers-reduced-motion: reduce\)/);
});
