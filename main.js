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
    index: 'CASO 01 / 05',
    kicker: 'STORYTELLING · PRODUCTO',
    title: 'BECA REMASTERED',
    ghost: 'BECA',
    media: [{
      video: 'assets/projects/beca-storytelling.mp4',
      poster: 'assets/projects/beca-storytelling.jpg',
      label: '9:16 · SOCIAL FILM'
    }],
    description: 'Una pieza construida alrededor de un ritual cotidiano. El producto aparece dentro de la historia, con humor, tensión y una edición diseñada para sostener la atención hasta el último segundo.',
    facts: [
      ['9:16', 'FORMATO NATIVO'],
      ['01', 'HISTORIA CENTRAL'],
      ['FULL', 'PRODUCCIÓN + POST']
    ],
    deliverables: 'Concepto creativo · Guion · Dirección de contenido · Producción · Edición social'
  },
  dagna: {
    index: 'CASO 02 / 05',
    kicker: 'INFLUENCER MKT · VIAJES',
    title: 'DAGNA KILLS',
    ghost: 'DAGNA',
    media: [{
      video: 'assets/projects/dagna-kills.mp4',
      poster: 'assets/projects/dagna-kills.jpg',
      label: '9:16 · TRAVEL DIARY'
    }],
    description: 'Una serie de travel diaries que mezcla recomendación, moda y observación cultural. La cámara acompaña una voz auténtica y convierte cada locación en un capítulo reconocible.',
    facts: [
      ['DIARY', 'LENGUAJE EDITORIAL'],
      ['UGC+', 'CÓDIGO DE CONTENIDO'],
      ['SERIE', 'PENSADO PARA ESCALAR']
    ],
    deliverables: 'Idea de serie · Storytelling · Curaduría de escenas · Influencer marketing · Edición'
  },
  hostel: {
    index: 'CASO 03 / 05',
    kicker: 'CONTENIDO SOCIAL · HOSPITALIDAD',
    title: 'HOSTEL POINT',
    ghost: 'POINT',
    media: [{
      video: 'assets/projects/hostel-point.mp4',
      poster: 'assets/projects/hostel-point.jpg',
      label: '9:16 · SOCIAL SERIES'
    }],
    description: 'Personajes, humor y situaciones reales para mostrar la experiencia del hostel desde adentro. Una campaña vertical que transforma hospitalidad en cultura compartible.',
    facts: [
      ['CAST', 'PERSONAJES REALES'],
      ['SERIE', 'NARRATIVA SOCIAL'],
      ['9:16', 'VIDEO MOBILE FIRST']
    ],
    deliverables: 'Concepto · Guion de situaciones · Producción · Dirección de talentos · Postproducción'
  },
  gs: {
    index: 'CASO 04 / 05',
    kicker: 'CONTENIDO SERIAL · REFRIGERACIÓN',
    title: 'GS REFRIGERACIÓN',
    ghost: 'G·S',
    media: [
      { video: 'assets/projects/gs-refrigeracion-1.mp4', poster: 'assets/projects/gs-refrigeracion-1.jpg', label: 'PIEZA 01 · CONVERSACIÓN TÉCNICA' },
      { video: 'assets/projects/gs-refrigeracion-2.mp4', poster: 'assets/projects/gs-refrigeracion-2.jpg', label: 'PIEZA 02 · CULTURA DE OFICIO' },
      { video: 'assets/projects/gs-refrigeracion-3.mp4', poster: 'assets/projects/gs-refrigeracion-3.jpg', label: 'PIEZA 03 · TUTORIAL EN CAMPO' },
      { video: 'assets/projects/gs-refrigeracion-4.mp4', poster: 'assets/projects/gs-refrigeracion-4.jpg', label: 'PIEZA 04 · HISTORIA DE MARCA' }
    ],
    description: 'Una serie que saca el conocimiento técnico del taller y lo convierte en contenido cercano. Conversaciones, situaciones reales y demostraciones construyen una voz experta sin perder espontaneidad.',
    facts: [
      ['04', 'PIEZAS CONECTADAS'],
      ['9:16', 'FORMATO VERTICAL'],
      ['SERIE', 'SISTEMA ESCALABLE']
    ],
    deliverables: 'Concepto de serie · Guion de contenidos · Producción en locación · Dirección · Edición social'
  },
  refrimarket: {
    index: 'CASO 05 / 05',
    kicker: 'PRODUCT CONTENT · EDUCACIÓN TÉCNICA',
    title: 'REFRIMARKET / SMR32',
    ghost: 'R32',
    media: [{
      video: 'assets/projects/refrimarket-smr32.mp4',
      poster: 'assets/projects/refrimarket-smr32.jpg',
      label: '9:16 · PRODUCT STORY'
    }],
    description: 'Información técnica urgente contada con códigos de entretenimiento. Una pieza que toma un tema complejo, instala tensión desde el primer segundo y lo vuelve claro, relevante y compartible.',
    facts: [
      ['R32', 'TEMA CENTRAL'],
      ['ALERTA', 'GANCHO NARRATIVO'],
      ['9:16', 'MOBILE FIRST']
    ],
    deliverables: 'Concepto · Investigación temática · Guion · Producción · Edición y adaptación social'
  }
};

