import { scrollTo } from './scroll.js';

export function initNavigation() {
  const nav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link, .nav-overlay-link');
  const navToggle = document.getElementById('nav-toggle');
  const navOverlay = document.getElementById('nav-overlay');

  // Wire all anchor clicks to scrollTo
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      
      // Close mobile nav if open
      if (navOverlay && navOverlay.classList.contains('open')) {
        navOverlay.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }

      scrollTo(target);
    });
  });

  // ScrollTrigger instances for each section to add/remove active class
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(section => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onToggle: self => {
          if (self.isActive) {
            const id = section.getAttribute('id');
            document.querySelectorAll('.nav-link, .nav-overlay-link').forEach(link => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              }
            });
          }
        }
      });
    }
  });

  // Hamburger nav toggle
  if (navToggle && navOverlay) {
    navToggle.addEventListener('click', () => {
      const isOpen = navOverlay.classList.contains('open');
      if (isOpen) {
        navOverlay.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      } else {
        navOverlay.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
      }
    });
  }
}

export function animateCounter(el, target, duration) {
  if (typeof gsap !== 'undefined') {
    gsap.to({ val: 0 }, {
      val: target,
      duration,
      ease: 'power2.out',
      onUpdate: function() {
        el.textContent = Math.round(this.targets()[0].val);
      }
    });
  } else {
    el.textContent = target;
  }
}

export function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: '#about',
      start: 'top center',
      once: true,
      onEnter: () => {
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target') || '0');
          animateCounter(counter, target, 2);
        });
      }
    });
  }
}

export function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const btnClose = lightbox.querySelector('.lightbox-close');
  const btnPrev = lightbox.querySelector('.lightbox-prev');
  const btnNext = lightbox.querySelector('.lightbox-next');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const item = galleryItems[currentIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-title').textContent;
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = title;
    
    lightbox.style.display = 'flex';
    lightbox.setAttribute('aria-hidden', 'false');
    
    // Focus management inside lightbox
    if (btnClose) btnClose.focus();
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    lightbox.setAttribute('aria-hidden', 'true');
    // Return focus
    if (galleryItems[currentIndex]) {
      galleryItems[currentIndex].focus();
    }
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentIndex);
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  if (btnClose) btnClose.addEventListener('click', closeLightbox);
  if (btnNext) btnNext.addEventListener('click', showNext);
  if (btnPrev) btnPrev.addEventListener('click', showPrev);

  lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNext();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    }
  });
}

export function validateRequired(value) {
  if (!value || value.trim() === '') {
    return { valid: false, error: 'This field is required' };
  }
  return { valid: true, error: '' };
}

export function validatePhone(value) {
  const phoneRegex = /^[+\d\s\-()]{7,15}$/;
  if (!phoneRegex.test(value)) {
    return { valid: false, error: 'Please enter a valid phone number' };
  }
  return { valid: true, error: '' };
}

export function validateEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  return { valid: true, error: '' };
}

export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const formFields = document.getElementById('form-fields');
  const formSuccess = document.getElementById('form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isFormValid = true;

    // Reset previous errors
    const errorMsgs = form.querySelectorAll('.form-error-msg');
    errorMsgs.forEach(msg => {
      msg.textContent = '';
      const input = document.getElementById(`field-${msg.id.split('-')[1]}`);
      if (input) input.style.borderColor = '';
    });

    // Validate Required Name
    const nameInput = document.getElementById('field-name');
    const nameVal = validateRequired(nameInput.value);
    if (!nameVal.valid) {
      isFormValid = false;
      document.getElementById('error-name').textContent = nameVal.error;
      nameInput.style.borderColor = 'red';
    }

    // Validate Phone
    const phoneInput = document.getElementById('field-phone');
    const phoneVal = validatePhone(phoneInput.value);
    if (!phoneVal.valid) {
      isFormValid = false;
      document.getElementById('error-phone').textContent = phoneVal.error;
      phoneInput.style.borderColor = 'red';
    }

    // Validate Email
    const emailInput = document.getElementById('field-email');
    const emailVal = validateEmail(emailInput.value);
    if (!emailVal.valid) {
      isFormValid = false;
      document.getElementById('error-email').textContent = emailVal.error;
      emailInput.style.borderColor = 'red';
    }

    // Validate Service Dropdown
    const serviceInput = document.getElementById('field-service');
    const serviceVal = validateRequired(serviceInput.value);
    if (!serviceVal.valid) {
      isFormValid = false;
      document.getElementById('error-service').textContent = serviceVal.error;
      serviceInput.style.borderColor = 'red';
    }

    if (isFormValid) {
      formFields.style.display = 'none';
      formSuccess.hidden = false;
      formSuccess.style.display = 'block';
    }
  });
}

export function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-theme', initialTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(themeToggle, { scale: 0.8 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
    }
  });
}

export function initWhatsAppWidget() {
  const toggle = document.getElementById('whatsapp-toggle');
  const menu = document.getElementById('whatsapp-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
    
    if (typeof gsap !== 'undefined' && menu.classList.contains('open')) {
      gsap.from('.whatsapp-option', {
        x: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
    }
  });
}

export function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    // If ScrollSmoother is active, use its scrollTo
    const { getSmoother } = import('./scroll.js').then(m => {
      const smoother = m.getSmoother();
      if (smoother) {
        smoother.scrollTo(0, true);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}
