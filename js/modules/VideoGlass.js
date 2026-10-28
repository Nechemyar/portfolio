// ——————————————————————————————————————————————
// VideoGlass — liquid glass that refracts the hero <video>
// ——————————————————————————————————————————————
// Used by SumiGlass in Safari and Firefox, which can't run SVG filters in
// backdrop-filter. Each video frame, the patch of footage behind the button is
// copied at half resolution (the soft scaling is the frost) and bent through a
// pill-shaped lens in a small WebGL canvas. The canvas lives inside the button,
// so the GSAP wipe, transforms and radius apply to it for free. It times its
// first 60 frames and hands back to the CSS frost if they run over budget.
const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const FRAG = `precision highp float;
uniform sampler2D tex;uniform vec2 size;uniform float dpr;uniform float radius;
uniform vec2 uvOrigin;uniform vec2 pxToUV;uniform float ready;
float sdBox(vec2 q,vec2 b,float r){vec2 d=abs(q)-b+r;return length(max(d,0.))+min(max(d.x,d.y),0.)-r;}
vec3 S(vec2 px){return texture2D(tex,clamp(uvOrigin+px*pxToUV,0.001,.999)).rgb;}
void main(){
  vec2 p=vec2(gl_FragCoord.x,size.y*dpr-gl_FragCoord.y)/dpr;   // css px, top-left origin
  vec2 c=size*.5, q=p-c;
  float d=sdBox(q,c,radius);
  float e=-d;                                                    // distance inside the edge
  vec2 eps=vec2(.5,0.);
  vec2 n=normalize(vec2(sdBox(q+eps.xy,c,radius)-sdBox(q-eps.xy,c,radius),sdBox(q+eps.yx,c,radius)-sdBox(q-eps.yx,c,radius))+1e-5);
  float bevel=min(size.y*.5,16.);
  float t=clamp(1.-e/bevel,0.,1.);
  float bend=t*t*t;                                              // curve hard only near the rim
  vec2 src=c+q*.9 - n*bend*14.;                                  // slight lens zoom + rim refraction
  vec2 ca=n*bend*1.2;                                            // chromatic split at the rim
  // Frost comes from sampling a low-res copy with linear filtering, so one tap per channel is enough.
  vec3 col=vec3(S(src+ca).r,S(src).g,S(src-ca).b);
  float l=dot(col,vec3(.2126,.7152,.0722));
  col=mix(vec3(l),col,1.25);                                     // a touch more saturation, like iOS
  col=col*.62;                                                   // match the hero scrim
  col=mix(col,vec3(.08),.25);                                    // smoky tint keeps white text legible
  col=mix(vec3(.3),col,ready);                                   // before the first frame
  float rim=smoothstep(1.6,0.,e);
  float light=.45+.55*max(dot(n,normalize(vec2(-.6,-1.))),0.);   // light from the top
  float sheen=smoothstep(.0,.55,1.-p.y/size.y)*.12;
  col+=rim*light*.55+sheen;
  col-=smoothstep(2.5,0.,e)*max(dot(n,vec2(0.,1.)),0.)*.10;      // faint dark lip along the bottom
  float a=clamp(.5-d*dpr,0.,1.);                                 // antialiased edge
  gl_FragColor=vec4(col*a,a);
}`;

