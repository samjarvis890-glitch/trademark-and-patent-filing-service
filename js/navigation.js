/**
 * IPFORGE — Navigation & Header Controller
 * Handles sticky navbar, mobile drawer, active states, and keyboard/outside clicks.
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const utilityButtons = document.querySelectorAll('.utility-btn');
  const utilityDropdowns = document.querySelectorAll('.utility-dropdown');

  // Sticky header scroll behavior
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  const toggleMobileMenu = (open) => {
    const isOpen = typeof open === 'boolean' ? open : !mobileDrawer.classList.contains('open');
    if (isOpen) {
      mobileDrawer.classList.add('open');
      menuToggle.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
      document.documentElement.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawer.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
      document.body.style.overflow = '';
    }
  };

  // Prevent background touch scrolling when mobile drawer is open
  document.addEventListener('touchmove', (e) => {
    if (mobileDrawer && mobileDrawer.classList.contains('open')) {
      if (!mobileDrawer.contains(e.target)) {
        e.preventDefault();
      }
    }
  }, { passive: false });

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => toggleMobileMenu());
  }

  // Close mobile drawer on link click
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          toggleMobileMenu(false);
          const headerOffset = 90;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      } else {
        toggleMobileMenu(false);
      }
    });
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        toggleMobileMenu(false);
      }
      utilityDropdowns.forEach(dd => dd.classList.remove('show'));
    }
  });

  // Close mobile drawer on outside click
  document.addEventListener('click', (e) => {
    if (
      mobileDrawer &&
      mobileDrawer.classList.contains('open') &&
      !mobileDrawer.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      toggleMobileMenu(false);
    }

    // Close utility dropdowns when clicking outside
    let clickedInsideDropdown = false;
    utilityButtons.forEach(btn => {
      if (btn.contains(e.target)) clickedInsideDropdown = true;
    });
    utilityDropdowns.forEach(dd => {
      if (dd.contains(e.target)) clickedInsideDropdown = true;
    });
    if (!clickedInsideDropdown) {
      utilityDropdowns.forEach(dd => dd.classList.remove('show'));
    }

    // Close desktop nav dropdown when clicking outside
    const desktopDropdowns = document.querySelectorAll('.nav-item-dropdown');
    desktopDropdowns.forEach(dd => {
      if (!dd.contains(e.target)) {
        dd.classList.remove('open');
        const btn = dd.querySelector('.nav-dropdown-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Utility button dropdown toggle
  utilityButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('data-target');
      if (!targetId) return;
      e.stopPropagation();
      const dropdown = document.getElementById(targetId);
      if (dropdown) {
        const isShown = dropdown.classList.contains('show');
        utilityDropdowns.forEach(dd => dd.classList.remove('show'));
        if (!isShown) dropdown.classList.add('show');
      }
    });
  });

  // Desktop Navigation Dropdown Toggle (click & keyboard support)
  const navDropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
  navDropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = toggle.closest('.nav-item-dropdown');
      const isOpen = parent.classList.contains('open');
      document.querySelectorAll('.nav-item-dropdown').forEach(d => {
        d.classList.remove('open');
        const t = d.querySelector('.nav-dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        parent.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Mobile submenu toggle
  const mobileSubmenuToggles = document.querySelectorAll('.mobile-submenu-toggle');
  mobileSubmenuToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = btn.closest('.mobile-dropdown-item');
      const subnavList = parent ? parent.querySelector('.mobile-subnav-list') : null;
      if (subnavList) {
        const isOpen = subnavList.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    });
  });

  // Close mobile/tablet drawer if window is resized to desktop width (> 1280px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1280 && mobileDrawer && mobileDrawer.classList.contains('open')) {
      toggleMobileMenu(false);
    }
  });
});
