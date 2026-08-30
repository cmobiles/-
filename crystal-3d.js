/**
 * CHARAN MOBILES — Crystal 3D Tilt & Micro-Interaction Engine
 * Lightweight perspective tilt and prism lighting reflections for product and service cards.
 */

class Crystal3D {
  constructor() {
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.init();
  }

  init() {
    if (this.isTouchDevice || this.prefersReducedMotion) return;

    document.addEventListener('mousemove', (e) => {
      // Find cards under cursor or update password beam
      const beamWraps = document.querySelectorAll('.password-beam-wrap');
      beamWraps.forEach(wrap => {
        const rect = wrap.getBoundingClientRect();
        if (
          e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom
        ) {
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          wrap.style.setProperty('--beam-x', `${x}%`);
          wrap.style.setProperty('--beam-y', `${y}%`);
        }
      });
    });

    this.attachTiltListeners();
  }

  attachTiltListeners() {
    if (this.isTouchDevice || this.prefersReducedMotion) return;

    const cards = document.querySelectorAll('.crystal-card, .extra-service-card');
    cards.forEach(card => {
      if (card.dataset.tiltAttached) return;
      card.dataset.tiltAttached = 'true';

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cardX = e.clientX - rect.left;
        const cardY = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((cardY - centerY) / centerY) * -6; // Max 6 deg
        const rotateY = ((cardX - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.charanCrystal3D = new Crystal3D();
});
