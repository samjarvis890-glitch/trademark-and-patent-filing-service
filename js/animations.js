/**
 * IPFORGE — Subtle Editorial Scroll Animations
 * Uses IntersectionObserver with prefers-reduced-motion guard.
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const revealElements = document.querySelectorAll(
    '.service-card, .numbered-item, .process-node, .precision-point, .scenario-panel, .hero-content, .hero-media, .consultation-box, .final-statement-card, .ip-value-headline, .ip-value-lead, .ip-value-aside, .split-panel, .matrix-row, .portfolio-feature-block, .portfolio-sub-block, .preparation-stage-card, .growth-statement-item, .myth-accordion-item, .consultation-panel-card, .editorial-huge-statement, .about-hero-left, .about-hero-media-wrapper, .origin-left, .origin-right, .manifesto-container, .approach-stage, .collab-content, .collab-media-frame, .audience-left, .audience-list-item, .clarity-composition, .value-band-row, .promise-container, .about-cta-container, .about-micro-container, .services-hero-header, .services-hero-banner-wrapper, .trademark-content-col, .trademark-media-frame, .patent-image-frame, .patent-overlay-panel, .services-search-header, .search-table-row, .search-vertical-media, .services-journey-header, .journey-col-card, .journey-image-banner-wrapper, .services-cta-content, .services-cta-media-wrapper, .process-hero-header, .process-hero-banner-wrapper, .process-clarity-block, .process-stage-node, .process-accordion-item, .filing-area-card, .process-filing-media, .role-group-col, .process-final-cta-card, .scenarios-hero-header, .scenarios-hero-banner-wrapper, .scenarios-hero-sub-statement-row, .brand-media-frame, .brand-editorial-panel, .technical-editorial-board, .technical-stage-item, .growth-media-banner, .growth-card, .change-media-frame, .change-selector-card, .scenario-choice-card, .scenarios-final-statement-banner, .contact-intro-main, .contact-typographic-index, .contact-instruction-col, .contact-form-card, .intake-vertical-indicator, .intake-items-list, .intake-media-wrapper, .channel-row, .contact-location-info, .contact-map-frame, .closing-checklist-item, .closing-statement-content'
  );

  revealElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 550ms cubic-bezier(0.16, 1, 0.3, 1), transform 550ms cubic-bezier(0.16, 1, 0.3, 1)';
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((el) => {
    observer.observe(el);
  });
});