export default class VideoGlass {
  constructor(el, video, { maxDpr = 2, budgetMs = 4, onFallback } = {}) {
    this.el = el; this.video = video; this.maxDpr = maxDpr;
    this.budgetMs = budgetMs; this.onFallback = onFallback; this.costs = [];
    // Resolves once real glass is on screen (first video frame) or it fell back.
    this.ready = new Promise((r) => { this.resolveReady = r; });
    const canvas = this.canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border-radius:inherit;z-index:0;pointer-events:none';
    const gl = this.gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false, powerPreference: 'low-power' });
    if (!gl) { this.resolveReady(); return; }  // keep the CSS frost
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(pr); gl.useProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { this.resolveReady(); return; }
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.u = {}; ['size', 'dpr', 'radius', 'uvOrigin', 'pxToUV', 'ready'].forEach(k => this.u[k] = gl.getUniformLocation(pr, k));
    this.tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, this.tex);
    [[gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE], [gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR]]
      .forEach(([k, v]) => gl.texParameteri(gl.TEXTURE_2D, k, v));
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([235, 235, 235, 255]));
    el.prepend(canvas); el.classList.add('is-gl'); el.dataset.glass = 'webgl';
    this.ok = true;
    this.hasFrame = false; this.visible = true;
    new IntersectionObserver(([en]) => { this.visible = en.isIntersecting; if (this.visible) this.loop(); }).observe(el);
    this.loop = this.loop.bind(this); this.loop();
  }
  loop() {
    if (this.raf || !this.visible || this.dead) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      const t0 = performance.now(), drew = this.draw();
      // Self-check, like BlurQuality: time the first 60 real frames and drop
      // to the CSS frost if this device can't afford it.
      if (drew && this.costs.length < 60) {
        this.costs.push(performance.now() - t0);
        if (this.costs.length === 60) {
          const m = [...this.costs].sort((a, b) => a - b)[30];
          if (m > this.budgetMs) return this.destroy(true);
        }
      }
      this.loop();
    });
  }
  destroy(fallback) {
    this.dead = true; cancelAnimationFrame(this.raf);
    this.canvas.remove(); this.el.classList.remove('is-gl');
    this.el.dataset.glass = fallback ? 'frost (slow device)' : 'frost';
    this.gl?.getExtension('WEBGL_lose_context')?.loseContext();
    if (fallback && this.onFallback) this.onFallback();
    this.resolveReady();
  }
  draw() {
    const { gl, el, video, canvas } = this;
    const r = el.getBoundingClientRect();
    if (!r.width) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, this.maxDpr);
    const W = Math.round(r.width * dpr), H = Math.round(r.height * dpr);
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W; canvas.height = H; gl.viewport(0, 0, W, H);
      this.radius = Math.min(r.height / 2, parseFloat(getComputedStyle(el).borderTopLeftRadius) || r.height / 2);
    }
    const vr = this.video.getBoundingClientRect();
    const key = `${r.left},${r.top},${r.width},${r.height},${vr.left},${vr.top},${vr.width},${vr.height}`;
    const t = video.currentTime, frameNew = video.readyState >= 2 && t !== this.lastT;
    if (!frameNew && key === this.lastKey) return false;   // paused and nothing moved: no work
    this.lastKey = key;
    // Copy just the patch of video behind the button (plus a margin for the
    // refraction to reach into) to a small canvas, and upload that. A full
    // 1080p texture upload every frame is what makes naive versions heavy.
    const M = 24, cw = r.width + M * 2, ch = r.height + M * 2, k = 0.5;                       // half-res patch = free frost
    const crop = this.crop || (this.crop = document.createElement('canvas'));
    const ctx = this.cctx || (this.cctx = crop.getContext('2d', { alpha: false }));
    const PW = Math.ceil(cw * k), PH = Math.ceil(ch * k);
    if (crop.width !== PW || crop.height !== PH) { crop.width = PW; crop.height = PH; }
    if (video.readyState >= 2) {
      if (frameNew) this.lastT = t;
      const vw = video.videoWidth, vh = video.videoHeight;
      const s = Math.max(vr.width / vw, vr.height / vh);                         // object-fit: cover
      const x0 = vr.left + (vr.width - vw * s) / 2, y0 = vr.top + (vr.height - vh * s) / 2;
      let sx = (r.left - M - x0) / s, sy = (r.top - M - y0) / s, sw = cw / s, sh = ch / s;
      let dx = 0, dy = 0, dw = PW, dh = PH;                                       // clamp to the frame
      if (sx < 0) { dx = -sx / sw * PW; dw -= dx; sw += sx; sx = 0; }
      if (sy < 0) { dy = -sy / sh * PH; dh -= dy; sh += sy; sy = 0; }
      if (sx + sw > vw) { const o = sx + sw - vw; dw -= o / sw * dw; sw -= o; }
      if (sy + sh > vh) { const o = sy + sh - vh; dh -= o / sh * dh; sh -= o; }
      ctx.fillStyle = '#D9D6D1'; ctx.fillRect(0, 0, PW, PH);
      if (sw > 0 && sh > 0) ctx.drawImage(video, sx, sy, sw, sh, dx, dy, dw, dh);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, crop);
      if (!this.hasFrame) requestAnimationFrame(() => this.resolveReady());
      this.hasFrame = true;
    }
    gl.uniform2f(this.u.size, r.width, r.height);
    gl.uniform1f(this.u.dpr, dpr);
    gl.uniform1f(this.u.radius, this.radius);
    gl.uniform2f(this.u.uvOrigin, M / cw, M / ch);
    gl.uniform2f(this.u.pxToUV, 1 / cw, 1 / ch);
    gl.uniform1f(this.u.ready, this.hasFrame ? 1 : 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    return frameNew;
  }
}
