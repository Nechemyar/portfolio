const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => readFileSync(path.join(root, file), 'utf8');

test('nav backing morphs into a compact solid desktop pill', () => {
  const scss = read('scss/components/_nav.scss');

  assert.match(scss, /body\.nav-has-backing \.nav__inner\s*\{[\s\S]*width:\s*fit-content/);
  assert.match(scss, /body\.nav-has-backing \.nav__inner\s*\{[\s\S]*margin-inline:\s*auto/);
  assert.match(scss, /body\.nav-has-backing \.nav__inner\s*\{[\s\S]*background:\s*\$c-cream/);
  assert.match(scss, /body\.nav-has-backing \.nav__inner\s*\{[\s\S]*border:\s*2px solid \$c-ink/);
  assert.match(scss, /body\.nav-has-backing \.nav__inner\s*\{[\s\S]*border-radius:\s*14px/);
  assert.match(scss, /body\.nav-has-backing \.nav__inner\s*\{[\s\S]*column-gap:\s*clamp\(1\.35rem/);
  assert.doesNotMatch(scss, /backdrop-filter:\s*blur\(18px\)/);
  assert.doesNotMatch(scss, /rgba\(255,\s*255,\s*255,\s*0\.72\)/);
  assert.doesNotMatch(scss, /body\[data-nav-section=.*\] \.nav::before\s*\{/);
  assert.doesNotMatch(scss, /rgba\(255,\s*185,\s*62,\s*0\.72\)/);
});

test('nav logo and menu controls stay black across sections', () => {
  const scss = read('scss/components/_nav.scss');
  const module = read('js/modules/NavTheme.js');

  assert.match(scss, /\.nav__logo-svg\s*\{[\s\S]*filter:\s*invert\(0\)/);
  assert.match(scss, /\.nav__menu-label\s*\{[\s\S]*color:\s*\$c-ink/);
  assert.match(scss, /\.nav__menu-line\s*\{[\s\S]*background:\s*\$c-ink/);
  assert.doesNotMatch(scss, /body\.nav-theme-light/);
  assert.doesNotMatch(module, /nav-theme-light/);
  assert.doesNotMatch(module, /data-nav-theme/);
});

test('nav logo and mobile menu use tighter hero-aligned sizing', () => {
  const nav = read('scss/components/_nav.scss');
  const menu = read('scss/components/_menu.scss');

  assert.match(nav, /\.nav__logo-svg\s*\{[\s\S]*height:\s*clamp\(2rem,\s*4vw,\s*2\.6rem\)/);
  assert.match(nav, /@media \(max-width: 768px\)[\s\S]*\.nav__logo-svg\s*\{[\s\S]*height:\s*clamp\(2rem,\s*9vw,\s*2\.75rem\)/);
  assert.match(menu, /\.mobile-menu\s*\{[\s\S]*left:\s*8px/);
  assert.match(menu, /\.mobile-menu\s*\{[\s\S]*right:\s*8px/);
  assert.match(menu, /\.mobile-menu\s*\{[\s\S]*max-width:\s*calc\(100dvw - 16px\)/);
});
