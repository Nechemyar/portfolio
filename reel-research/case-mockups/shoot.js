const { chromium } = require('playwright');
const scenes = require(process.argv[2]);
const only = process.argv[3];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 1500 }, deviceScaleFactor: 1.5 });
  await p.route('http://mock.local/**', (route) => {
    const f = __dirname + '/' + decodeURIComponent(new URL(route.request().url()).pathname.slice(1));
    route.fulfill({ path: f });
  });
  await p.goto('http://mock.local/render.html');
  await p.waitForTimeout(500);
  for (const [name, cfg] of Object.entries(scenes)) {
    if (only && !name.startsWith(only)) continue;
    await p.evaluate((c) => window.scene(c), cfg);
    await p.waitForTimeout(300);
    await p.locator('.scene').screenshot({ path: __dirname + `/out/${name}.png` });
    console.log('shot', name);
  }
  await b.close();
})();
