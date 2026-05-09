// ── Scroll-triggered animations ──
const animateEls = document.querySelectorAll('.animate-in');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

animateEls.forEach(el => revealObserver.observe(el));

// ── Navbar border on scroll ──
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Parallax on image sections ──
const ideasBg  = document.querySelector('.ideas-bg');
const ctaBg    = document.querySelector('.cta-bg');
const ideasSec = document.querySelector('.ideas');
const ctaSec   = document.querySelector('.cta-section');

function applyParallax() {
  const scrollY = window.scrollY;

  if (ideasBg && ideasSec) {
    const rect  = ideasSec.getBoundingClientRect();
    const inView = rect.bottom > 0 && rect.top < window.innerHeight;
    if (inView) {
      const offset = (rect.top / window.innerHeight) * 40;
      ideasBg.style.transform = `scale(1.06) translateY(${offset}px)`;
    }
  }

  if (ctaBg && ctaSec) {
    const rect  = ctaSec.getBoundingClientRect();
    const inView = rect.bottom > 0 && rect.top < window.innerHeight;
    if (inView) {
      const offset = (rect.top / window.innerHeight) * 40;
      ctaBg.style.transform = `scale(1.06) translateY(${offset}px)`;
    }
  }
}

window.addEventListener('scroll', applyParallax, { passive: true });
applyParallax();
