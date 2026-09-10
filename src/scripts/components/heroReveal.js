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
    onComplete: () => {
      gsap.set('.intro-line-mask', { overflow: 'visible' });
    },
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

  // 12. Unmask containers & initialize scroll-driven typographic dispersion
  tl.add(() => {
    gsap.set('.char-mask, .intro-line-mask', { overflow: 'visible' });
    initHeroScrollDrift();
    requestAnimationFrame(() => {
      setTimeout(() => ScrollTrigger.refresh(), 100);
    });
  });
}

let driftMatchMedia = null;

/**
 * Scroll-driven Typographic Dispersion / Deconstruction Effect (Section 01):
 *
 * As user scrolls DOWN away from Section 01:
 * - DUVANSI monumental letters separate outward from center axis 'A' with subtle architectural tilts.
 * - Subtitle lines fan outward to the left with cascading speed and subtle CCW tilt.
 * - Meta bar & bottom bar items spread outward to their respective edges.
 * - Atmospheric ghost layers expand and dissolve into the void.
 * - Portrait column drifts upward and outward to maintain bilateral tension.
 *
 * When user scrolls BACK UP to the top:
 * - GSAP scrub (1.2s buttery physical inertia) smoothly reverses every tween.
 * - All typography reconstructs with magnetic precision back to exact resting states:
 *   (x: 0, y: 0, rotation: 0, scale: 1, opacity: 1).
 */
