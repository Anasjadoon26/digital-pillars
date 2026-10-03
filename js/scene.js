// Realtime 3D environment: one module, four variants. Falls back to CSS when WebGL is missing.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { ACCENT } from './config.js';
import { reduced, mobile } from './motion.js';

const hasGL = () => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } };


// Skyline: one monumental tower among shorter ones, edge-lit, with a mirrored wet-floor reflection.
function buildSkyline(root, mirror) {
  const body = new THREE.MeshStandardMaterial({ color: 0x0a1226, metalness: 0.7, roughness: 0.25, emissive: 0x0a1a3a, emissiveIntensity: 0.6, transparent: mirror, opacity: mirror ? 0.18 : 1, depthWrite: !mirror });
  const lines = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: mirror ? 0.2 : 0.95 });
  const bands = new THREE.MeshBasicMaterial({ color: 0x8dbaff, transparent: true, opacity: mirror ? 0.15 : 0.75 });
  const T = [[0,0,1.5,7.2],[-1.9,.4,1.1,4.6],[1.9,.2,1.2,5.4],[-3.4,-.6,1,3.2],[3.5,-.5,.9,3.8],[-.9,-1.6,.9,3],[1.2,-1.8,.8,2.4],[5,-1.2,.8,2.6],[-5,-1.4,.9,2.2]];
  (mobile ? T.slice(0, 6) : T).forEach(([x, z, w, h], i) => {
    const geo = new THREE.BoxGeometry(w, h, w), m = new THREE.Mesh(geo, body);
    m.position.set(x, h / 2, z); m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), lines));
    const n = Math.floor(h * 1.4);
    for (let k = 1; k < n; k++) if ((k + i) % 3 === 0) { const b = new THREE.Mesh(new THREE.BoxGeometry(w * 1.01, 0.035, w * 1.01), bands); b.position.y = -h / 2 + k * h / n; m.add(b); }
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.03, h * 0.92, 0.03), bands); s.position.set(w / 2, 0, w / 2); m.add(s);
    root.add(m);
  });
}

