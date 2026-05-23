const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => readFileSync(path.join(root, file), 'utf8');

test('Phase 4 about markup uses redesigned structure with photo, copy, and meta tags', () => {
  const html = read('index.html');

  // Section present with cream bg data attribute
  assert.match(html, /class="about"[^>]*data-bg="#FAF9F7"/);
  // Photo panel
  assert.match(html, /class="about__photo"/);
  assert.match(html, /meno-box\.webp/);
  // Copy panel with new elements
  assert.match(html, /class="about__label"/);
  assert.match(html, /class="about__title"/);
  assert.match(html, /class="about__body"/);
  assert.match(html, /class="about__meta"/);
  assert.match(html, /class="about__meta-tag"/);
});

test('Phase 4 about CSS uses correct background and design tokens', () => {
  const scss = read('scss/components/_about.scss');

  // Background is transparent to let body transition show through
  assert.match(scss, /\.about\s*\{[\s\S]*background:\s*transparent/);
  // Label is now just text, no yellow background needed
  assert.match(scss, /\.about__label\s*\{/);
  // Photo double-border inset via ::before removed in new geometric layout
  // Meta tag element defined
  assert.match(scss, /\.about__meta-tag/);
  // Mobile breakpoint present
  assert.match(scss, /@media \(max-width: 900px\)/);
  // Grid layout (or flex layout used for the offset design)
  assert.match(scss, /\.about__inner\s*\{[\s\S]*display:\s*(grid|flex)/);
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
