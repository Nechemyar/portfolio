// ——————————————————————————————————————————————
// InkSky — the printed sky behind the intro
// ——————————————————————————————————————————————
// One WebGL canvas, sticky inside .intro, so it holds still while the hero,
// the reel scroll and the trust line pass over it, then leaves with the
// intro's last pixel. The art is Japanese woodblock-style cloud layers
// (painted with Codex, cut out to alpha); this file only places and draws
// them. InkStory.js moves them on scroll by tweening this.state.
//
// Two passes:
//  1. Scene: a sky-blue wash, deeper at the top, with uneven ink (low
//     noise), the sun, then the cloud layers far to near, into a buffer.
//  2. Composite: the glass CTA bends the buffer (rim refraction, light on
//     the edges facing the light only, a bevel, no full white border), then
//     the printer's bokashi band darkens the top of the sky, washi paper is
//     multiplied over everything so the fibres show through the ink, and a
//     little grain. Doing paper and grain here costs nothing extra, where
//     full-screen blend-mode layers in CSS would.
// No WebGL: .intro keeps its CSS ground and the CTA keeps its frost.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ART = {
  sun: '/ink/sun.webp',
  wisp: '/ink/wisp.webp',
  puff: '/ink/puff.webp',
  corner: '/ink/corner.webp',
  bank: '/ink/bank.webp'
};
const PAPER = '/ink/washi.jpg';
const ORDER = ['sun', 'wisp', 'puff', 'corner', 'bank']; // far to near

// Resting places, as fractions of the canvas: w width, x left or r right,
// y top or b bottom, h an optional height cap (so short phones don't grow
// the art down into the words). Phone first; wide screens get smaller art.
const GEO = {
  phone: {
    sun: { w: 0.30, x: 0.10, y: 0.14 },
    wisp: { w: 0.62, x: -0.22, y: 0.20, h: 0.11 },
    puff: { w: 0.40, r: -0.10, y: 0.66 },
    corner: { w: 0.84, r: -0.18, y: -0.09, h: 0.37 },
    bank: { w: 1.70, x: -0.35, b: -0.07, h: 0.38 }
  },
  wide: {
    sun: { w: 0.10, x: 0.16, y: 0.14 },
    wisp: { w: 0.34, x: -0.08, y: 0.22 },
    puff: { w: 0.16, r: 0.08, y: 0.58 },
    corner: { w: 0.40, r: -0.10, y: -0.10 },
    bank: { w: 1.04, x: -0.02, b: -0.44 }
  }
};

// idle drift per layer: px amplitude and seconds per swing
const DRIFT = { sun: [0, 1], wisp: [14, 11], puff: [10, 9], corner: [8, 13], bank: [6, 15] };

// The sky wash, as linear RGB 0–1: the ground graded from top to horizon the
// way a printer wipes the block, and the deeper bokashi band along the top.
const SKY = {
  top: [0.290, 0.525, 0.765],    // #4a86c3
  bottom: [0.620, 0.776, 0.894], // #9ec6e4
  band: [0.118, 0.318, 0.553],   // #1e518d
  bandAmount: 0.5
};

const VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';

const GROUND_F = `precision highp float;
uniform vec2 uRes; uniform vec3 uTop; uniform vec3 uBottom;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
void main(){
  vec2 uv = gl_FragCoord.xy/uRes.y;
  // hand-pressed ink is never flat: soft, wide unevenness, stretched along the grain
  float m = n(uv*vec2(1.6, 5.0))*0.55 + n(uv*vec2(4.0, 13.0))*0.3 + n(uv*vec2(9.0, 30.0))*0.15;
  vec3 ink = mix(uBottom, uTop, smoothstep(0.1, 1.0, gl_FragCoord.y/uRes.y));
  gl_FragColor = vec4(ink*(0.95 + 0.08*m), 1.0);
}`;

const SPRITE_V = `attribute vec2 a; uniform vec4 uRect; uniform vec2 uRes; varying vec2 vUv;
void main(){
  vec2 c = a*0.5 + 0.5; vec2 p = uRect.xy + c*uRect.zw;
  gl_Position = vec4(p.x/uRes.x*2.0 - 1.0, 1.0 - p.y/uRes.y*2.0, 0.0, 1.0); vUv = c;
}`;

const SPRITE_F = `precision mediump float;
uniform sampler2D uT; uniform float uA; varying vec2 vUv;
void main(){ gl_FragColor = texture2D(uT, vUv)*uA; }`;

