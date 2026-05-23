const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => readFileSync(path.join(root, file), 'utf8');

test('nav backing uses a translucent blurred surface instead of a solid menu bar', () => {
  const scss = read('scss/components/_nav.scss');

  assert.match(scss, /body\.nav-has-backing \.nav::before\s*\{[\s\S]*backdrop-filter:\s*blur\(18px\)/);
  assert.match(scss, /body\[data-nav-section='how-it-works'\] \.nav::before/);
  assert.match(scss, /rgba\(255,\s*185,\s*62,\s*0\.72\)/);
  assert.doesNotMatch(scss, /body\[data-nav-section='how-it-works'\] \.nav::before\s*\{[\s\S]*background:\s*#ffb93e/);
});