export function createScene(canvas, variant = 'pillar') {
  if (!hasGL()) { canvas.hidden = true; document.documentElement.classList.add('no-gl'); return null; }
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.75));
  const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x06102a, 0.018);
  const cam = new THREE.PerspectiveCamera(36, 1, 0.1, 100); const P = variant === 'pillar'; cam.position.set(0, P ? 2 : 1.2, P ? (mobile ? 23 : 17) : 11);
  scene.add(new THREE.HemisphereLight(0x6f93ff, 0x050914, 0.9));
  const key = new THREE.PointLight(ACCENT, 0, 60); key.position.set(0, 7, 8); scene.add(key);
  const warm = new THREE.PointLight(0xff8a2b, 0, 40); warm.position.set(0, 1, -5); scene.add(warm);
  const rim = new THREE.DirectionalLight(0xffffff, 0); rim.position.set(-5, 3, -4); scene.add(rim);

  const metal = new THREE.MeshStandardMaterial({ color: 0x0c0d10, metalness: 0.9, roughness: 0.28 });
  const edge = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.8 });
  const g = new THREE.Group(); scene.add(g);
  const addEdged = (geo, mesh) => { mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), edge)); g.add(mesh); return mesh; };

  if (variant === 'pillar') {
    buildSkyline(g, false);
    const refl = new THREE.Group(); refl.scale.y = -1; buildSkyline(refl, true); g.add(refl);
    const grid = new THREE.GridHelper(60, 60, ACCENT, 0x16285a); grid.material.transparent = true; grid.material.opacity = 0.28; g.add(grid);
    // Energy ring around the main tower, with a travelling light.
    const pivot = new THREE.Group(); pivot.position.y = 4.8; pivot.rotation.set(Math.PI / 2 - 0.2, 0, 0.25);
    pivot.add(new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.02, 8, mobile ? 64 : 160), new THREE.MeshBasicMaterial({ color: 0x8dbaff })));
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff })); pivot.add(dot);
    g.add(pivot); g.userData.orb = { dot, R: 2.5 };
    // Warm horizon glow + distant ridges.
    const c = document.createElement('canvas'); c.width = c.height = 128; const cx = c.getContext('2d');
    const gr = cx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,150,60,.9)'); gr.addColorStop(.4, 'rgba(255,110,40,.25)'); gr.addColorStop(1, 'rgba(255,100,30,0)');
    cx.fillStyle = gr; cx.fillRect(0, 0, 128, 128);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), blending: THREE.AdditiveBlending, depthWrite: false, fog: false, transparent: true }));
    glow.scale.set(40, 9, 1); glow.position.set(0, 0.6, -9); g.add(glow);
    for (let i = -4; i <= 4; i++) {
      const h = 2 + Math.abs(Math.sin(i * 2.3)) * 3, m = new THREE.Mesh(new THREE.ConeGeometry(2.6 + Math.abs(Math.cos(i)) * 1.2, h, 4), new THREE.MeshBasicMaterial({ color: 0x0a1430 }));
      m.position.set(i * 4.2, h / 2 - 0.2, -14); m.rotation.y = i; g.add(m);
    }
  } else if (variant === 'network') {
    const pts = [...Array(mobile ? 28 : 56)].map(() => new THREE.Vector3().randomDirection().multiplyScalar(2 + Math.random() * 1.8));
    const lp = []; pts.forEach((a, i) => pts.forEach((b, j) => { if (j > i && a.distanceTo(b) < 1.7) lp.push(a, b); }));
    g.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(pts), new THREE.PointsMaterial({ color: ACCENT, size: 0.09 })),
      new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(lp), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 })));
  } else if (variant === 'arch') {
    for (let x = -3; x <= 3; x++) for (let z = -2; z <= 1; z++) {
      const h = 0.4 + Math.abs(Math.sin(x * 1.7 + z)) * 2.4, geo = new THREE.BoxGeometry(0.6, h, 0.6);
      addEdged(geo, new THREE.Mesh(geo, metal)).position.set(x * 0.95, h / 2 - 2, z * 0.95);
    }
    g.rotation.x = 0.25;
  } else { // decision rings
    for (let i = 0; i < 5; i++) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(0.8 + i * 0.5, 0.012, 6, 96),
        new THREE.MeshBasicMaterial({ color: i === 2 ? ACCENT : 0xffffff, transparent: true, opacity: i === 2 ? 0.9 : 0.2 }));
      r.rotation.set(Math.PI / 2.4, i * 0.5, 0); r.userData.s = 0.15 - i * 0.02; g.add(r);
    }
  }

  const n = mobile ? 120 : 380, p = new Float32Array(n * 3); // dust
  for (let i = 0; i < n * 3; i++) p[i] = (Math.random() - 0.5) * (i % 3 === 1 ? 10 : 18);
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.02, transparent: true, opacity: 0.4 }));
  scene.add(dust);

  const pointer = { x: 0, y: 0 }, state = { light: 0 }; let visible = true, raf, offX = 0;
  addEventListener('pointermove', e => { pointer.x = e.clientX / innerWidth - .5; pointer.y = e.clientY / innerHeight - .5; });
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas.parentElement;
    renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    offX = P && w > 900 ? 3.2 : 0; // pillar sits right on desktop, centered on mobile
  };
  new ResizeObserver(resize).observe(canvas.parentElement); resize();
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);

  const clock = new THREE.Clock();
  const frame = () => {
    raf = requestAnimationFrame(frame); if (!visible) return;
    const t = clock.getElapsedTime(), k = reduced ? 0 : 1;
    g.rotation.y = (P ? Math.sin(t * 0.15) * 0.3 : t * 0.12) * k;
    const o = g.userData.orb; if (o && !reduced) o.dot.position.set(Math.cos(t * 0.8) * o.R, Math.sin(t * 0.8) * o.R, 0); g.children.forEach(c => { if (c.userData.s) c.rotation.z += c.userData.s * 0.01 * k; });
    dust.position.y = Math.sin(t * 0.2) * 0.2 * k;
    cam.position.x += ((mobile || reduced ? 0 : pointer.x * 0.8) - offX - cam.position.x) * 0.03;
    cam.position.y += ((P ? 2 : 1.2) - (reduced ? 0 : pointer.y * 0.6) - cam.position.y) * 0.03;
    cam.lookAt(-offX, P ? (mobile ? 0.5 : 3) : 0, 0);
    key.intensity = state.light * (170 + Math.sin(t * 0.8) * 20); warm.intensity = state.light * 90; rim.intensity = state.light * 0.9;
    renderer.render(scene, cam);
  };
  frame();
  return { state, dispose() { cancelAnimationFrame(raf); renderer.dispose(); } };
}