const COMPOSITE = `precision highp float;
uniform vec2 uRes; uniform sampler2D uScene; uniform sampler2D uPaper; uniform vec2 uPaperFit;
uniform vec4 uPill; uniform float uClip; uniform float uDpr; uniform vec4 uBand;
float sdBox(vec2 p, vec2 b){ vec2 d = abs(p) - b; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0); }
vec3 scene(vec2 p){ return texture2D(uScene, vec2(p.x, uRes.y - p.y)/uRes).rgb; }
vec3 glass(vec3 col, vec2 p){
  vec2 hb = uPill.zw; float rr = hb.y;
  if (rr < 1.0 || p.y < uClip) return col;
  vec2 lp = p - uPill.xy;
  float sd = sdBox(lp, hb - vec2(rr)) - rr;
  if (sd > 0.0) return col*(1.0 - 0.14*exp(-sd/(10.0*uDpr))*smoothstep(-rr*0.6, rr*1.2, lp.y));
  float depth = -sd;
  vec2 cp = vec2(clamp(lp.x, -(hb.x - rr), hb.x - rr), 0.0);
  vec2 n = lp - cp; float nl = length(n); n = nl > 0.001 ? n/nl : vec2(0.0, 1.0);
  float e = 1.0 - clamp(depth/(rr*0.95), 0.0, 1.0); e = e*e;
  float k = rr*1.25*e;
  vec2 c0 = uPill.xy + lp*0.92;
  vec3 g = vec3(scene(c0 + n*k).r, scene(c0 + n*k*0.88).g, scene(c0 + n*k*0.76).b);
  g = mix(g, vec3(1.0), 0.10)*1.06;
  g += 0.05*smoothstep(rr, -rr, lp.y);
  float rim = exp(-depth/(1.0*uDpr)), bev = exp(-depth/(6.0*uDpr));
  vec2 L = normalize(vec2(-0.5, -0.87));
  float l1 = max(0.0, dot(n, L)), l2 = max(0.0, dot(n, -L)), side = 1.0 - abs(dot(n, L));
  g += vec3(1.0)*rim*(0.95*pow(l1, 2.2) + 0.45*pow(l2, 3.0));
  g += vec3(1.0)*bev*(0.14*pow(l1, 1.5) + 0.05*pow(l2, 2.0));
  g *= 1.0 - 0.10*bev*side;
  return mix(col, g, smoothstep(0.8*uDpr, -0.8*uDpr, sd));
}
void main(){
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec3 col = glass(scene(p), p);
  // bokashi: the wiped band of darker ink along the top of the sky
  float top = p.y/uRes.y;
  col = mix(col, uBand.rgb, uBand.a*(1.0 - smoothstep(0.0, 0.36, top)));
  // washi multiplied over the print
  vec2 puv = (gl_FragCoord.xy/uRes - 0.5)*uPaperFit + 0.5;
  col *= mix(vec3(1.0), texture2D(uPaper, puv).rgb, 0.24);
  float g = fract(sin(dot(p, vec2(12.9898, 78.233)))*43758.5453);
  gl_FragColor = vec4(col + (g - 0.5)*0.035, 1.0);
}`;

