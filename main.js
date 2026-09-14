const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  const heroVideoStart = Number(heroVideo.dataset.start || 0);
  const seekToHeroStart = () => {
    if (Number.isFinite(heroVideo.duration) && heroVideo.duration > heroVideoStart) {
      heroVideo.currentTime = heroVideoStart;
    }
  };

  if (heroVideo.readyState >= 1) seekToHeroStart();
  else heroVideo.addEventListener('loadedmetadata', seekToHeroStart, { once: true });
  heroVideo.addEventListener('ended', () => {
    seekToHeroStart();
    heroVideo.play().catch(() => {});
  });
}

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
    const decimals = Number(entry.target.dataset.decimals || 0);
    const suffix = entry.target.dataset.suffix || '';
    const duration = reducedMotion ? 0 : 1200;
    const startTime = performance.now();

    const tick = (now) => {
      const progressValue = duration === 0 ? 1 : Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progressValue, 3);
      const value = decimals > 0
        ? (end * eased).toFixed(decimals).replace('.', ',')
        : Math.round(end * eased);
      entry.target.textContent = `${value}${suffix}`;
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
  gs: {
    index: 'CASO 01 / 04 · DESTACADO',
    kicker: 'CONTENIDO SERIAL · REFRIGERACIÓN',
    title: 'GS REFRIGERACIÓN',
    ghost: 'G·S',
    media: [
      { video: 'assets/projects/gs-refrigeracion-1.mp4', poster: 'assets/projects/gs-refrigeracion-1.jpg', label: 'PIEZA 01 · CONVERSACIÓN TÉCNICA' },
      { video: 'assets/projects/gs-refrigeracion-2.mp4', poster: 'assets/projects/gs-refrigeracion-2.jpg', label: 'PIEZA 02 · CULTURA DE OFICIO' },
      { video: 'assets/projects/gs-refrigeracion-3.mp4', poster: 'assets/projects/gs-refrigeracion-3.jpg', label: 'PIEZA 03 · TUTORIAL EN CAMPO' },
      { video: 'assets/projects/gs-refrigeracion-4.mp4', poster: 'assets/projects/gs-refrigeracion-4.jpg', label: 'PIEZA 04 · HISTORIA DE MARCA' }
    ],
    description: 'Cinco contenidos enfocados en generar atención, nutrición y conversión. El resultado: 50 personas en un curso presencial y un posicionamiento claro como experto del sector técnico.',
    facts: [
      ['05', 'CONTENIDOS'],
      ['50', 'PERSONAS EN EL CURSO'],
      ['EXPERTO', 'POSICIONAMIENTO']
    ],
    deliverables: 'Concepto de serie · Guion de contenidos · Producción en locación · Dirección · Edición social'
  },
  hostel: {
    index: 'CASO 02 / 04',
    kicker: 'CONTENIDO SOCIAL · HOSPITALIDAD',
    title: 'HOSTEL POINT',
    ghost: 'POINT',
    media: [{
      video: 'assets/projects/hostel-point.mp4',
      poster: 'assets/projects/hostel-point.jpg',
      label: '9:16 · SOCIAL SERIES'
    }],
    description: '250 leads nuevos en 7 días con un único video. Trabajamos sobre los puntos de dolor de la audiencia para que se sintiera representada y así aumentar la ocupación del 60% al 90%.',
    facts: [
      ['250', 'LEADS NUEVOS'],
      ['07', 'DÍAS'],
      ['60→90%', 'OCUPACIÓN']
    ],
    deliverables: 'Concepto · Guion de situaciones · Producción · Dirección de talentos · Postproducción'
  },
  refrimarket: {
    index: 'CASO 03 / 04',
    kicker: 'PRODUCT CONTENT · EDUCACIÓN TÉCNICA',
    title: 'REFRIMARKET EVENTO',
    ghost: 'R32',
    media: [{
      video: 'assets/projects/refrimarket-smr32.mp4',
      poster: 'assets/projects/refrimarket-smr32.jpg',
      label: '9:16 · PRODUCT STORY'
    }],
    description: 'Producción audiovisual enfocada en dolores técnicos para promocionar un evento y generar inscriptos. Más de 900 registros y 600 asistentes presenciales: atención, conversión y posicionamiento en un contenido pensado con intención.',
    facts: [
      ['+900', 'INSCRIPTOS'],
      ['+600', 'ASISTENTES'],
      ['01', 'CONTENIDO CLAVE']
    ],
    deliverables: 'Concepto · Investigación temática · Guion · Producción · Edición y adaptación social'
  },
  dagna: {
    index: 'CASO 04 / 04',
    kicker: 'INFLUENCER MKT · VIAJES',
    title: 'DAGNA KILLS',
    ghost: 'DAGNA',
    media: [{
      video: 'assets/projects/dagna-kills.mp4',
      poster: 'assets/projects/dagna-kills.jpg',
      label: '9:16 · TRAVEL DIARY'
    }],
    description: 'Una serie de travel diaries para un talento de YELO Management en Madrid, enfocada en generar conexión con la audiencia de la influencer desde una voz propia y reconocible.',
    facts: [
      ['MADRID', 'LOCACIÓN'],
      ['YELO', 'MANAGEMENT'],
      ['SERIE', 'TRAVEL DIARIES']
    ],
    deliverables: 'Idea de serie · Storytelling · Curaduría de escenas · Influencer marketing · Edición'
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

const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('#contact-status');
const contactSubmit = contactForm?.querySelector('button[type="submit"]');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const setContactStatus = (message, type = '') => {
  contactStatus.textContent = message;
  contactStatus.classList.toggle('is-error', type === 'error');
  contactStatus.classList.toggle('is-success', type === 'success');
};

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const goals = formData.getAll('goals').map((goal) => String(goal).trim()).filter(Boolean);

  if (!contactForm.checkValidity()) {
    setContactStatus('Completá los campos obligatorios para poder enviarlo.', 'error');
    contactForm.reportValidity();
    return;
  }
  if (!emailPattern.test(email)) {
    setContactStatus('Revisá el correo: parece estar incompleto.', 'error');
    contactForm.querySelector('[name="email"]').focus();
    return;
  }
  if (!message) {
    setContactStatus('Contanos brevemente qué necesitan resolver.', 'error');
    contactForm.querySelector('[name="message"]').focus();
    return;
  }
  if (goals.length === 0) {
    setContactStatus('Elegí al menos un objetivo para trabajar con MM.', 'error');
    contactForm.querySelector('[name="goals"]').focus();
    return;
  }

  const details = [
    `WhatsApp: ${String(formData.get('whatsapp') || '').trim()}`,
    `Empresa / marca: ${String(formData.get('brand') || '').trim()}`,
    `Actividad: ${String(formData.get('activity') || '').trim()}`,
    `Redes: ${String(formData.get('social') || '').trim()}`,
    `Contenido actual: ${String(formData.get('manager') || '').trim()}`,
    `Objetivos: ${goals.join(', ')}`,
    `Inicio: ${String(formData.get('start') || '').trim()}`,
    `Presupuesto: ${String(formData.get('budget') || '').trim()}`,
    `Origen: ${String(formData.get('referral') || '').trim()}`,
    '',
    `Necesidad: ${message}`
  ].join('\n');

  contactSubmit.disabled = true;
  contactSubmit.querySelector('span').textContent = 'Enviando…';
  setContactStatus('Enviando la consulta…');

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        message: details,
        company: ''
      })
    });

    let result;
    try {
      result = await response.json();
    } catch {
      throw new Error('Respuesta inválida');
    }

    if (!response.ok || result?.success !== true) throw new Error('No se pudo enviar');
    contactForm.reset();
    setContactStatus('¡Gracias! Recibimos la información y te escribimos pronto.', 'success');
  } catch {
    setContactStatus('No pudimos enviar la consulta. Probá nuevamente en unos minutos.', 'error');
  } finally {
    contactSubmit.disabled = false;
    contactSubmit.querySelector('span').textContent = 'Enviar consulta';
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();
