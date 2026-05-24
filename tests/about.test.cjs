const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => readFileSync(path.join(root, file), 'utf8');

test('About section markup uses chat+bento layout structure', () => {
  const html = read('index.html');

  // Section present with cream bg data attribute
  assert.match(html, /class="about"[^>]*data-bg="#FAF9F7"/);
  // Section label and heading
  assert.match(html, /class="about__header"/);
  assert.match(html, /class="section-label"/);
  assert.match(html, /data-about-heading/);
  // Chat column: bubbles (including photo bubble inline)
  assert.match(html, /class="about__chat"/);
  assert.match(html, /about__bubble--photo/);
  assert.match(html, /meno-box\.webp/);
  assert.match(html, /data-bubble/);
  assert.match(html, /class="about__reactions"/);
  assert.match(html, /class="about__reaction"/);
  // Bento grid with cells and inline SVGs
  assert.match(html, /class="about__bento"/);
  assert.match(html, /data-bento-cell/);
  assert.match(html, /class="about__bento-icon"/);
  assert.match(html, /class="about__bento-label"/);
  assert.match(html, /class="about__bento-value"/);
});

test('About CSS uses pinned split layout with scrollable chat and fixed bento panel', () => {
  const scss = read('scss/components/_about.scss');

  // Section has an explicit background (cream, not transparent/yellow)
  assert.match(scss, /\.about\s*\{[\s\S]*background:\s*\$c-cream/);
  assert.match(scss, /\.about\s*\{[\s\S]*min-height:\s*100vh/);
  assert.match(scss, /\.about__inner\s*\{[\s\S]*min-height:\s*100vh/);
  assert.match(scss, /\.about__inner\s*\{[\s\S]*grid-template-columns:\s*minmax\(0,\s*0\.4fr\)\s+minmax\(0,\s*0\.6fr\)/);
  assert.match(scss, /\.about__chat\s*\{[\s\S]*height:\s*100vh/);
  assert.match(scss, /\.about__bento\s*\{[\s\S]*height:\s*100vh/);
  // Chat bubble styles
  assert.match(scss, /\.about__bubble\s*\{/);
  assert.match(scss, /\.about__reaction\s*\{/);
  // Bento grid styles
  assert.match(scss, /\.about__bento\s*\{/);
  assert.match(scss, /\.about__bento-cell\s*\{/);
  assert.match(scss, /\.about__bento-cell--profile\s*\{[\s\S]*grid-row:\s*span 2/);
  assert.match(scss, /\.about__bento-cell--wide\s*\{[\s\S]*grid-column:\s*span 2/);
  assert.match(scss, /\.about__bento-icon\s*\{/);
  // SVG stroke-draw initial state
  assert.match(scss, /stroke-dashoffset:\s*200/);
  // Mobile breakpoint
  assert.match(scss, /@media \(max-width: 900px\)/);
  // Hover gated correctly
  assert.match(scss, /@media \(hover: hover\)/);
  // Inner layout
  assert.match(scss, /\.about__inner\s*\{[\s\S]*display:\s*grid/);
});

test('AboutReveal module pins desktop section and scrubs bubbles through the left column', () => {
  const main = read('js/main.js');
  const module = read('js/modules/AboutReveal.js');

  assert.match(main, /import AboutReveal from/);
  assert.match(main, /new AboutReveal\(\)/);
  assert.match(module, /_desktopPinnedSequence/);
  assert.match(module, /pin:\s*this\.section/);
  assert.match(module, /scrub:\s*true/);
  assert.match(module, /end:\s*\(\)\s*=>\s*`\+=\$\{this\.bubbles\.length \* window\.innerHeight \* 0\.75\}`/);
  assert.match(module, /_mobileReveal/);
});

test('Phase 5 services uses transparent background and new item layout', () => {
  const scss = read('scss/components/_services.scss');

  // Section background is transparent
  assert.match(scss, /\.services\s*\{[\s\S]*background:\s*transparent/);
  // Uses new list items instead of cards
  assert.match(scss, /\.services__item\s*\{/);
  // Item numbers use rust accent
  assert.match(scss, /\.services__item-num\s*\{[\s\S]*color:\s*\$c-rust/);
});