const projectModal = document.querySelector('#project-modal');
const projectModalShell = projectModal?.querySelector('.project-modal-shell');
const projectModalMedia = projectModal?.querySelector('.project-modal-media');
const projectModalVideo = document.querySelector('#project-modal-video');
const projectModalClose = projectModal?.querySelector('.project-modal-close');
const projectModalGallery = document.querySelector('#project-modal-gallery');
const projectGalleryCurrent = document.querySelector('#project-gallery-current');
const projectGalleryTotal = document.querySelector('#project-gallery-total');
const projectGalleryDots = document.querySelector('#project-gallery-dots');
const projectPieceLabel = document.querySelector('#project-modal-piece-label');
const projectModalTitle = document.querySelector('#project-modal-title');
let lastProjectTrigger = null;
let activeProject = null;
let activeMediaIndex = 0;
let mediaSwitchTimer = null;

const renderProjectMedia = (nextIndex, animate = true) => {
  if (!activeProject?.media?.length) return;
  const total = activeProject.media.length;
  activeMediaIndex = (nextIndex + total) % total;
  const item = activeProject.media[activeMediaIndex];

  const updateMedia = () => {
    projectModalVideo.poster = item.poster;
    projectModalVideo.src = item.video;
    projectModalVideo.load();
    projectPieceLabel.textContent = item.label;
    projectGalleryCurrent.textContent = String(activeMediaIndex + 1).padStart(2, '0');
    projectGalleryDots.querySelectorAll('.project-gallery-dot').forEach((dot, index) => {
      const isActive = index === activeMediaIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-pressed', String(isActive));
    });
    projectModalMedia.classList.remove('is-switching');
  };

  window.clearTimeout(mediaSwitchTimer);
  projectModalVideo.pause();
  if (animate && !reducedMotion) {
    projectModalMedia.classList.add('is-switching');
    mediaSwitchTimer = window.setTimeout(updateMedia, 180);
  } else {
    updateMedia();
  }
};

const prepareProjectGallery = (project) => {
  const total = project.media.length;
  projectModalGallery.hidden = total < 2;
  projectGalleryTotal.textContent = `/${String(total).padStart(2, '0')}`;
  projectGalleryDots.innerHTML = project.media.map((_, index) => `
    <button class="project-gallery-dot${index === 0 ? ' is-active' : ''}" type="button" data-media-index="${index}" aria-label="Ver video ${index + 1} de ${total}" aria-pressed="${index === 0}"></button>
  `).join('');
};

const closeProjectModal = () => {
  if (!projectModal?.open || projectModal.classList.contains('is-closing')) return;
  projectModal.classList.add('is-closing');
  projectModalVideo?.pause();
  window.clearTimeout(mediaSwitchTimer);

  window.setTimeout(() => {
    projectModal.close();
    projectModal.classList.remove('is-closing');
    document.body.classList.remove('modal-open');
    projectModalVideo.removeAttribute('src');
    projectModalVideo.removeAttribute('poster');
    projectModalVideo.load();
    projectModalMedia.classList.remove('is-switching');
    activeProject = null;
    lastProjectTrigger?.focus({ preventScroll: true });
  }, reducedMotion ? 0 : 460);
};

document.querySelectorAll('.project-modal-trigger').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    const project = projectCases[trigger.dataset.project];
    if (!project || !projectModal) return;
    lastProjectTrigger = trigger;
    activeProject = project;
    activeMediaIndex = 0;

    const revealX = event.detail === 0 ? window.innerWidth / 2 : event.clientX;
    const revealY = event.detail === 0 ? window.innerHeight / 2 : event.clientY;
    projectModalShell.style.setProperty('--modal-x', `${revealX}px`);
    projectModalShell.style.setProperty('--modal-y', `${revealY}px`);
    document.querySelector('#project-modal-index').textContent = project.index;
    document.querySelector('#project-modal-kicker').textContent = project.kicker;
    projectModalTitle.textContent = project.title;
    projectModalTitle.classList.toggle('is-long', project.title.length > 15);
    document.querySelector('#project-modal-description').textContent = project.description;
    document.querySelector('#project-modal-deliverables').textContent = project.deliverables;
    document.querySelector('#project-modal-ghost').textContent = project.ghost;
    document.querySelector('#project-modal-facts').innerHTML = project.facts.map(([value, label]) => `
      <div class="project-modal-fact"><strong>${value}</strong><span>${label}</span></div>
    `).join('');
    prepareProjectGallery(project);
    renderProjectMedia(0, false);
    document.body.classList.add('modal-open');
    projectModal.showModal();
    projectModalClose.focus({ preventScroll: true });
  });
});

projectModalClose?.addEventListener('click', closeProjectModal);
projectModalGallery?.addEventListener('click', (event) => {
  const dot = event.target.closest('.project-gallery-dot');
  if (dot) renderProjectMedia(Number(dot.dataset.mediaIndex));
});
projectModal?.querySelector('.project-gallery-prev')?.addEventListener('click', () => renderProjectMedia(activeMediaIndex - 1));
projectModal?.querySelector('.project-gallery-next')?.addEventListener('click', () => renderProjectMedia(activeMediaIndex + 1));
projectModal?.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeProjectModal();
});
projectModal?.addEventListener('keydown', (event) => {
  if (activeProject?.media.length < 2 || event.target === projectModalVideo) return;
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    renderProjectMedia(activeMediaIndex - 1);
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    renderProjectMedia(activeMediaIndex + 1);
  }
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
