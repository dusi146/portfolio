import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function runHeroEntrance() {
  const tl = gsap.timeline();

  // Initial states for pristine mask/entrance behavior
  gsap.set('.hero-portrait-card', {
    clipPath: 'inset(100% 0 0 0)',
    y: 30,
    scale: 1.03,
    opacity: 0,
  });
  gsap.set('.intro-line', { yPercent: 110 });
  gsap.set('.hero-desc', { opacity: 0, y: 16 });
  gsap.set('.hero-bottom-bar', { opacity: 0, y: 14 });
  gsap.set('.hero-ghost-1', { opacity: 0, scale: 1.04 });
  gsap.set('.hero-ghost-2', { opacity: 0, scale: 1.10 });

  // 1. World materialises: entire hero scales from 1.03 → 1.0
  tl.fromTo('#main-content',
    { scale: 1.03, opacity: 0 },
    { scale: 1.0, opacity: 1, duration: 1.1, ease: 'power3.out', force3D: true }
  );

  // 2. Nav header & metadata descend gracefully
  tl.fromTo('.nav-header',
    { y: -25, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
    '-=0.9'
  );

  tl.fromTo('.hero-meta-bar',
    { opacity: 0, y: -10 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
    '-=0.7'
  );

  // 3. Deliberate pause — held tension before the monumental name arrives
  tl.addLabel('titleArrival', '+=0.1');

  // 4. Split-letter reveal: D-U-V-A-N-S-I
  // - Starts hidden behind overflow mask
  // - translateY: 115% -> 0
  // - opacity: 0 -> 1
  // - scale: 0.985 -> 1
  // - Stagger ~80ms (0.08s)
  // - ease: cubic-bezier(0.16, 1, 0.3, 1)
  // - ZERO bounce, rotation, elastic, or heavy blur
  tl.fromTo('.hero-title .kinetic-char',
    {
      yPercent: 115,
      opacity: 0,
      scale: 0.985,
    },
    {
      yPercent: 0,
      opacity: 1,
      scale: 1,
      duration: 1.15,
      stagger: 0.08,
      ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
      force3D: true,
      onComplete: () => {
        // Unmask once settled so characters can breathe freely
        gsap.set('.char-mask', { overflow: 'visible' });
      },
    },
    'titleArrival'
  );

  // Letter spacing settles subtly from wider spacing to normal (calibrated for mobile vs desktop)
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const targetLetterSpacing = isMobile ? '0.02em' : '0.04em';
  const startLetterSpacing = isMobile ? '0.045em' : '0.08em';

  tl.fromTo('.hero-title',
    { letterSpacing: startLetterSpacing },
    {
      letterSpacing: targetLetterSpacing,
      duration: 1.3,
      ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
    'titleArrival'
  );

  // 5. Two ghost background layers materialise and begin their atmospheric presence
  tl.to('.hero-ghost-1', {
    opacity: 1,
    scale: 1.08,
    duration: 1.35,
    ease: 'power3.out',
  }, 'titleArrival+=0.15');

  tl.to('.hero-ghost-2', {
    opacity: 1,
    scale: 1.14,
    duration: 1.45,
    ease: 'power3.out',
  }, 'titleArrival+=0.2');

  // 6. Eyebrow badge settles
  tl.fromTo('.hero-eyebrow',
    { y: 12, opacity: 0, letterSpacing: '0.42em' },
    { y: 0, opacity: 1, letterSpacing: '0.32em', duration: 0.85, ease: 'power3.out' },
    'titleArrival+=0.4'
  );

  // 7. After letters resolve, hold visual tension ~0.15s, then reveal portrait & intro
  tl.addLabel('contentReveal', 'titleArrival+=1.4');

  // 8. Portrait card reveal: bottom mask clip-path + subtle rise
  tl.to('.hero-portrait-card', {
    clipPath: 'inset(0% 0 0 0)',
    y: 0,
    scale: 1,
    opacity: 1,
    duration: 1.2,
    ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
    force3D: true,
  }, 'contentReveal');

  // 9. Main intro: line-by-line reveal through overflow-hidden mask
  tl.to('.intro-line', {
    yPercent: 0,
    duration: 0.95,
    stagger: 0.085,
    ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
    force3D: true,
  }, 'contentReveal+=0.1');

  // 10. Personal body text fades in
  tl.to('.hero-desc', {
    opacity: 1,
    y: 0,
    duration: 0.85,
    ease: 'power3.out',
  }, 'contentReveal+=0.38');

  // 11. Hero bottom bar settles
  tl.to('.hero-bottom-bar', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
  }, 'contentReveal+=0.48');

  // 12. Initialize scroll drift deconstruction & refresh ScrollTrigger
  tl.add(() => {
    initHeroScrollDrift();
    requestAnimationFrame(() => {
      setTimeout(() => ScrollTrigger.refresh(), 100);
    });
  });
}

/**
 * Scroll-driven subtle deconstruction of the DUVANSI title:
 * As user scrolls away from the hero, characters drift apart slightly,
 * and ghost layers slide with nuanced parallax ratios.
 */
export function initHeroScrollDrift() {
  const chars = document.querySelectorAll('.hero-title .kinetic-char');
  if (chars.length < 7) return;

  const driftOffsets = [
    { x: -18, y: 0 },   // D: x -18px
    { x: 0,   y: -12 }, // U: y -12px
    { x: -8,  y: 0 },   // V: x -8px
    { x: 0,   y: -18 }, // A: y -18px
    { x: 10,  y: 0 },   // N: x 10px
    { x: 0,   y: -10 }, // S: y -10px
    { x: 14,  y: 0 },   // I: x 14px
  ];

  const driftTL = gsap.timeline({
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom 25%',
      scrub: 1.4,
    },
  });

  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const driftScale = isMobile ? 0.35 : 1.0;

  chars.forEach((char, index) => {
    const offset = driftOffsets[index] || { x: 0, y: 0 };
    driftTL.to(char, {
      x: offset.x * driftScale,
      y: offset.y * driftScale,
      opacity: 0.25,
      scale: 0.985,
      ease: 'none',
      force3D: true,
    }, 0);
  });

  const ghost1 = document.querySelector('.hero-ghost-1');
  if (ghost1) {
    driftTL.to(ghost1, {
      yPercent: -22,
      opacity: 0,
      ease: 'none',
    }, 0);
  }

  const ghost2 = document.querySelector('.hero-ghost-2');
  if (ghost2) {
    driftTL.to(ghost2, {
      yPercent: -34,
      xPercent: 6,
      opacity: 0,
      ease: 'none',
    }, 0);
  }
}
