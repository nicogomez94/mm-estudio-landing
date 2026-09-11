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

const projectCases = {
  beca: {
    index: 'CASO 01 / 03',
    kicker: 'STORYTELLING · PRODUCTO',
    title: 'BECA REMASTERED',
    ghost: 'BECA',
    video: 'assets/projects/beca-storytelling.mp4',
    poster: 'assets/projects/beca-storytelling.jpg',
    description: 'Una pieza construida alrededor de un ritual cotidiano. El producto aparece dentro de la historia, con humor, tensión y una edición diseñada para sostener la atención hasta el último segundo.',
    facts: [
      ['9:16', 'FORMATO NATIVO'],
      ['01', 'HISTORIA CENTRAL'],
      ['FULL', 'PRODUCCIÓN + POST']
    ],
    deliverables: 'Concepto creativo · Guion · Dirección de contenido · Producción · Edición social'
  },
  dagna: {
    index: 'CASO 02 / 03',
    kicker: 'INFLUENCER MKT · VIAJES',
    title: 'DAGNA KILLS',
    ghost: 'DAGNA',
    video: 'assets/projects/dagna-kills.mp4',
    poster: 'assets/projects/dagna-kills.jpg',
    description: 'Una serie de travel diaries que mezcla recomendación, moda y observación cultural. La cámara acompaña una voz auténtica y convierte cada locación en un capítulo reconocible.',
    facts: [
      ['DIARY', 'LENGUAJE EDITORIAL'],
      ['UGC+', 'CÓDIGO DE CONTENIDO'],
      ['SERIE', 'PENSADO PARA ESCALAR']
    ],
    deliverables: 'Idea de serie · Storytelling · Curaduría de escenas · Influencer marketing · Edición'
  },
  hostel: {
    index: 'CASO 03 / 03',
    kicker: 'CONTENIDO SOCIAL · HOSPITALIDAD',
    title: 'HOSTEL POINT',
    ghost: 'POINT',
    video: 'assets/projects/hostel-point.mp4',
    poster: 'assets/projects/hostel-point.jpg',
    description: 'Personajes, humor y situaciones reales para mostrar la experiencia del hostel desde adentro. Una campaña vertical que transforma hospitalidad en cultura compartible.',
    facts: [
      ['CAST', 'PERSONAJES REALES'],
      ['SERIE', 'NARRATIVA SOCIAL'],
      ['9:16', 'VIDEO MOBILE FIRST']
    ],
    deliverables: 'Concepto · Guion de situaciones · Producción · Dirección de talentos · Postproducción'
  }
};

const projectModal = document.querySelector('#project-modal');
const projectModalShell = projectModal?.querySelector('.project-modal-shell');
const projectModalVideo = document.querySelector('#project-modal-video');
const projectModalClose = projectModal?.querySelector('.project-modal-close');
let lastProjectTrigger = null;

const closeProjectModal = () => {
  if (!projectModal?.open || projectModal.classList.contains('is-closing')) return;
  projectModal.classList.add('is-closing');
  projectModalVideo?.pause();

  window.setTimeout(() => {
    projectModal.close();
    projectModal.classList.remove('is-closing');
    document.body.classList.remove('modal-open');
    projectModalVideo.removeAttribute('src');
    projectModalVideo.removeAttribute('poster');
    projectModalVideo.load();
    lastProjectTrigger?.focus({ preventScroll: true });
  }, reducedMotion ? 0 : 460);
};

document.querySelectorAll('.project-modal-trigger').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    const project = projectCases[trigger.dataset.project];
    if (!project || !projectModal) return;
    lastProjectTrigger = trigger;

    const revealX = event.detail === 0 ? window.innerWidth / 2 : event.clientX;
    const revealY = event.detail === 0 ? window.innerHeight / 2 : event.clientY;
    projectModalShell.style.setProperty('--modal-x', `${revealX}px`);
    projectModalShell.style.setProperty('--modal-y', `${revealY}px`);
    document.querySelector('#project-modal-index').textContent = project.index;
    document.querySelector('#project-modal-kicker').textContent = project.kicker;
    document.querySelector('#project-modal-title').textContent = project.title;
    document.querySelector('#project-modal-description').textContent = project.description;
    document.querySelector('#project-modal-deliverables').textContent = project.deliverables;
    document.querySelector('#project-modal-ghost').textContent = project.ghost;
    document.querySelector('#project-modal-facts').innerHTML = project.facts.map(([value, label]) => `
      <div class="project-modal-fact"><strong>${value}</strong><span>${label}</span></div>
    `).join('');
    projectModalVideo.poster = project.poster;
    projectModalVideo.src = project.video;
    document.body.classList.add('modal-open');
    projectModal.showModal();
    projectModalClose.focus({ preventScroll: true });
  });
});

projectModalClose?.addEventListener('click', closeProjectModal);
projectModal?.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeProjectModal();
});

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
