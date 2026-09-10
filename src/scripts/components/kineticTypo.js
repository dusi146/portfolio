import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initKineticTypography() {
  // ── 1. Elegant Text Scramble Decoder ──
  const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01_~/-*+[]';
  document.querySelectorAll('[data-scramble]').forEach((el) => {
    const original = el.getAttribute('data-original') || el.textContent.trim();
    el.setAttribute('data-original', original);
    let interval = null;

    el.addEventListener('mouseenter', () => {
      let frame = 0;
      clearInterval(interval);
      interval = setInterval(() => {
        el.textContent = original
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' ';
            if (i < frame / 2) return original[i];
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join('');
        frame++;
        if (frame > original.length * 2) {
          el.textContent = original;
          clearInterval(interval);
        }
      }, 24);
    });
  });

  // ── 2. Interactive Editorial Manifesto (Vertical Reading Spotlight) ──
  const manifesto = document.querySelector('.manifesto-composition');
  if (manifesto) {
    const phrases = manifesto.querySelectorAll('.m-phrase');

    phrases.forEach((phrase) => {
      const isClimaxWord = phrase.querySelector('.climax-word');
      const isResolution = phrase.classList.contains('text-climax-resolution');
      const isConnector  = phrase.classList.contains('m-level-3');
      const isItalic     = phrase.querySelector('.font-editorial');
      const isRight      = phrase.classList.contains('text-right');
      const textContent  = phrase.textContent.trim();
      const isPacedMoment = isClimaxWord || isResolution || textContent.includes('MORE INTENT') || textContent.includes('LESS NOISE');

      // Subtle horizontal drift for italic lines (-12px or +12px on desktop, 0 on mobile to prevent overflow)
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const xDrift = isMobile ? 0 : (isItalic ? (isRight ? -12 : 12) : 0);
      const initialScale = isClimaxWord ? 0.96 : (isConnector ? 1 : 0.985);

      // Dedicated ScrollTrigger per phrase: approaching -> active spotlight -> passed ambient
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: phrase,
          start: isClimaxWord ? 'top 82%' : (isPacedMoment ? 'top 85%' : 'top 88%'),
          end: isClimaxWord ? 'bottom 12%' : (isPacedMoment ? 'bottom 15%' : 'bottom 20%'),
          scrub: isClimaxWord ? 2.0 : (isPacedMoment ? 1.6 : 1.3),
        },
      });

      // 1. UPCOMING (0.18) -> APPROACHING -> ACTIVE (1.0 at center reading zone)
      tl.fromTo(phrase,
        {
          opacity: 0.18,
          y: isClimaxWord ? 32 : 24,
          x: xDrift,
          scale: initialScale,
          letterSpacing: isClimaxWord ? '0.08em' : '0.04em',
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          letterSpacing: isClimaxWord ? '0.06em' : '0.035em',
          duration: 0.45,
          ease: 'power2.out',
          force3D: true,
        }
      );

      // 2. ACTIVE READING ZONE (Hold duration based on narrative weight)
      // SILENCE and key axioms stay active longer for deliberate pacing
      const holdDuration = isClimaxWord ? 0.65 : (isResolution ? 0.45 : (isPacedMoment ? 0.35 : 0.15));
      tl.to(phrase, {
        duration: holdDuration,
        ease: 'none',
      });

      // 3. PASSED (Gracefully dims to ambient reading level 0.38 - 0.52 as user scrolls beyond)
      const passedOpacity = isClimaxWord ? 0.52 : (isPacedMoment ? 0.46 : 0.38);
      tl.to(phrase, {
        opacity: passedOpacity,
        y: -10,
        duration: 0.4,
        ease: 'power1.out',
        force3D: true,
      });
    });
  }

  // ── 3. Section 03: Editorial Exhibition Reveal & Refined Motion Design ──
  const showcaseSection = document.querySelector('.showcase-section');
  if (showcaseSection) {
    const rule = showcaseSection.querySelector('.showcase-rule');
    const headerMeta = showcaseSection.querySelectorAll(
      '.showcase-header .section-label, .showcase-header .archive-count-label'
    );
    const cards = showcaseSection.querySelectorAll('.typo-card');
    const card1 = cards[0];
    const card2 = cards[1];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Helper: Staggered reveal for internal typography & surface depth
    const buildCardInternalTL = (card) => {
      const tl = gsap.timeline();
      const corners = card.querySelectorAll('.typo-card-corner');
      const badge   = card.querySelector('.typo-card-discipline-num');
      const lines   = card.querySelectorAll('.typo-headline-line');
      const body    = card.querySelector('.typo-card-body');
      const tags    = card.querySelectorAll('.typo-card-tags span');
      const inner   = card.querySelector('.typo-card-inner');

      // Initial card typography state
      gsap.set(corners, { opacity: 0, y: 8 });
      if (badge) gsap.set(badge, { opacity: 0, y: 12 });
      gsap.set(lines, { yPercent: 110 });
      if (body) gsap.set(body, { opacity: 0, y: 15 });
      gsap.set(tags, { opacity: 0, y: 6 });
      if (inner) gsap.set(inner, { scale: 1.035, y: 18 });

      // Internal surface counter-motion (1.4–1.6s)
      if (inner) {
        tl.to(inner, {
          scale: 1,
          y: 0,
          duration: 1.5,
          ease: 'power3.out',
          force3D: true,
        }, 0);
      }

      // A — Corners metadata: opacity 0 -> 1, y: 8px -> 0
      tl.to(corners, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.05,
        ease: 'power2.out',
      }, 0.2);

      // B — Small gold label: opacity 0 -> 1, y: 12px -> 0
      if (badge) {
        tl.to(badge, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power2.out',
        }, 0.28);
      }

      // C — Main Title: each line sliding up through overflow-hidden mask
      tl.to(lines, {
        yPercent: 0,
        duration: 1.0,
        stagger: 0.1,
        ease: 'power4.out',
        force3D: true,
      }, 0.35);

      // D — Description: opacity 0 -> 1, y: 15px -> 0
      if (body) {
        tl.to(body, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        }, 0.55);
      }

      // E — Tags: opacity 0 -> 1, stagger 0.06s
      tl.to(tags, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power2.out',
      }, 0.65);

      return tl;
    };

    if (prefersReducedMotion) {
      if (rule) gsap.set(rule, { scaleX: 1 });
      gsap.set(headerMeta, { opacity: 1, y: 0 });
      gsap.set(cards, { clipPath: 'inset(0% 0 0 0)', opacity: 1, y: 0 });
      gsap.set('.typo-headline-line', { yPercent: 0 });
    } else {
      const mm = gsap.matchMedia();

      // ── DESKTOP & TABLET (>= 768px) ──
      mm.add('(min-width: 768px)', () => {
        // Initial curtain state
        gsap.set(cards, {
          clipPath: 'inset(100% 0 0 0)',
          y: 45,
          opacity: 0.3,
        });

        // 1. Master Section Entrance Sequence
        const masterTL = gsap.timeline({
          scrollTrigger: {
            trigger: showcaseSection,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        });

        // 01 — Top horizontal divider (drawn like an editorial rule)
        if (rule) {
          masterTL.fromTo(rule,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }
          );
        }

        // 02 — Section metadata appear after line begins
        masterTL.fromTo(headerMeta,
          { opacity: 0, y: 12, letterSpacing: '0.35em' },
          {
            opacity: 1,
            y: 0,
            letterSpacing: '0.18em',
            duration: 0.8,
            stagger: 0.14,
            ease: 'power2.out',
          },
          '-=0.65'
        );

        // 03 — Card 1 Curtain Reveal
        if (card1) {
          masterTL.to(card1, {
            clipPath: 'inset(0% 0 0 0)',
            y: 0,
            opacity: 1,
            duration: 1.3,
            ease: 'power4.out',
            force3D: true,
          }, '-=0.4');
          masterTL.add(buildCardInternalTL(card1), '-=1.2');
        }

        // 04 — Card 2 Curtain Reveal (staggered ~0.15s)
        if (card2) {
          masterTL.to(card2, {
            clipPath: 'inset(0% 0 0 0)',
            y: 0,
            opacity: 1,
            duration: 1.3,
            ease: 'power4.out',
            force3D: true,
          }, '-=1.15');
          masterTL.add(buildCardInternalTL(card2), '-=1.2');
        }

        // 2. Subtle Post-Reveal Parallax Depth
        if (card1 && card2) {
          gsap.to(card1, {
            yPercent: -2,
            ease: 'none',
            scrollTrigger: {
              trigger: showcaseSection,
              start: 'top center',
              end: 'bottom top',
              scrub: 1.6,
            },
          });
          gsap.to(card2, {
            yPercent: -3.5,
            ease: 'none',
            scrollTrigger: {
              trigger: showcaseSection,
              start: 'top center',
              end: 'bottom top',
              scrub: 1.6,
            },
          });
        }
      });

      // ── MOBILE (<= 767px) ──
      mm.add('(max-width: 767px)', () => {
        // Mobile Section Header
        const mobileHeaderTL = gsap.timeline({
          scrollTrigger: {
            trigger: showcaseSection,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        if (rule) {
          mobileHeaderTL.fromTo(rule,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.8, ease: 'power3.inOut' }
          );
        }

        mobileHeaderTL.fromTo(headerMeta,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out' },
          '-=0.5'
        );

        // Mobile: Sequential Reveal for each card
        cards.forEach((card) => {
          gsap.set(card, {
            clipPath: 'inset(100% 0 0 0)',
            y: 30,
            opacity: 0.3,
          });

          const cardTL = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });

          cardTL.to(card, {
            clipPath: 'inset(0% 0 0 0)',
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: 'power4.out',
            force3D: true,
          });

          cardTL.add(buildCardInternalTL(card), '-=0.9');
        });
      });
    }

    // ── Background Oversized Glyphs ('B' and 'D') Subtle Scroll Scrub ──
    cards.forEach((card) => {
      const glyph = card.querySelector('.typo-card-bg-glyph');
      if (glyph) {
        gsap.fromTo(glyph,
          { yPercent: 6, xPercent: -2 },
          {
            yPercent: -6,
            xPercent: 2,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.8,
            },
          }
        );
      }
    });

    // ── Refined Hover Motion (Quiet, Precise, No Bounce) ──
    cards.forEach((card) => {
      const glyph = card.querySelector('.typo-card-bg-glyph');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });

      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -5,
          duration: 0.6,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto',
        });
        if (glyph) {
          gsap.to(glyph, {
            scale: 1.015,
            duration: 0.65,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            overwrite: 'auto',
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        if (glyph) {
          gsap.to(glyph, {
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      });
    });
  }

  // ── 4. Kinetic Title Letter Hover (Refined, Subtle, No Flashy Glow) ──
  document.querySelectorAll('.kinetic-char').forEach((char) => {
    char.addEventListener('mouseenter', () => {
      if (window.scrollY > 80) return;
      gsap.to(char, {
        y: -8,
        scale: 1.02,
        color: 'var(--text-white)',
        duration: 0.45,
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        overwrite: 'auto',
      });
    });
    char.addEventListener('mouseleave', () => {
      gsap.to(char, {
        y: 0,
        scale: 1,
        color: 'var(--text-chalk)',
        duration: 0.55,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
  });

  // ── 5. Ambient Atmospheric Ghost Layers (DUVANSI) ──
  const isMobileViewport = window.matchMedia('(max-width: 767px)').matches;
  const ghost1Amp = isMobileViewport ? 8 : 24;
  const ghost2AmpX = isMobileViewport ? 6 : 18;
  const ghost2AmpY = isMobileViewport ? 2 : 5;

  // Ghost layer 1: drift slowly left to right
  const ghost1 = document.querySelector('.hero-ghost-1');
  if (ghost1) {
    gsap.fromTo(ghost1,
      { x: -ghost1Amp },
      {
        x: ghost1Amp,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      }
    );
  }

  // Ghost layer 2: drift slowly right to left
  const ghost2 = document.querySelector('.hero-ghost-2');
  if (ghost2) {
    gsap.fromTo(ghost2,
      { x: ghost2AmpX, y: -ghost2AmpY },
      {
        x: -ghost2AmpX,
        y: ghost2AmpY,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      }
    );
  }

  // ── 6. Editorial Portrait Card Draggable & Gummy Spring-Back ──
  const portraitCard = document.querySelector('.hero-portrait-card');
  if (portraitCard) {
    let isDragging = false;
    let isSpringing = false;
    let startX = 0;
    let startY = 0;
    let originX = 0;
    let originY = 0;

    const follower = document.querySelector('.cursor-follower');

    // Ambient mouse parallax quickTo handlers
    const setCardX = gsap.quickTo(portraitCard, 'x', { duration: 1.8, ease: 'power2.out' });
    const setCardY = gsap.quickTo(portraitCard, 'y', { duration: 1.8, ease: 'power2.out' });

    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('mousemove', (e) => {
        if (isDragging || isSpringing) return;
        const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        // Very subtle living feel: max ±8px horizontal, ±6px vertical
        setCardX(nx * 8);
        setCardY(ny * 6);
      });
    }

    const onPointerDown = (e) => {
      // Primary button or touch only
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      isDragging = true;
      isSpringing = false;
      startX = e.clientX;
      startY = e.clientY;
      originX = gsap.getProperty(portraitCard, 'x') || 0;
      originY = gsap.getProperty(portraitCard, 'y') || 0;

      try {
        portraitCard.setPointerCapture(e.pointerId);
      } catch (_) {}

      portraitCard.classList.add('is-dragging');
      if (follower && follower.classList.contains('is-hovering')) {
        follower.textContent = 'HOLD';
      }

      gsap.killTweensOf(portraitCard);
      gsap.to(portraitCard, {
        scale: 1.018,
        duration: 0.22,
        ease: 'power2.out',
      });
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Soft damping resistance curve for controlled tactile weight
      const resistance = 0.72;
      const rawX = originX + dx * resistance;
      const rawY = originY + dy * resistance;

      // Clamped range: max ±130px horizontal, ±95px vertical
      const clampedX = Math.max(-130, Math.min(130, rawX));
      const clampedY = Math.max(-95, Math.min(95, rawY));

      // Subtle dynamic tilt (-1.4deg to +1.4deg max)
      const rot = (clampedX / 130) * 1.4;

      gsap.set(portraitCard, {
        x: clampedX,
        y: clampedY,
        rotation: rot,
      });
    };

    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      isSpringing = true;

      try {
        portraitCard.releasePointerCapture(e.pointerId);
      } catch (_) {}

      portraitCard.classList.remove('is-dragging');
      if (follower && follower.classList.contains('is-hovering')) {
        follower.textContent = 'DRAG';
      }

      // Soft elastic / gummy spring back: single controlled rebound
      gsap.to(portraitCard, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.95,
        ease: 'elastic.out(1, 0.85)',
        force3D: true,
        onComplete: () => {
          isSpringing = false;
        },
      });
    };

    portraitCard.addEventListener('pointerdown', onPointerDown);
    portraitCard.addEventListener('pointermove', onPointerMove);
    portraitCard.addEventListener('pointerup', onPointerUp);
    portraitCard.addEventListener('pointercancel', onPointerUp);

    // Subtle scroll-linked parallax drift
    gsap.to(portraitCard, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.4,
      },
    });
  }

  // ── 7. Giant Background Watermark Scroll Scrub ──
  const heroGhost = document.querySelector('.hero-bg-ghost');
  if (heroGhost) {
    gsap.to(heroGhost, {
      y: 200,
      opacity: 0.006,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    });

    const setGhostX = gsap.quickTo(heroGhost, 'x', { duration: 1.2, ease: 'power2.out' });
    window.addEventListener('mousemove', (e) => {
      setGhostX((e.clientX - window.innerWidth / 2) * -0.015);
    });
  }
}

// ── Auto-scramble: fired externally after hero entrance completes ──
export function triggerNavScramble() {
  const scrambleEls = document.querySelectorAll('.nav-meta [data-scramble]');
  const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01_~/-*+[]';

  scrambleEls.forEach((el, idx) => {
    setTimeout(() => {
      const original = el.getAttribute('data-original') || el.textContent.trim();
      el.setAttribute('data-original', original);
      let frame = 0;
      const interval = setInterval(() => {
        el.textContent = original
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' ';
            if (i < frame / 2) return original[i];
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join('');
        frame++;
        if (frame > original.length * 2) {
          el.textContent = original;
          clearInterval(interval);
        }
      }, 24);
    }, idx * 150);
  });
}