export function initHeroScrollDrift() {
  if (driftMatchMedia) {
    driftMatchMedia.revert();
    driftMatchMedia = null;
  }

  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;

  const charMasks = document.querySelectorAll('.hero-title .char-mask');
  if (charMasks.length < 7) return;

  driftMatchMedia = gsap.matchMedia();

  driftMatchMedia.add({
    isDesktop: '(min-width: 768px)',
    isMobile: '(max-width: 767px)',
  }, (context) => {
    const { isMobile } = context.conditions;

    const driftTL = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom 15%',
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    });

    // ── 1. DUVANSI Monumental Title Architectural Dispersion ──
    // Center axis: Letter 'A' (index 3) acts as anchor.
    // Letters left of center drift left (-x), upward (-y), tilt counter-clockwise (-rotation).
    // Letters right of center drift right (+x), upward (-y), tilt clockwise (+rotation).
    // Animating .char-mask guarantees complete decoupling from .kinetic-char hover interaction.
    const titleOffsets = isMobile ? [
      { x: -20, y: -44, rot: -0.45 }, // D
      { x: -13, y: -38, rot: -0.30 }, // U
      { x:  -7, y: -42, rot: -0.15 }, // V
      { x:   0, y: -48, rot:  0.00 }, // A (center anchor)
      { x:   7, y: -42, rot:  0.15 }, // N
      { x:  13, y: -38, rot:  0.30 }, // S
      { x:  20, y: -44, rot:  0.45 }, // I
    ] : [
      { x: -54, y: -56, rot: -1.30 }, // D
      { x: -36, y: -48, rot: -0.80 }, // U
      { x: -18, y: -54, rot: -0.40 }, // V
      { x:   0, y: -64, rot:  0.00 }, // A (center anchor)
      { x:  18, y: -54, rot:  0.40 }, // N
      { x:  36, y: -48, rot:  0.80 }, // S
      { x:  54, y: -56, rot:  1.30 }, // I
    ];

    charMasks.forEach((mask, index) => {
      const offset = titleOffsets[index] || { x: 0, y: -50, rot: 0 };
      const isCenter = index === 3;
      driftTL.fromTo(mask,
        {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
        },
        {
          x: offset.x,
          y: offset.y,
          rotation: offset.rot,
          scale: isCenter ? 0.985 : 1,
          opacity: isMobile ? 0.20 : 0.16,
          ease: 'none',
          force3D: true,
        },
        0
      );
    });

    // Subtle letter-spacing expansion as you leave Section 01
    const startSpacing = isMobile ? '0.02em' : '0.04em';
    const endSpacing   = isMobile ? '0.035em' : '0.075em';
    driftTL.fromTo('.hero-title',
      { letterSpacing: startSpacing },
      {
        letterSpacing: endSpacing,
        ease: 'none',
      },
      0
    );

    // ── 2. Atmospheric Ghost Background Layers ──
    // Uses yPercent/xPercent so ambient sine floating in kineticTypo.js remains intact
    const ghost1 = document.querySelector('.hero-ghost-1');
    if (ghost1) {
      driftTL.fromTo(ghost1,
        { yPercent: 0, scale: isMobile ? 1.04 : 1.08, opacity: 1 },
        {
          yPercent: isMobile ? -28 : -45,
          scale: isMobile ? 1.08 : 1.14,
          opacity: 0,
          ease: 'none',
        },
        0
      );
    }

    const ghost2 = document.querySelector('.hero-ghost-2');
    if (ghost2) {
      driftTL.fromTo(ghost2,
        { yPercent: 0, xPercent: 0, scale: isMobile ? 1.08 : 1.14, opacity: 1 },
        {
          yPercent: isMobile ? -36 : -60,
          xPercent: isMobile ? 4 : 8,
          scale: isMobile ? 1.12 : 1.20,
          opacity: 0,
          ease: 'none',
        },
        0
      );
    }

    // Monumental background watermark
    const bgGhost = document.querySelector('.hero-bg-ghost');
    if (bgGhost && !isMobile) {
      driftTL.fromTo(bgGhost,
        { y: 0, scale: 1, opacity: 0.035 },
        {
          y: -80,
          scale: 1.06,
          opacity: 0,
          ease: 'none',
        },
        0
      );
    }

    // ── 3. Eyebrow Badge (Centered Axis) ──
    const eyebrow = document.querySelector('.hero-eyebrow');
    if (eyebrow) {
      driftTL.fromTo(eyebrow,
        { y: 0, opacity: 1, letterSpacing: isMobile ? '0.16em' : '0.32em' },
        {
          y: isMobile ? -32 : -55,
          opacity: 0.12,
          letterSpacing: isMobile ? '0.22em' : '0.38em',
          ease: 'none',
        },
        0
      );
    }

    // ── 4. Intro Lines / Subtitle (Left Axis Cascading Fan) ──
    // Smaller editorial typography moves faster with wider spread to produce deep parallax
    const introLines = document.querySelectorAll('.hero-subtitle .intro-line');
    const introOffsets = isMobile ? [
      { x: -14, y: -42, rot: -0.25 },
      { x: -16, y: -46, rot: -0.30 },
      { x: -18, y: -50, rot: -0.35 },
      { x: -20, y: -54, rot: -0.35 },
    ] : [
      { x: -45, y: -70, rot: -0.60 },
      { x: -55, y: -76, rot: -0.70 },
      { x: -65, y: -82, rot: -0.80 },
      { x: -75, y: -88, rot: -0.85 },
    ];

    introLines.forEach((line, i) => {
      const off = introOffsets[i] || { x: -40, y: -65, rot: -0.5 };
      driftTL.fromTo(line,
        { x: 0, y: 0, rotation: 0, opacity: 1 },
        {
          x: off.x,
          y: off.y,
          rotation: off.rot,
          opacity: 0.08,
          ease: 'none',
          force3D: true,
        },
        0
      );
    });

    // ── 5. Personal Body Description ──
    const heroDesc = document.querySelector('.hero-desc');
    if (heroDesc) {
      driftTL.fromTo(heroDesc,
        { x: 0, y: 0, rotation: 0, opacity: 1 },
        {
          x: isMobile ? -12 : -38,
          y: isMobile ? -36 : -62,
          rotation: isMobile ? -0.20 : -0.40,
          opacity: 0.10,
          ease: 'none',
          force3D: true,
        },
        0
      );
    }

    // ── 6. Editorial Portrait Column (Right Axis Balancer) ──
    // Animating parent .hero-portrait-col preserves child .hero-portrait-card drag intact
    const portraitCol = document.querySelector('.hero-portrait-col');
    if (portraitCol) {
      driftTL.fromTo(portraitCol,
        { x: 0, y: 0, rotation: 0, opacity: 1 },
        {
          x: isMobile ? 10 : 35,
          y: isMobile ? -34 : -52,
          rotation: isMobile ? 0.20 : 0.60,
          opacity: 0.22,
          ease: 'none',
          force3D: true,
        },
        0
      );
    }

    // ── 7. Meta Bar (Top Coordinates & Label) ──
    const metaBarItems = document.querySelectorAll('.hero-meta-bar > *');
    if (metaBarItems.length >= 1) {
      // Left item: 01 // INDEPENDENT DESIGN PRACTICE
      driftTL.fromTo(metaBarItems[0],
        { x: 0, y: 0, rotation: 0, opacity: 1 },
        {
          x: isMobile ? -14 : -50,
          y: isMobile ? -24 : -42,
          rotation: isMobile ? -0.20 : -0.50,
          opacity: 0.12,
          ease: 'none',
          force3D: true,
        },
        0
      );

      // Right item: Coordinates (Desktop only)
      if (metaBarItems.length >= 2 && !isMobile) {
        driftTL.fromTo(metaBarItems[1],
          { x: 0, y: 0, rotation: 0, opacity: 1 },
          {
            x: 50,
            y: -42,
            rotation: 0.50,
            opacity: 0.12,
            ease: 'none',
            force3D: true,
          },
          0
        );
      }
    }

    // ── 8. Bottom Bar (Disciplines Tag & Scroll Prompt) ──
    const disciplinesTag = document.querySelector('.hero-disciplines-tag');
    if (disciplinesTag) {
      driftTL.fromTo(disciplinesTag,
        { x: 0, y: 0, rotation: 0, opacity: 1 },
        {
          x: isMobile ? -12 : -45,
          y: isMobile ? -18 : -32,
          rotation: isMobile ? -0.15 : -0.40,
          opacity: 0.12,
          ease: 'none',
          force3D: true,
        },
        0
      );
    }

    const scrollPrompt = document.querySelector('.scroll-prompt');
    if (scrollPrompt) {
      driftTL.fromTo(scrollPrompt,
        { x: 0, y: 0, rotation: 0, opacity: 1 },
        {
          x: isMobile ? 12 : 45,
          y: isMobile ? -18 : -32,
          rotation: isMobile ? 0.15 : 0.40,
          opacity: 0.12,
          ease: 'none',
          force3D: true,
        },
        0
      );
    }
  });
}
