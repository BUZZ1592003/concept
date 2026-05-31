const heroSlides = [...document.querySelectorAll('.hero-slide')];
const revealEls = [...document.querySelectorAll('.reveal')];
const counters = [...document.querySelectorAll('[data-counter]')];
const filters = [...document.querySelectorAll('.filter')];
const projects = [...document.querySelectorAll('.project-card')];
const testimonials = [...document.querySelectorAll('.testimonial')];
const modal = document.querySelector('.modal');
const modalCard = document.querySelector('.modal-card');
const modalImage = modalCard.querySelector('img');
const modalTitle = modalCard.querySelector('#modalTitle');
const modalText = modalCard.querySelector('p');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const pageTransition = document.querySelector('.page-transition');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const parallaxLayer = document.querySelector('[data-parallax]');

let heroIndex = 0;
let testimonialIndex = 0;

const heroTimer = () => {
  heroSlides.forEach((slide, index) => slide.classList.toggle('active', index === heroIndex));
  heroIndex = (heroIndex + 1) % heroSlides.length;
};

const animateCounter = (el) => {
  const target = Number(el.dataset.counter || 0);
  const duration = 1400;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target).toString();
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      if (entry.target.hasAttribute('data-counter')) {
        animateCounter(entry.target);
      }
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.2 },
);

revealEls.forEach((el) => observer.observe(el));
counters.forEach((el) => observer.observe(el));

filters.forEach((button) => {
  button.addEventListener('click', () => {
    filters.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    projects.forEach((project) => {
      const matches = filter === 'all' || project.classList.contains(filter);
      project.style.display = matches ? 'block' : 'none';
    });
  });
});

projects.forEach((project) => {
  project.addEventListener('click', () => {
    modalImage.src = project.dataset.image || project.querySelector('img').src;
    modalImage.alt = project.dataset.title || 'Project preview';
    modalTitle.textContent = project.dataset.title || 'Project details';
    modalText.textContent = project.dataset.project || '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });

  project.addEventListener('dblclick', () => {
    lightboxImage.src = project.dataset.image || project.querySelector('img').src;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

const closeModal = () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
};

document.querySelectorAll('.modal-close').forEach((button) => button.addEventListener('click', closeModal));
[modal, lightbox].forEach((overlay) => {
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeModal();
  });
});

testimonials.forEach((testimonial, index) => {
  if (index === 0) testimonial.classList.add('active');
});

setInterval(() => {
  testimonials[testimonialIndex].classList.remove('active');
  testimonialIndex = (testimonialIndex + 1) % testimonials.length;
  testimonials[testimonialIndex].classList.add('active');
}, 5000);

navToggle?.addEventListener('click', () => {
  const isOpen = nav.dataset.open === 'true';
  nav.dataset.open = String(!isOpen);
  nav.style.display = isOpen ? 'none' : 'flex';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
});

window.addEventListener('scroll', () => {
  const offset = Math.min(window.scrollY * 0.14, 48);
  if (parallaxLayer) parallaxLayer.style.transform = `translateY(${offset}px)`;
});

window.addEventListener('load', () => {
  pageTransition.classList.add('entering');
  setTimeout(() => pageTransition.classList.remove('entering'), 500);
  heroTimer();
  setInterval(heroTimer, 5200);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const forms = document.querySelectorAll('form');
forms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const whatsapp = 'https://wa.me/911234567890?text=' + encodeURIComponent('Hi, I would like a free consultation for my interior design project.');
    window.open(whatsapp, '_blank', 'noreferrer');
  });
});
