const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => readFileSync(path.join(root, file), 'utf8');

test('About section markup follows the Stevia-style chat and info panel structure', () => {
  const html = read('index.html');

  assert.match(html, /class="about"[^>]*data-bg="#FAF9F7"/);
  assert.match(html, /class="about__container"/);
  assert.match(html, /class="about__chat-container"/);
  assert.match(html, /class="about-chat"/);
  assert.match(html, /class="about-chat__list"/);
  assert.match(html, /class="about-chat__el about-chat__el--intro"/);
  assert.match(html, /class="about-chat__el-container"/);
  assert.match(html, /class="about-chat___loading"/);
  assert.match(html, /class="about-chat__el-text"/);
  assert.match(html, /class="about-chat__emojis"/);
  assert.match(html, /class="about-chat__el about-chat__el--photo"/);
  assert.match(html, /class="about-chat__img"/);
  assert.match(html, /meno-box\.webp/);
  assert.match(html, /class="about__content"/);
  assert.match(html, /class="about-infos"/);
  assert.match(html, /class="about-infos__skills"/);
  assert.match(html, /class="about-infos__clients"/);
  assert.match(html, /class="about-links"/);
  assert.match(html, /class="about-links__contact"/);
  assert.match(html, /class="about-links__socials"/);
});

test('About CSS uses full-screen chat column and fixed info panel layout', () => {
  const scss = read('scss/components/_about.scss');

  assert.match(scss, /\.about\s*\{[\s\S]*background:\s*\$c-cream/);
  assert.match(scss, /\.about\s*\{[\s\S]*min-height:\s*100vh/);
  assert.match(scss, /\.about__container\s*\{[\s\S]*grid-template-columns:\s*minmax\(0,\s*0\.42fr\)\s+minmax\(0,\s*0\.58fr\)/);
  assert.match(scss, /\.about__chat-container\s*\{[\s\S]*height:\s*100vh/);
  assert.match(scss, /\.about-chat__list\s*\{[\s\S]*position:\s*absolute/);
  assert.match(scss, /\.about-chat__el\s*\{[\s\S]*transform-origin:\s*10% 50%/);
  assert.match(scss, /\.about-chat__el > svg\s*\{/);
  assert.match(scss, /\.about-chat___loading-el\s*\{/);
  assert.match(scss, /\.about__content\s*\{[\s\S]*height:\s*100vh/);
  assert.match(scss, /\.about-infos\s*\{[\s\S]*background:\s*\$c-yellow/);
  assert.match(scss, /\.about-infos__skills\s*\{/);
  assert.match(scss, /\.about-links\s*\{[\s\S]*display:\s*grid/);
  assert.match(scss, /@media \(max-width: 900px\)/);
  assert.match(scss, /@media \(hover: hover\)/);
});

test('AboutReveal module pins desktop section and scrolls the chat list', () => {
  const main = read('js/main.js');
  const module = read('js/modules/AboutReveal.js');

  assert.match(main, /import AboutReveal from/);
  assert.match(main, /new AboutReveal\(\)/);
  assert.match(module, /_desktopPinnedSequence/);
  assert.match(module, /pin:\s*this\.section/);
  assert.match(module, /scrub:\s*true/);
  assert.match(module, /this\.list/);
  assert.match(module, /this\.chatItems/);
  assert.match(module, /chatDistance/);
  assert.match(module, /about-chat__el--is-active/);
  assert.match(module, /about-chat__el--is-full-active/);
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
