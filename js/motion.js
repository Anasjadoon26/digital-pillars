// Motion utilities: Lenis + GSAP wiring, reveals, counters, tilt, magnetic.
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm';
import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/+esm';
gsap.registerPlugin(ScrollTrigger);

export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
export const mobile = matchMedia('(max-width: 760px)').matches;
export { gsap, ScrollTrigger };

export function smoothScroll() {
  if (reduced) return null;
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const el = document.querySelector(a.getAttribute('href'));
    if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -60 }); }
  }));
  return lenis;
}

// Depth reveals, alternating stagger, parallax, chart draw, counters. Opt-in via data attributes.
export function scrollChoreography() {
  const d = mobile ? 24 : 60;
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    gsap.from(el, { opacity:0, y:d, rotateX: reduced||mobile?0:8, transformPerspective:900, duration: reduced?0.01:1,
      ease:'power3.out', scrollTrigger:{ trigger:el, start:'top 85%', once:true } });
  });
  gsap.utils.toArray('[data-stagger]').forEach(g => {
    gsap.from(g.children, { opacity:0, x:i=>(i%2?1:-1)*(mobile?0:40), y:d/2, stagger:0.1, duration:reduced?0.01:0.9,
      ease:'power3.out', scrollTrigger:{ trigger:g, start:'top 82%', once:true } });
  });
  if (!reduced && !mobile) gsap.utils.toArray('[data-speed]').forEach(el =>
    gsap.to(el, { yPercent:+el.dataset.speed, ease:'none', scrollTrigger:{ trigger:el, scrub:true } }));
  gsap.utils.toArray('.chart path').forEach(p => {
    const L = p.getTotalLength(); p.style.strokeDasharray = L;
    gsap.fromTo(p, { strokeDashoffset:L }, { strokeDashoffset:0, duration:reduced?0.01:1.6, ease:'power2.out',
      scrollTrigger:{ trigger:p, start:'top 95%', once:true } });
  });
  document.querySelectorAll('[data-count]').forEach(el => {
    const to = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1]||'').length, o = { v:0 };
    ScrollTrigger.create({ trigger:el, start:'top 95%', once:true, onEnter:() =>
      gsap.to(o, { v:to, duration:reduced?0.01:1.8, ease:'power2.out',
        onUpdate:() => el.textContent = (el.dataset.pre||'') + o.v.toFixed(dec) + (el.dataset.suf||'') }) });
  });
}

// Cursor-reactive tilt and magnetic buttons: fine-pointer devices only.
export function pointerEffects() {
  if (reduced || !fine) return;
  document.querySelectorAll('.glass').forEach(c => {
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect(), x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5;
      gsap.to(c, { rotateY:x*10, rotateX:-y*10, transformPerspective:800, duration:.4, overwrite:'auto' });
    });
    c.addEventListener('pointerleave', () => gsap.to(c, { rotateX:0, rotateY:0, duration:.6 }));
  });
  document.querySelectorAll('.btn').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      gsap.to(b, { x:(e.clientX-r.left-r.width/2)*.25, y:(e.clientY-r.top-r.height/2)*.35, duration:.25 });
    });
    b.addEventListener('pointerleave', () => gsap.to(b, { x:0, y:0, duration:.4, ease:'power3.out' }));
  });
}