/**
 * CHARAN MOBILES — Hero Canvas Spotlight Reveal Engine
 * Smooth cursor-following spotlight lens revealing the illuminated product scene.
 */

class HeroSpotlight {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.width = 0;
    this.height = 0;

    // Interpolation Coordinates
    this.targetX = 0;
    this.targetY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.radius = 260; // Desktop lens radius
    this.easing = 0.08; // Smooth damping factor

    this.isHovering = false;
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.autoAngle = 0;

    // Images
    this.baseImage = new Image();
    this.revealImage = new Image();
    this.imagesLoaded = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Setup initial coordinates in center
    this.targetX = this.width * 0.7;
    this.targetY = this.height * 0.45;
    this.currentX = this.targetX;
    this.currentY = this.targetY;

    // Load visual assets
    this.baseImage.src = 'assets/logo.jpg';
    this.revealImage.src = 'assets/shop.jpg';

    const onImgLoad = () => {
      this.imagesLoaded++;
      if (this.imagesLoaded >= 2) {
        this.render();
      }
    };

    this.baseImage.onload = onImgLoad;
    this.revealImage.onload = onImgLoad;

    // Pointer events on hero section
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.targetX = e.clientX - rect.left;
        this.targetY = e.clientY - rect.top;
        this.isHovering = true;
      });

      heroSection.addEventListener('mouseleave', () => {
        this.isHovering = false;
        // Return gently to right side product area
        this.targetX = this.width * 0.7;
        this.targetY = this.height * 0.45;
      });

      // Touch handling for mobile
      heroSection.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          const rect = this.canvas.getBoundingClientRect();
          this.targetX = e.touches[0].clientX - rect.left;
          this.targetY = e.touches[0].clientY - rect.top;
          this.isHovering = true;
        }
      }, { passive: true });
    }

    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.parentElement.clientWidth;
    this.height = this.canvas.parentElement.clientHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Responsive radius
    this.radius = this.width < 768 ? 160 : 260;
  }

  animate() {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      // If idle on touch or not actively hovering, gently sway the spotlight
      if (!this.isHovering) {
        this.autoAngle += 0.015;
        const swayOffsetX = Math.cos(this.autoAngle) * (this.width < 768 ? 30 : 60);
        const swayOffsetY = Math.sin(this.autoAngle * 1.5) * (this.width < 768 ? 20 : 40);
        this.targetX = (this.width * 0.7) + swayOffsetX;
        this.targetY = (this.height * 0.45) + swayOffsetY;
      }

      // Smooth interpolation (damped tracking)
      this.currentX += (this.targetX - this.currentX) * this.easing;
      this.currentY += (this.targetY - this.currentY) * this.easing;
    } else {
      this.currentX = this.targetX;
      this.currentY = this.targetY;
    }

    this.render();
    requestAnimationFrame(() => this.animate());
  }

  render() {
    if (!this.ctx || this.width === 0 || this.height === 0) return;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Deep Black Luxury Background
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Draw Subtle Ambient Base Graphics (Base Layer)
    if (this.baseImage.complete && this.baseImage.naturalWidth > 0) {
      ctx.save();
      ctx.globalAlpha = 0.35;
      
      // Calculate aspect-fill positioning on right side
      const logoAspect = this.baseImage.naturalWidth / this.baseImage.naturalHeight;
      const targetHeight = this.height * 0.85;
      const targetWidth = targetHeight * logoAspect;
      const posX = this.width - targetWidth - (this.width < 768 ? -50 : 80);
      const posY = (this.height - targetHeight) / 2;

      ctx.drawImage(this.baseImage, posX, posY, targetWidth, targetHeight);
      ctx.restore();
    }

    // 3. Draw Deep Gradient Vignette over Base Layer
    const baseVignette = ctx.createRadialGradient(
      this.width * 0.5, this.height * 0.5, this.width * 0.2,
      this.width * 0.5, this.height * 0.5, this.width * 0.8
    );
    baseVignette.addColorStop(0, 'rgba(5, 5, 8, 0.2)');
    baseVignette.addColorStop(1, 'rgba(5, 5, 8, 0.9)');
    ctx.fillStyle = baseVignette;
    ctx.fillRect(0, 0, this.width, this.height);

    // 4. Spotlight Mask & Reveal Layer
    ctx.save();

    // Create soft feathered radial gradient mask
    const gradient = ctx.createRadialGradient(
      this.currentX, this.currentY, 0,
      this.currentX, this.currentY, this.radius
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
    gradient.addColorStop(0.85, 'rgba(255, 255, 255, 0.15)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    // Create temporary offscreen spotlight reveal
    ctx.beginPath();
    ctx.arc(this.currentX, this.currentY, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = gradient;

    // Use source-over with clipping or mask
    ctx.save();
    ctx.clip();

    // Draw the Reveal Image inside the Spotlight Lens
    if (this.revealImage.complete && this.revealImage.naturalWidth > 0) {
      const imgAspect = this.revealImage.naturalWidth / this.revealImage.naturalHeight;
      let drawW = this.width;
      let drawH = this.width / imgAspect;
      if (drawH < this.height) {
        drawH = this.height;
        drawW = this.height * imgAspect;
      }
      const drawX = (this.width - drawW) / 2;
      const drawY = (this.height - drawH) / 2;

      ctx.drawImage(this.revealImage, drawX, drawY, drawW, drawH);

      // Gold warm filter on reveal
      ctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
      ctx.fillRect(0, 0, this.width, this.height);
    }

    ctx.restore(); // Exit clip

    // 5. Draw Soft Golden Glow Ring on Spotlight Rim
    ctx.save();
    const rimGlow = ctx.createRadialGradient(
      this.currentX, this.currentY, this.radius * 0.88,
      this.currentX, this.currentY, this.radius * 1.05
    );
    rimGlow.addColorStop(0, 'rgba(212, 175, 55, 0)');
    rimGlow.addColorStop(0.5, 'rgba(212, 175, 55, 0.35)');
    rimGlow.addColorStop(1, 'rgba(212, 175, 55, 0)');
    ctx.fillStyle = rimGlow;
    ctx.beginPath();
    ctx.arc(this.currentX, this.currentY, this.radius * 1.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.charanHeroSpotlight = new HeroSpotlight('hero-canvas');
});
