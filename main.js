// ===== Header shadow on scroll =====
const header = document.getElementById('site-header');
const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== Mobile nav toggle =====
const toggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () => {
            navLinks.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        })
    );
}

// ===== Smooth scroll for same-page anchors =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const id = this.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Scroll reveal via IntersectionObserver =====
// Progressive enhancement: content is visible by default. We only opt in to
// the hidden-until-revealed state (html.js-reveal) when the observer can
// actually fire — i.e. IO is supported, the viewport has real height, and
// the user hasn't asked for reduced motion. This prevents a permanently
// blank page in prerenderers, zero-height webviews, or headless renderers.
const reveals = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && reveals.length &&
    window.innerHeight > 0 && !reduceMotion) {
    document.documentElement.classList.add('js-reveal');
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => io.observe(el));
    // Safety net: if nothing has intersected shortly after load (broken
    // viewport metrics, aggressive iframe throttling), reveal everything.
    setTimeout(() => {
        if (!document.querySelector('.reveal.in')) {
            document.documentElement.classList.remove('js-reveal');
        }
    }, 2500);
}

// ===== Current year in footer =====
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