export default class InkSky {
  constructor() {
    this.intro = document.querySelector('.intro');
    this.canvas = document.querySelector('.intro__sky');
    this.cta = document.querySelector('.hero__cta');
    this.ok = false;
    this.ready = Promise.resolve();
    // InkStory tweens these: offsets in px from each layer's resting place,
    // s scale, a opacity (the entrance prints them in one by one)
    this.state = {};
    ORDER.forEach((k) => { this.state[k] = { x: 0, y: 0, s: 1, a: 0 }; });
    if (!this.intro || !this.canvas) return;

    const gl = this.canvas.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: false });
    if (!gl) {
      this.intro.classList.add('no-gl');
      return;
    }
    this.gl = gl;
    this.ok = true;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.tex = {};
    this.inView = true;

    this.build();
    this.ready = this.load();
    this.resize();

    window.addEventListener('resize', () => this.resize());
    new IntersectionObserver(([entry]) => { this.inView = entry.isIntersecting; }).observe(this.intro);
    // Bring ScrollTrigger up to this frame's scroll first, so the hero words
    // (moved by GSAP, see InkStory) and the glass drawn here move together.
    this.tick = (time) => {
      if (!this.inView) return;
      ScrollTrigger.update();
      this.render(time);
    };
    gsap.ticker.add(this.tick);
  }

  build() {
    const gl = this.gl;
    const program = (vs, fs, names) => {
      const shader = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      };
      const p = gl.createProgram();
      gl.attachShader(p, shader(gl.VERTEX_SHADER, vs));
      gl.attachShader(p, shader(gl.FRAGMENT_SHADER, fs));
      gl.bindAttribLocation(p, 0, 'a');
      gl.linkProgram(p);
      const u = {};
      names.forEach((n) => { u[n] = gl.getUniformLocation(p, n); });
      return { p, u };
    };
    this.pGround = program(VERT, GROUND_F, ['uRes', 'uTop', 'uBottom']);
    this.pSprite = program(SPRITE_V, SPRITE_F, ['uRect', 'uRes', 'uT', 'uA']);
    this.pComp = program(VERT, COMPOSITE, ['uRes', 'uScene', 'uPaper', 'uPaperFit', 'uPill', 'uClip', 'uDpr', 'uBand']);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  }

  // Resolves once every layer is on the GPU and drawn once, so the entrance
  // and the glass never land on a half-built sky.
  load() {
    const gl = this.gl;
    const one = (key, src, premultiply) => new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        const t = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiply);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        this.texParams();
        this.tex[key] = { t, aspect: img.naturalWidth / img.naturalHeight };
        resolve();
      };
      img.onerror = resolve;
      img.src = src;
    });
    const jobs = ORDER.map((k) => one(k, ART[k], true));
    jobs.push(one('paper', PAPER, false));
    return Promise.all(jobs).then(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  }

  texParams() {
    const gl = this.gl;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  resize() {
    const gl = this.gl;
    this.vw = this.canvas.clientWidth;
    this.vh = this.canvas.clientHeight;
    this.phone = this.vw < 760;
    // the print is soft, so phones draw at 1.5x at most: half the pixels of 3x
    this.dpr = Math.min(window.devicePixelRatio || 1, this.phone ? 1.5 : 2);
    const w = Math.round(this.vw * this.dpr);
    const h = Math.round(this.vh * this.dpr);
    if (w === this.W && h === this.H) return;
    this.W = w;
    this.H = h;
    this.canvas.width = w;
    this.canvas.height = h;

    if (this.fboTex) gl.deleteTexture(this.fboTex);
    if (this.fbo) gl.deleteFramebuffer(this.fbo);
    this.fboTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.fboTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    this.texParams();
    this.fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.fboTex, 0);
  }

  // a layer's resting rect in CSS px
  place(key) {
    const g = (this.phone ? GEO.phone : GEO.wide)[key];
    const T = this.tex[key];
    const w = Math.min(g.w * this.vw, g.h ? g.h * this.vh * T.aspect : Infinity);
    const h = w / T.aspect;
    const x = g.r !== undefined ? this.vw - w - g.r * this.vw : g.x * this.vw;
    const y = g.b !== undefined ? this.vh - h - g.b * this.vh : g.y * this.vh;
    return { x, y, w, h };
  }

  render(time) {
    const gl = this.gl;
    const { W, H, dpr } = this;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.viewport(0, 0, W, H);
    gl.disable(gl.BLEND);
    gl.useProgram(this.pGround.p);
    gl.uniform2f(this.pGround.u.uRes, W, H);
    gl.uniform3fv(this.pGround.u.uTop, SKY.top);
    gl.uniform3fv(this.pGround.u.uBottom, SKY.bottom);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(this.pSprite.p);
    gl.uniform2f(this.pSprite.u.uRes, W, H);
    gl.uniform1i(this.pSprite.u.uT, 0);
    gl.activeTexture(gl.TEXTURE0);
    for (const key of ORDER) {
      const T = this.tex[key];
      const st = this.state[key];
      if (!T || st.a <= 0.001) continue;
      const r = this.place(key);
      const [amp, period] = DRIFT[key];
      const drift = this.reduced || !amp ? 0 : Math.sin((time / period) * Math.PI * 2) * amp;
      const w = r.w * st.s;
      const h = r.h * st.s;
      const x = r.x + (r.w - w) / 2 + st.x + drift;
      const y = r.y + (r.h - h) / 2 + st.y;
      if (y > this.vh || y + h < 0 || x > this.vw || x + w < 0) continue;
      gl.bindTexture(gl.TEXTURE_2D, T.t);
      gl.uniform1f(this.pSprite.u.uA, st.a);
      gl.uniform4f(this.pSprite.u.uRect, x * dpr, y * dpr, w * dpr, h * dpr);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    gl.disable(gl.BLEND);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, W, H);
    gl.useProgram(this.pComp.p);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.fboTex);
    gl.uniform1i(this.pComp.u.uScene, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.tex.paper ? this.tex.paper.t : this.fboTex);
    gl.uniform1i(this.pComp.u.uPaper, 1);
    // cover-fit the paper to the canvas
    const pa = this.tex.paper ? this.tex.paper.aspect : 1;
    const ca = W / H;
    gl.uniform2f(this.pComp.u.uPaperFit, ca > pa ? 1 : ca / pa, ca > pa ? pa / ca : 1);
    gl.uniform2f(this.pComp.u.uRes, W, H);
    gl.uniform1f(this.pComp.u.uDpr, dpr);
    gl.uniform4f(this.pComp.u.uBand, ...SKY.band, SKY.bandAmount);

    let pill = [0, 0, 0, 0];
    let clip = 0;
    const cta = this.cta;
    if (cta && cta.dataset.glass === 'sky' && cta.style.visibility === 'visible') {
      const box = this.canvas.getBoundingClientRect();
      const b = cta.getBoundingClientRect();
      pill = [(b.left - box.left + b.width / 2) * dpr, (b.top - box.top + b.height / 2) * dpr, (b.width / 2) * dpr, (b.height / 2) * dpr];
      // follow the entrance wipe: the clip-path's top edge, as a % of the pill
      const m = /polygon\(\S+\s+(-?[\d.]+)%/.exec(cta.style.clipPath || '');
      const top = m ? Math.max(0, parseFloat(m[1])) / 100 : 0;
      clip = (b.top - box.top + b.height * top) * dpr;
    }
    gl.uniform4fv(this.pComp.u.uPill, pill);
    gl.uniform1f(this.pComp.u.uClip, clip);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.activeTexture(gl.TEXTURE0);
  }
}
