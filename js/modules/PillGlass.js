// PillGlass — the hero CTA's glass, for a pill that floats over a case page.
// On the homepage InkSky draws the glass inside its own sky shader. A case
// page has no sky canvas, so this draws the same glass (refraction through
// the rim, split colour at the edge, the light from top left, the bevel) in a
// small WebGL canvas inside the pill, over a copy of whatever sky sits behind
// it: the same gradient and washi the page paints. Over the white sheet the
// pill is frosted ink in CSS instead, so the canvas hides.
// No WebGL: the pill keeps its CSS frost.

const VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';

// The glass() body is InkSky's, with the scene swapped for the page's sky.
const FRAG = `precision highp float;
uniform vec2 uSize; uniform float uDpr; uniform vec2 uOrigin; uniform vec2 uSky;
uniform vec3 uTop; uniform vec3 uBottom; uniform sampler2D uPaper; uniform vec2 uPaperFit;
float sdBox(vec2 p, vec2 b){ vec2 d = abs(p) - b; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0); }
vec3 scene(vec2 p){
  vec2 s = uOrigin + p/uDpr;                      // css px in the sky's box
  vec3 c = mix(uTop, uBottom, clamp(s.y/uSky.y, 0.0, 1.0));
  vec2 puv = (s/uSky - 0.5)*uPaperFit + 0.5;
  return c*mix(vec3(1.0), texture2D(uPaper, puv).rgb, 0.25);
}
void main(){
  vec2 p = vec2(gl_FragCoord.x, uSize.y - gl_FragCoord.y);
  vec2 hb = uSize*0.5; float rr = hb.y;
  vec2 lp = p - hb;
  float sd = sdBox(lp, hb - vec2(rr)) - rr;
  float depth = -sd;
  vec2 cp = vec2(clamp(lp.x, -(hb.x - rr), hb.x - rr), 0.0);
  vec2 n = lp - cp; float nl = length(n); n = nl > 0.001 ? n/nl : vec2(0.0, 1.0);
  float e = 1.0 - clamp(depth/(rr*0.95), 0.0, 1.0); e = e*e;
  float k = rr*1.25*e;
  vec2 c0 = hb + lp*0.92;
  vec3 g = vec3(scene(c0 + n*k).r, scene(c0 + n*k*0.88).g, scene(c0 + n*k*0.76).b);
  g = mix(g, vec3(1.0), 0.10)*1.06;
  g += 0.05*smoothstep(rr, -rr, lp.y);
  float rim = exp(-depth/(1.0*uDpr)), bev = exp(-depth/(6.0*uDpr));
  vec2 L = normalize(vec2(-0.5, -0.87));
  float l1 = max(0.0, dot(n, L)), l2 = max(0.0, dot(n, -L)), side = 1.0 - abs(dot(n, L));
  g += vec3(1.0)*rim*(0.95*pow(l1, 2.2) + 0.45*pow(l2, 3.0));
  g += vec3(1.0)*bev*(0.14*pow(l1, 1.5) + 0.05*pow(l2, 2.0));
  g *= 1.0 - 0.10*bev*side;
  float a = smoothstep(0.8*uDpr, -0.8*uDpr, sd);
  gl_FragColor = vec4(g*a, a);
}`;

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const TOP = hex('#4a86c3');
const BOTTOM = hex('#9ec6e4');

let paper = null; // the washi image, shared by every pill
const loadPaper = () => paper || (paper = new Promise((resolve) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = () => resolve(null);
  img.src = '/ink/washi.jpg';
}));

export default class PillGlass {
  constructor(el) {
    this.el = el;
    this.ok = false;
    const canvas = document.createElement('canvas');
    canvas.className = 'case__back-glass';
    canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return;
    this.canvas = canvas;
    this.gl = gl;

    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    this.prog = prog;
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.u = {};
    ['uSize', 'uDpr', 'uOrigin', 'uSky', 'uTop', 'uBottom', 'uPaper', 'uPaperFit'].forEach((k) => { this.u[k] = gl.getUniformLocation(prog, k); });
    gl.uniform3fv(this.u.uTop, TOP);
    gl.uniform3fv(this.u.uBottom, BOTTOM);
    gl.uniform1i(this.u.uPaper, 0);

    this.ready = loadPaper().then((img) => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      if (img) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
      this.paperSize = img ? [img.naturalWidth, img.naturalHeight] : [1, 1];
      el.prepend(canvas);
      el.classList.add('is-gl');
      this.ok = true;
    });
  }

  // Draw the glass over the sky box `sky` (a DOMRect of the element that
  // paints the gradient behind the pill).
  draw(sky) {
    if (!this.ok || !sky || !sky.width) return false;
    const { gl, canvas, u } = this;
    const r = this.el.getBoundingClientRect();
    if (!r.width) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(r.width * dpr);
    const h = Math.round(r.height * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(u.uSize, w, h);
    gl.uniform1f(u.uDpr, dpr);
    gl.uniform2f(u.uOrigin, r.left - sky.left, r.top - sky.top);
    gl.uniform2f(u.uSky, sky.width, sky.height);
    // washi drawn "cover" over the sky box, as the CSS does
    const [pw, ph] = this.paperSize;
    const s = Math.max(sky.width / pw, sky.height / ph);
    gl.uniform2f(u.uPaperFit, sky.width / (pw * s), sky.height / (ph * s));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return true;
  }
}
