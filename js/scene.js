// Realtime 3D environment: one module, four variants. Falls back to CSS when WebGL is missing.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { ACCENT } from './config.js';
import { reduced, mobile } from './motion.js';

const hasGL = () => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } };

export function createScene(canvas, variant = 'pillar') {
  if (!hasGL()) { canvas.hidden = true; document.documentElement.classList.add('no-gl'); return null; }
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.75));
  const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x050506, 0.045);
  const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 100); cam.position.set(0, 1.2, 11);
  scene.add(new THREE.HemisphereLight(0x8899aa, 0x050506, 0.4));
  const key = new THREE.PointLight(ACCENT, 0, 30); key.position.set(3, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 0); rim.position.set(-5, 3, -4); scene.add(rim);

  const metal = new THREE.MeshStandardMaterial({ color: 0x0c0d10, metalness: 0.9, roughness: 0.28 });
  const edge = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.8 });
  const g = new THREE.Group(); scene.add(g);
  const addEdged = (geo, mesh) => { mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), edge)); g.add(mesh); return mesh; };

  if (variant === 'pillar') { // tapering slabs with lit seams + orbit rings
    for (let i = 0; i < 9; i++) {
      const w = 1.5 - i * 0.04, geo = new THREE.BoxGeometry(w, 0.62, w);
      addEdged(geo, new THREE.Mesh(geo, metal)).position.y = -2.6 + i * 0.68;
    }
    for (let i = 0; i < 3; i++) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(2.2 + i * 0.6, 0.008, 6, mobile ? 64 : 128),
        new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.35 - i * 0.08 }));
      r.rotation.x = Math.PI / 2; r.position.y = -1 + i * 1.4; r.userData.s = 0.1 + i * 0.05; g.add(r);
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
    offX = variant === 'pillar' && w > 900 ? 2.2 : 0; // pillar sits right on desktop, centered on mobile
  };
  new ResizeObserver(resize).observe(canvas.parentElement); resize();
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);

  const clock = new THREE.Clock();
  const frame = () => {
    raf = requestAnimationFrame(frame); if (!visible) return;
    const t = clock.getElapsedTime(), k = reduced ? 0 : 1;
    g.rotation.y = t * 0.12 * k; g.children.forEach(c => { if (c.userData.s) c.rotation.z += c.userData.s * 0.01 * k; });
    dust.position.y = Math.sin(t * 0.2) * 0.2 * k;
    cam.position.x += ((mobile || reduced ? 0 : pointer.x * 0.8) - offX - cam.position.x) * 0.03;
    cam.position.y += (1.2 - (reduced ? 0 : pointer.y * 0.6) - cam.position.y) * 0.03;
    cam.lookAt(-offX, 0, 0);
    key.intensity = state.light * (28 + Math.sin(t * 0.8) * 4); rim.intensity = state.light * 0.9;
    renderer.render(scene, cam);
  };
  frame();
  return { state, dispose() { cancelAnimationFrame(raf); renderer.dispose(); } };
}