// script.js — Portfolio Interactions

// ── Nav scroll effect ──────────────────────────────────
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 60
    ? 'rgba(9,9,9,0.97)'
    : 'rgba(9,9,9,0.85)';
});

// ── Smooth active nav link ─────────────────────────────
const sections   = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('.nav-links a');

const observerOpts = { rootMargin: '-40% 0px -40% 0px' };
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--accent)'
          : 'var(--muted)';
      });
    }
  });
}, observerOpts);

sections.forEach(s => sectionObserver.observe(s));

// ── Reveal on scroll ──────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.project-card, .skill-group, .about-image-wrap, .stat, .contact-item'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Inject reveal CSS
const style = document.createElement('style');
style.textContent = `
  .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
  .reveal.revealed { opacity: 1; transform: none; }
  .project-card:nth-child(2) { transition-delay: 0.1s; }
  .project-card:nth-child(3) { transition-delay: 0.2s; }
  .project-card:nth-child(4) { transition-delay: 0.3s; }
  .skill-group:nth-child(2) { transition-delay: 0.15s; }
  .skill-group:nth-child(3) { transition-delay: 0.3s; }
`;
document.head.appendChild(style);

// ── Form status toast (from PHP redirect) ─────────────
const params = new URLSearchParams(window.location.search);
const status = params.get('status');
const msg    = params.get('msg');

if (status) {
  const toast = document.createElement('div');
  const isSuccess = status === 'success';

  toast.textContent = isSuccess
    ? '✓  Message sent! I\'ll get back to you soon.'
    : `✗  ${msg || 'Something went wrong. Please try again.'}`;

  Object.assign(toast.style, {
    position:     'fixed',
    bottom:       '2rem',
    right:        '2rem',
    padding:      '1rem 1.6rem',
    borderRadius: '8px',
    fontFamily:   'var(--font-mono)',
    fontSize:     '0.8rem',
    letterSpacing:'0.04em',
    color:        isSuccess ? '#090909' : '#fff',
    background:   isSuccess ? '#e8ff3c' : '#c0392b',
    boxShadow:    '0 8px 32px rgba(0,0,0,0.5)',
    zIndex:       '9998',
    transition:   'opacity 0.5s',
  });

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 500);
  }, 4000);

  // Clean URL
  window.history.replaceState({}, '', window.location.pathname);
}

// ── Magnetic button effect on CTA ─────────────────────
document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width  / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    btn.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});
