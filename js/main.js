/**
 * IPFORGE — Main Application Logic
 * Consultation modal handling, accessibility contrast switch, and interactive controls.
 */

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('consultationModal');
  const modalCloseBtn = document.querySelector('.modal-close-btn');
  const openModalBtns = document.querySelectorAll('[data-open-modal="consultation"]');
  const consultForm = document.getElementById('consultationForm');
  const formFeedback = document.querySelector('.form-feedback');
  const serviceSelect = document.getElementById('modalServiceType');

  // Open consultation modal
  const openModal = (preselectedService = '') => {
    if (!modal) return;
    if (preselectedService && serviceSelect) {
      serviceSelect.value = preselectedService;
    }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input, select');
    if (firstInput) firstInput.focus();
  };

  // Close consultation modal
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Handle Consultation CTAs: Redirect directly to contact.html#contact-form-section (NO popup)
  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if (href && (href === '#contact-form-section' || href.endsWith('contact.html#contact-form-section'))) {
        return; // Allow native link navigation
      }
      e.preventDefault();
      const isContactPage = window.location.pathname.endsWith('contact.html') || window.location.href.includes('/contact.html');
      if (isContactPage) {
        const formSec = document.getElementById('contact-form-section');
        if (formSec) {
          formSec.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      const serviceParam = btn.getAttribute('data-service') || '';
      const targetUrl = serviceParam ? `contact.html?service=${encodeURIComponent(serviceParam)}#contact-form-section` : 'contact.html#contact-form-section';
      window.location.href = targetUrl;
    });
  });

  // Smooth scroll to form section if navigated with hash #contact-form-section
  if (window.location.hash === '#contact-form-section') {
    const targetSection = document.getElementById('contact-form-section');
    if (targetSection) {
      setTimeout(() => {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    }
  }

  // Pre-select service in contact form if query parameter exists
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam) {
      const contactSelect = document.getElementById('contactService');
      if (contactSelect) {
        for (let i = 0; i < contactSelect.options.length; i++) {
          if (contactSelect.options[i].value.toLowerCase().includes(serviceParam.toLowerCase()) ||
              contactSelect.options[i].text.toLowerCase().includes(serviceParam.toLowerCase())) {
            contactSelect.selectedIndex = i;
            break;
          }
        }
      }
    }
  } catch (err) {}

  // Handle click on entire Service Card or Scenario Panel to navigate to contact form
  document.querySelectorAll('.service-card, .scenario-panel').forEach(card => {
    card.addEventListener('click', (e) => {
      const link = card.querySelector('.link-cta, a');
      if (!link) return;
      if (e.target === link || link.contains(e.target)) return;
      link.click();
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Handle consultation form submission
  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = consultForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting Request...';
      }

      setTimeout(() => {
        if (formFeedback) {
          formFeedback.style.display = 'block';
          formFeedback.textContent = 'Your consultation request has been received. An IP advisor will contact you within one business day.';
        }
        consultForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Request Consultation';
        }
        setTimeout(() => {
          closeModal();
          if (formFeedback) formFeedback.style.display = 'none';
        }, 3000);
      }, 700);
    });
  }

  // Theme Toggle: Light / Dark Mode Controller
  const themeToggleBtns = document.querySelectorAll('#themeToggle, #accessibilityToggle, .theme-toggle-btn');

  const updateLogoImages = (isDark) => {
    const logoSrc = isDark ? 'assets/logo/logo-dark.svg' : 'assets/logo/logo.svg';
    document.querySelectorAll('.header-logo img, .footer-brand img, .footer-logo, img.footer-logo').forEach(img => {
      if (img.classList.contains('logo-light') || img.classList.contains('logo-dark')) return;
      img.src = logoSrc;
    });
  };

  const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
      document.body.classList.add('dark-theme');
      themeToggleBtns.forEach(btn => {
        btn.setAttribute('aria-label', 'Switch to light theme');
        btn.setAttribute('title', 'Switch to light theme');
      });
      document.querySelectorAll('.mobile-theme-label').forEach(el => {
        el.textContent = 'LIGHT MODE';
      });
      updateLogoImages(true);
    } else {
      document.documentElement.classList.remove('dark-theme');
      document.body.classList.remove('dark-theme');
      themeToggleBtns.forEach(btn => {
        btn.setAttribute('aria-label', 'Switch to dark theme');
        btn.setAttribute('title', 'Switch to dark theme');
      });
      document.querySelectorAll('.mobile-theme-label').forEach(el => {
        el.textContent = 'DARK MODE';
      });
      updateLogoImages(false);
    }
  };

  // Initialize saved theme
  const currentSavedTheme = localStorage.getItem('ipforge_theme');
  if (currentSavedTheme) {
    applyTheme(currentSavedTheme);
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isDark = document.body.classList.contains('dark-theme');
      const nextTheme = isDark ? 'light' : 'dark';
      applyTheme(nextTheme);
      try {
        localStorage.setItem('ipforge_theme', nextTheme);
      } catch (err) {}
    });
  });

  // Jurisdiction Switcher Control
  const jurisdictionOptions = document.querySelectorAll('.jurisdiction-option');
  const jurisdictionLabel = document.getElementById('currentJurisdictionLabel');

  jurisdictionOptions.forEach((opt) => {
    opt.addEventListener('click', () => {
      jurisdictionOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const region = opt.getAttribute('data-region');
      if (jurisdictionLabel) {
        jurisdictionLabel.textContent = region;
      }
      const dd = document.getElementById('jurisdictionDropdown');
      if (dd) dd.classList.remove('show');
    });
  });

  // Myth / Reality Accessible Accordion Controller
  const accordionItems = document.querySelectorAll('.myth-accordion-item');
  if (accordionItems.length > 0) {
    accordionItems.forEach((item) => {
      const btn = item.querySelector('.myth-header-btn');
      const content = item.querySelector('.myth-collapse');

      if (btn && content) {
        btn.addEventListener('click', () => {
          const isExpanded = btn.getAttribute('aria-expanded') === 'true';

          // Close all other items (only one open at a time)
          accordionItems.forEach((otherItem) => {
            if (otherItem !== item) {
              const otherBtn = otherItem.querySelector('.myth-header-btn');
              const otherContent = otherItem.querySelector('.myth-collapse');
              if (otherBtn && otherContent) {
                otherBtn.setAttribute('aria-expanded', 'false');
                otherItem.classList.remove('active');
                otherContent.style.maxHeight = null;
              }
            }
          });

          // Toggle current item
          if (!isExpanded) {
            btn.setAttribute('aria-expanded', 'true');
            item.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
          } else {
            btn.setAttribute('aria-expanded', 'false');
            item.classList.remove('active');
            content.style.maxHeight = null;
          }
        });

        // Keyboard accessibility: Enter & Space
        btn.addEventListener('keydown', (e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            btn.click();
          }
        });
      }
    });

  }

  // Process Page Stage Accordion Controller
  const processAccItems = document.querySelectorAll('.process-accordion-item');
  if (processAccItems.length > 0) {
    processAccItems.forEach((item) => {
      const btn = item.querySelector('.process-acc-trigger');
      const content = item.querySelector('.process-acc-collapse');

      if (btn && content) {
        btn.addEventListener('click', () => {
          const isExpanded = btn.getAttribute('aria-expanded') === 'true';

          // Close all other items
          processAccItems.forEach((otherItem) => {
            if (otherItem !== item) {
              const otherBtn = otherItem.querySelector('.process-acc-trigger');
              const otherContent = otherItem.querySelector('.process-acc-collapse');
              if (otherBtn && otherContent) {
                otherBtn.setAttribute('aria-expanded', 'false');
                otherItem.classList.remove('active');
                otherContent.style.maxHeight = null;
              }
            }
          });

          // Toggle current item
          if (!isExpanded) {
            btn.setAttribute('aria-expanded', 'true');
            item.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
          } else {
            btn.setAttribute('aria-expanded', 'false');
            item.classList.remove('active');
            content.style.maxHeight = null;
          }
        });

        btn.addEventListener('keydown', (e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            btn.click();
          }
        });
      }
    });

    // Automatically open first item by default
    const firstAccItem = processAccItems[0];
    if (firstAccItem) {
      const firstBtn = firstAccItem.querySelector('.process-acc-trigger');
      const firstContent = firstAccItem.querySelector('.process-acc-collapse');
      if (firstBtn && firstContent) {
        firstBtn.setAttribute('aria-expanded', 'true');
        firstAccItem.classList.add('active');
        firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
      }
    }
  }

  // Scenarios Page: Section 05 Diagnostic Selector
  const changeSelectorCards = document.querySelectorAll('.change-selector-card');
  if (changeSelectorCards.length > 0) {
    changeSelectorCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        changeSelectorCards.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-selected', 'false');
        });
        card.classList.add('active');
        card.setAttribute('aria-selected', 'true');
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          card.click();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextCard = changeSelectorCards[(index + 1) % changeSelectorCards.length];
          nextCard.focus();
          nextCard.click();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevCard = changeSelectorCards[(index - 1 + changeSelectorCards.length) % changeSelectorCards.length];
          prevCard.focus();
          prevCard.click();
        }
      });
    });
  }

  // Contact Page Form Logic
  const contactPageForm = document.getElementById('contactPageForm');
  if (contactPageForm) {
    const feedbackBanner = document.getElementById('contactFormFeedback');
    
    // Clear validation error on user input or change
    contactPageForm.querySelectorAll('input, select, textarea').forEach(input => {
      const clearError = () => {
        const group = input.closest('.appt-field-group') || input.closest('.contact-field-group');
        if (group) group.classList.remove('has-error');
      };
      input.addEventListener('input', clearError);
      input.addEventListener('change', clearError);
    });

    contactPageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      
      const requiredInputs = contactPageForm.querySelectorAll('[required]');
      requiredInputs.forEach(input => {
        const group = input.closest('.appt-field-group') || input.closest('.contact-field-group');
        if (!input.value || !input.value.trim()) {
          isValid = false;
          if (group) group.classList.add('has-error');
        } else if (input.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value.trim())) {
            isValid = false;
            if (group) group.classList.add('has-error');
          }
        }
      });

      if (!isValid) return;

      const submitBtn = contactPageForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'REQUEST APPOINTMENT';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'SUBMITTING REQUEST...';
      }

      setTimeout(() => {
        if (feedbackBanner) {
          feedbackBanner.style.display = 'block';
          feedbackBanner.textContent = 'YOUR APPOINTMENT REQUEST HAS BEEN RECEIVED. OUR IP ADVISORS WILL CONTACT YOU PROMPTLY TO CONFIRM.';
        }
        contactPageForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }, 500);
    });
  }

  // Contact Page Map Initialization (Leaflet + OpenStreetMap)
  const mapElement = document.getElementById('contactMap');
  if (mapElement && typeof L !== 'undefined') {
    try {
      const lat = 37.7909;
      const lng = -122.4016;
      const map = L.map('contactMap', {
        center: [lat, lng],
        zoom: 15,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
      }).addTo(map);

      const marker = L.marker([lat, lng]).addTo(map);
      marker.bindPopup('<strong>IPFORGE Intellectual Property Operations</strong><br>100 Montgomery St, Suite 1800<br>San Francisco, CA 94104').openPopup();
    } catch (err) {
      console.warn('Map initialization note:', err);
    }
  }

  // ========================================================================
  // LTR / RTL Direction Controller (Cross-page persistence, accessibility)
  // ========================================================================
  const DIRECTION_STORAGE_KEY = 'siteDirection';

  const getSavedDirection = () => {
    try {
      const saved = localStorage.getItem(DIRECTION_STORAGE_KEY);
      return saved === 'rtl' ? 'rtl' : 'ltr';
    } catch (e) {
      return 'ltr';
    }
  };

  const updateDirectionToggleState = (direction) => {
    const isRtl = direction === 'rtl';
    const directionToggleBtns = document.querySelectorAll('#directionToggle, .direction-toggle');
    directionToggleBtns.forEach((btn) => {
      btn.setAttribute('aria-pressed', isRtl ? 'true' : 'false');
      const label = isRtl ? 'Switch to left-to-right layout' : 'Switch to right-to-left layout';
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
    document.querySelectorAll('.mobile-dir-label').forEach(el => {
      el.textContent = isRtl ? 'LTR VIEW' : 'RTL VIEW';
    });
  };

  const setPageDirection = (direction) => {
    const normalized = direction === 'rtl' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', normalized);
    if (!document.documentElement.getAttribute('lang')) {
      document.documentElement.setAttribute('lang', 'en');
    }
    updateDirectionToggleState(normalized);
    try {
      localStorage.setItem(DIRECTION_STORAGE_KEY, normalized);
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('directionchange', { detail: { direction: normalized } }));
  };

  const toggleDirection = () => {
    const current = document.documentElement.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
    const next = current === 'rtl' ? 'ltr' : 'rtl';
    setPageDirection(next);
  };

  const initializeDirectionToggle = () => {
    const initialDir = getSavedDirection();
    setPageDirection(initialDir);

    const directionToggleBtns = document.querySelectorAll('#directionToggle, .direction-toggle');
    directionToggleBtns.forEach((btn) => {
      if (btn.dataset.dirInitialized) return;
      btn.dataset.dirInitialized = 'true';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleDirection();
      });
    });
  };

  initializeDirectionToggle();
});



