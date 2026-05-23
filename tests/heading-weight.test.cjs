const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => readFileSync(path.join(root, file), 'utf8');

test('post-hero display headings use the hero pitch heading weight', () => {
  const files = [
    ['scss/components/_work-showcase.scss', [
      '.work-showcase__title',
      'h3',
      '.work-showcase__result',
    ]],
    ['scss/components/_how-it-works.scss', [
      '.how-it-works__title',
      'strong',
      '.how-it-works__step h3',
    ]],
    ['scss/components/_about.scss', ['.about__title']],
    ['scss/components/_services.scss', ['.services__title', '.services__card-title']],
    ['scss/components/_pricing.scss', ['.pricing__title', '.pricing__card-price']],
    ['scss/components/_testimonials.scss', ['.testimonials__title']],
    ['scss/components/_faq.scss', ['.faq__title', 'summary']],
    ['scss/components/_contact.scss', ['.contact__title']],
    ['scss/components/_project-page.scss', [
      '.project-hero__title',
      '.project-brief h2',
      '.project-next__title',
    ]],
  ];

  files.forEach(([file, selectors]) => {
    const scss = read(file);

    selectors.forEach((selector) => {
      const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\ /g, '\\s+');
      assert.match(
        scss,
        new RegExp(`${escaped}\\s*\\{[\\s\\S]*?font-weight:\\s*500`),
        `${selector} in ${file} should use font-weight 500`,
      );
    });
  });
});
