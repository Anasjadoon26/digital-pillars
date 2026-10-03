// Home entry. Intro order: environment -> light -> cards -> type -> CTAs.
import { gsap, smoothScroll, scrollChoreography, pointerEffects, reduced } from './motion.js';
import { createScene } from './scene.js';
import { initFaq } from './faq.js';
import { SERVICES, TESTIMONIALS } from './config.js';

document.getElementById('services-list').innerHTML = SERVICES.map(s =>
  `<a class="svc" href="service.html?s=${s.slug}"><span>${s.name}</span><em>${s.tag}</em><i aria-hidden="true">View</i></a>`).join('');
const track = document.getElementById('t-track');
track.innerHTML = TESTIMONIALS.map(t =>
  `<figure class="glass t"><blockquote>${t[2]}</blockquote><figcaption><i class="av">${t[0][0]}</i><b>${t[0]}</b><span>${t[1]}</span></figcaption><strong>${t[3]}</strong></figure>`).join('');
document.querySelectorAll('[data-dir]').forEach(b => b.addEventListener('click', () =>
  track.scrollBy({ left: b.dataset.dir * track.clientWidth * .8, behavior: reduced ? 'auto' : 'smooth' })));

const sc = createScene(document.getElementById('gl'), 'pillar');
smoothScroll(); scrollChoreography(); pointerEffects(); initFaq();

// Nav active state + mobile menu.
const links = [...document.querySelectorAll('.nav a[href^="#"]')];
document.querySelectorAll('main section[id]').forEach(s => new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle('on', l.hash === '#' + s.id));
}), { rootMargin: '-45% 0px -50%' }).observe(s));
const menu = document.querySelector('.menu');
menu.addEventListener('click', () => menu.setAttribute('aria-expanded', document.body.classList.toggle('nav-open')));
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => { document.body.classList.remove('nav-open'); menu.setAttribute('aria-expanded', false); }));

// Hero intro. Content is visible by default if JS fails.
if (reduced) { if (sc) sc.state.light = 1; }
else {
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('#gl', { opacity: 0, duration: 1.6 })
    .to(sc ? sc.state : {}, { light: 1, duration: 2 }, 0.6)
    .from('.hero .glass', { opacity: 0, z: -200, y: 40, stagger: .18, duration: 1.2 }, 1.1)
    .from('.hero h1 span', { yPercent: 110, stagger: .12, duration: 1 }, 1.6)
    .from('.hero .lede, .hero .label', { opacity: 0, y: 14, duration: .9 }, 2.1)
    .from('.hero .btn', { opacity: 0, y: 16, stagger: .1, duration: .7 }, 2.5)
    .add(() => gsap.to('.hero .glass', { y: i => (i % 2 ? 8 : -8), duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: .4 }), 3);
}