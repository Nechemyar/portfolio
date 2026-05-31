/*
  ArchSlider — dev-only tool, only mounts on localhost.
  Renders a floating panel with a range input that live-updates
  --arch-h on :root so you can dial in the curve depth visually.
*/
export default class ArchSlider {
  constructor() {
    if (!window.location.hostname.includes('localhost') &&
        !window.location.hostname.includes('127.0.0.1')) return;
    this.mount();
  }

  mount() {
    const current = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--arch-h') || '80',
      10
    );

    const panel = document.createElement('div');
    panel.id = 'arch-slider-panel';
    panel.innerHTML = `
      <style>
        #arch-slider-panel {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 9999;
          background: rgba(0,0,0,0.85);
          color: #fff;
          font-family: monospace;
          font-size: 12px;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 180px;
          backdrop-filter: blur(6px);
          user-select: none;
          touch-action: none;
        }
        #arch-slider-panel label {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        #arch-slider-panel input[type=range] {
          width: 100%;
          accent-color: #ec4a1e;
          cursor: pointer;
        }
        #arch-slider-copy {
          background: #ec4a1e;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 3px 8px;
          font-family: monospace;
          font-size: 11px;
          cursor: pointer;
          align-self: flex-end;
        }
      </style>
      <label>
        <span>--arch-h</span>
        <span id="arch-val">${current}px</span>
      </label>
      <input type="range" id="arch-range" min="0" max="200" step="1" value="${current}" />
      <button id="arch-slider-copy">copy value</button>
    `;

    document.body.appendChild(panel);

    const range = document.getElementById('arch-range');
    const valEl = document.getElementById('arch-val');

    range.addEventListener('input', () => {
      const v = range.value;
      document.documentElement.style.setProperty('--arch-h', `${v}px`);
      valEl.textContent = `${v}px`;
    });

    document.getElementById('arch-slider-copy').addEventListener('click', () => {
      navigator.clipboard?.writeText(`--arch-h: ${range.value}px`).then(() => {
        const btn = document.getElementById('arch-slider-copy');
        btn.textContent = 'copied!';
        setTimeout(() => { btn.textContent = 'copy value'; }, 1500);
      });
    });
  }
}
