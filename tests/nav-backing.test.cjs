const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => readFileSync(path.join(root, file), 'utf8');

test('nav backing morphs into a single translucent white pill', () => {
  const scss = read('scss/components/_nav.scss');

  assert.match(scss, /body\.nav-has-backing \.nav::before\s*\{[\s\S]*backdrop-filter:\s*blur\(18px\)/);
  assert.match(scss, /body\.nav-has-backing \.nav::before\s*\{[\s\S]*background:\s*rgba\(255,\s*255,\s*255,\s*0\.72\)/);
  assert.match(scss, /body\.nav-has-backing \.nav::before\s*\{[\s\S]*border-radius:\s*8px/);
  assert.match(scss, /body\.nav-has-backing \.nav::before\s*\{[\s\S]*inset:\s*clamp\(/);
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
