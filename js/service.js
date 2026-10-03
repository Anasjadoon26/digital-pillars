// Service destinations: one data-driven page, per-service 3D variant.
import { SERVICES } from './config.js';
import { createScene } from './scene.js';
import { smoothScroll, scrollChoreography, pointerEffects } from './motion.js';
import { initFaq } from './faq.js';

const s = SERVICES.find(x => x.slug === new URLSearchParams(location.search).get('s')) || SERVICES[0];
document.title = `${s.name} | Digital Pillars`;
const li = a => a.map(x => `<li>${x}</li>`).join('');
document.getElementById('app').innerHTML = `
<section class="hero sv"><div class="wrap">
  <h1>${s.name}</h1><p class="lede">${s.value}</p>
  <a class="btn" href="index.html#contact">Start a project</a></div></section>
<section class="wrap split"><h2 data-reveal>What we do</h2><ul class="scope" data-stagger>${li(s.scope)}</ul></section>
<section class="wrap"><h2 data-reveal>How it runs</h2>
  <ol class="steps" data-stagger>${s.process.map((p, i) => `<li class="glass"><b>${i + 1}</b><h3>${p[0]}</h3><p>${p[1]}</p></li>`).join('')}</ol></section>
<section class="wrap split"><h2 data-reveal>You receive</h2><ul class="scope" data-stagger>${li(s.deliver)}</ul></section>
<section class="wrap"><h2 data-reveal>Outcomes</h2><div class="stats" data-stagger>${s.stats.map(x => `<div class="glass"><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join('')}</div></section>
<section class="wrap"><h2 data-reveal>Related</h2><div class="related" data-stagger>${s.related.map(r => { const o = SERVICES.find(y => y.slug === r); return `<a class="svc" href="service.html?s=${o.slug}"><span>${o.name}</span><em>${o.tag}</em><i aria-hidden="true">View</i></a>`; }).join('')}</div></section>`;
createScene(document.getElementById('gl'), s.variant);
smoothScroll(); scrollChoreography(); pointerEffects(); initFaq();