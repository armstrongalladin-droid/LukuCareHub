/**
 * Luku Care Hub — Main JavaScript
 * WhatsApp, Facebook, booking form, navigation
 */

(function () {
  'use strict';

  const cfg = typeof LUKU_CONFIG !== 'undefined' ? LUKU_CONFIG : {};

  /* ——— WhatsApp helpers ——— */
  function buildWhatsAppUrl(message) {
    const num = (cfg.whatsappNumber || '').replace(/\D/g, '');
    const text = encodeURIComponent(message || 'Hello! I would like to book at Luku Care Hub.');
    return `https://wa.me/${num}?text=${text}`;
  }

  function openWhatsApp(message) {
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  }

  function fillTemplate(template, data) {
    let out = template || '';
    Object.keys(data).forEach((key) => {
      out = out.replace(new RegExp(`\\{${key}\\}`, 'g'), data[key] || '—');
    });
    return out;
  }

  window.LukuWhatsApp = {
    open: openWhatsApp,
    bookService: function (serviceName) {
      const msg =
        `Hello ${cfg.businessName || 'Luku Care'}! 👋\n\n` +
        `I'd like to book: *${serviceName}*\n\n` +
        `Please let me know available slots. Thank you!`;
      openWhatsApp(msg);
    },
    generalBooking: function () {
      openWhatsApp(
        `Hello ${cfg.businessName || 'Luku Care'}! I'd like to book an appointment. Please share your available times.`
      );
    },
  };

  /* ——— Facebook helpers ——— */
  window.LukuFacebook = {
    openMessenger: function () {
      const page = cfg.facebookPage || 'lukucarehub';
      window.open(`https://m.me/${page}`, '_blank', 'noopener,noreferrer');
    },
    openPage: function () {
      window.open(cfg.facebookPageUrl || 'https://www.facebook.com/', '_blank', 'noopener,noreferrer');
    },
  };

  /* ——— Sticky navigation ——— */
  function initNav() {
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');

    if (nav) {
      const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    if (toggle && links) {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        links.classList.toggle('open');
        document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
      });

      links.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
          toggle.classList.remove('open');
          links.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    let current = window.location.pathname.split('/').pop() || 'index.html';
    if (current === '' || current === '/') current = 'index.html';
    document.querySelectorAll('.nav-links a').forEach((a) => {
      const href = a.getAttribute('href');
      if (href === current || (current === 'index.html' && (href === 'index.html' || href === '/' || href === './'))) {
        a.classList.add('active');
      }
    });
  }

  /* ——— Booking form ——— */
  function initBookingForm() {
    const form = document.getElementById('booking-form');
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const serviceSelect = form.querySelector('[name="service"]');
    if (serviceSelect && params.get('service')) {
      const val = params.get('service');
      for (const opt of serviceSelect.options) {
        if (opt.value === val || opt.textContent.includes(val)) {
          opt.selected = true;
          break;
        }
      }
    }

    const dateInput = form.querySelector('[name="date"]');
    if (dateInput) {
      dateInput.min = new Date().toISOString().split('T')[0];
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());

      const message = fillTemplate(
        cfg.bookingMessageTemplate ||
          'Booking request from website.\nService: {service}\nDate: {date}\nTime: {time}\nName: {name}\nPhone: {phone}',
        {
          service: data.service || '—',
          date: data.date || '—',
          time: data.time || '—',
          name: data.name || '—',
          phone: data.phone || '—',
        }
      );

      form.dispatchEvent(
        new CustomEvent('luku:booking', {
          detail: { ...data, message },
          bubbles: true,
        })
      );

      if (form.dataset.submit === 'whatsapp') {
        openWhatsApp(message);
      } else {
        showToast('Opening WhatsApp to confirm your booking…');
        setTimeout(() => openWhatsApp(message), 600);
      }

      form.reset();
    });

    document.getElementById('booking-whatsapp-btn')?.addEventListener('click', () => {
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      const hasData = data.name || data.service;
      if (hasData) {
        const message = fillTemplate(cfg.bookingMessageTemplate, {
          service: data.service || '—',
          date: data.date || '—',
          time: data.time || '—',
          name: data.name || '—',
          phone: data.phone || '—',
        });
        openWhatsApp(message);
      } else {
        LukuWhatsApp.generalBooking();
      }
    });
  }

  /* ——— Service image path from id (images/services/{id}.jpg) ——— */
  function getServiceImageSrc(service) {
    if (service.image) return service.image;
    const slug = service.id || service.name.toLowerCase().replace(/['']/g, '').replace(/\s+/g, '-');
    return `images/services/${slug}.jpg`;
  }

  /* ——— Populate services from config ——— */
  function populateServices() {
    if (!cfg.services) return;

    document.querySelectorAll('[data-services-list]').forEach((container) => {
      const template = container.dataset.template || 'card';
      container.innerHTML = cfg.services
        .map((s) => {
          if (template === 'option') {
            return `<option value="${s.name}">${s.name}</option>`;
          }
          const imgSrc = getServiceImageSrc(s);
          const imgAlt = `Professional ${s.name} service at Luku Care Hub`;
          return `
          <article class="service-card" data-service-id="${s.id}">
            <div class="service-image">
              <img src="${imgSrc}" alt="${imgAlt}" loading="lazy">
            </div>
            <h3>${s.name}</h3>
            <p class="text-muted">${s.duration}</p>
            <div class="card-actions">
              <button type="button" class="btn btn-whatsapp btn-sm" data-whatsapp-service="${s.name}">
                Book via WhatsApp
              </button>
              <a href="booking.html?service=${encodeURIComponent(s.name)}" class="btn btn-outline btn-sm">Book Online</a>
            </div>
          </article>`;
        })
        .join('');
    });

    document.querySelectorAll('[data-service-select]').forEach((select) => {
      cfg.services.forEach((s) => {
        const opt = document.createElement('option');
        opt.value = s.name;
        opt.textContent = s.name;
        select.appendChild(opt);
      });
    });
  }

  /* ——— WhatsApp & Facebook click delegation ——— */
  function initClickHandlers() {
    document.addEventListener('click', (e) => {
      const wa = e.target.closest('[data-whatsapp]');
      if (wa) {
        e.preventDefault();
        const msg = wa.dataset.whatsappMessage;
        if (wa.dataset.whatsappService) {
          LukuWhatsApp.bookService(wa.dataset.whatsappService);
        } else if (msg) {
          openWhatsApp(msg);
        } else {
          LukuWhatsApp.generalBooking();
        }
      }

      const waService = e.target.closest('[data-whatsapp-service]');
      if (waService) {
        e.preventDefault();
        LukuWhatsApp.bookService(waService.dataset.whatsappService);
      }

      const fb = e.target.closest('[data-facebook-messenger]');
      if (fb) {
        e.preventDefault();
        LukuFacebook.openMessenger();
      }

      const fbPage = e.target.closest('[data-facebook-page]');
      if (fbPage) {
        e.preventDefault();
        LukuFacebook.openPage();
      }
    });

    document.getElementById('whatsapp-float')?.addEventListener('click', (e) => {
      e.preventDefault();
      LukuWhatsApp.generalBooking();
    });
  }

  /* ——— Gallery lightbox ——— */
  function initGallery() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const img = lightbox.querySelector('img');
    document.querySelectorAll('.gallery-item').forEach((item) => {
      item.addEventListener('click', () => {
        const src = item.querySelector('img')?.src;
        if (src && img) {
          img.src = src;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    lightbox.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ——— Toast ——— */
  function showToast(text) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  /* ——— Footer year ——— */
  function initFooter() {
    document.querySelectorAll('[data-year]').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ——— Facebook Messenger Customer Chat Plugin ——— */
  function initMessengerPlugin() {
    const pageId = cfg.facebookPageId;
    if (!pageId || pageId === '000000000000000') return;

    window.fbAsyncInit = function () {
      FB.init({ xfbml: true, version: 'v18.0' });
    };

    if (!document.getElementById('facebook-jssdk')) {
      const js = document.createElement('script');
      js.id = 'facebook-jssdk';
      js.async = true;
      js.defer = true;
      js.crossOrigin = 'anonymous';
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      document.body.appendChild(js);
    }

    const chatRoot = document.getElementById('fb-root');
    if (chatRoot && !chatRoot.querySelector('.fb-customerchat')) {
      const div = document.createElement('div');
      div.className = 'fb-customerchat';
      div.setAttribute('attribution', 'setup_tool');
      div.setAttribute('page_id', pageId);
      div.setAttribute('theme_color', '#D4AF37');
      div.setAttribute('logged_in_greeting', 'Hi! Ready to book your next cut at Luku Care?');
      div.setAttribute('logged_out_greeting', 'Hi! Message us to book your appointment.');
      chatRoot.appendChild(div);
    }
  }

  /* ——— Init ——— */
  function init() {
    initNav();
    initBookingForm();
    populateServices();
    initClickHandlers();
    initGallery();
    initFooter();
    initMessengerPlugin();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
