const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const intro = document.querySelector('.intro-screen');
intro?.addEventListener('animationend', (event) => {
  if (event.animationName === 'introLeave') intro.remove();
});

const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
  mobileMenu.classList.toggle('is-open', !isOpen);
  mobileMenu.setAttribute('aria-hidden', String(isOpen));
  document.body.classList.toggle('menu-open', !isOpen);
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

document.querySelectorAll('.fade-in').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
  revealObserver.observe(element);
});

const progress = document.querySelector('.scroll-progress');
const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${percentage}%`;
};
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

const metricObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || entry.target.dataset.counted) return;
    entry.target.dataset.counted = 'true';
    const end = Number(entry.target.dataset.count);
    const suffix = entry.target.dataset.suffix || '';
    const duration = reducedMotion ? 0 : 1200;
    const startTime = performance.now();

    const tick = (now) => {
      const progressValue = duration === 0 ? 1 : Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progressValue, 3);
      entry.target.textContent = `${Math.round(end * eased)}${suffix}`;
      if (progressValue < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.55 });

document.querySelectorAll('.metric-value').forEach((metric) => metricObserver.observe(metric));

if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.service-item').forEach((item) => {
    item.addEventListener('pointermove', (event) => {
      const rect = item.getBoundingClientRect();
      item.style.setProperty('--hover-x', `${event.clientX - rect.left}px`);
      item.style.setProperty('--hover-y', `${event.clientY - rect.top}px`);
    });
  });
}

const cursor = document.querySelector('.cursor');
if (cursor && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });
  document.querySelectorAll('.cursor-target').forEach((target) => {
    target.addEventListener('pointerenter', () => cursor.classList.add('is-active'));
    target.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
  });
}

const hero = document.querySelector('.hero');
const heroTrailer = document.querySelector('.hero-trailer');
if (hero && heroTrailer && !reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  let targetX = hero.clientWidth * 0.72;
  let targetY = hero.clientHeight * 0.45;
  let currentX = targetX;
  let currentY = targetY;

  const followPointer = () => {
    currentX += (targetX - currentX) * 0.055;
    currentY += (targetY - currentY) * 0.055;
    heroTrailer.style.transform = `translate3d(${currentX - 71}px, ${currentY - 71}px, 0)`;
    requestAnimationFrame(followPointer);
  };

  hero.addEventListener('pointerenter', () => heroTrailer.classList.add('is-active'));
  hero.addEventListener('pointerleave', () => heroTrailer.classList.remove('is-active'));
  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    targetX = event.clientX - rect.left;
    targetY = event.clientY - rect.top;
  });

  requestAnimationFrame(followPointer);
}

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const media = card.querySelector('.project-media');
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      media.style.transform = `scale(1.035) translate3d(${x * -14}px, ${y * -14}px, 0)`;
    });
    card.addEventListener('pointerleave', () => {
      card.querySelector('.project-media').style.transform = '';
    });
  });
}

document.querySelector('#year').textContent = new Date().getFullYear();
