import gsap from 'gsap';
import { getLenis } from '../core/smoothScroll.js';

/**
 * Mobile Floating Scroll Progress Indicator
 *
 * Lightweight, GPU-accelerated scroll progress pill displayed ONLY on mobile (max-width: 767px).
 * Follows Lenis scroll engine with zero layout thrashing via gsap.quickSetter(scaleX).
 */
export function initMobileScrollProgress() {
  const indicator = document.querySelector('.mobile-scroll-indicator');
  const fill = document.querySelector('.mobile-scroll-fill');

  if (!indicator || !fill) return;

  const mql = window.matchMedia('(max-width: 767px)');
  const setScaleX = gsap.quickSetter(fill, 'scaleX');

  let isVisible = false;
  let lastProgress = -1;

  const update = (scroll, limit, progress) => {
    // Strictly mobile only — zero overhead on desktop & tablet
    if (!mql.matches) {
      if (isVisible) {
        isVisible = false;
        indicator.classList.remove('is-visible');
      }
      return;
    }

    const s = typeof scroll === 'number' ? scroll : (window.scrollY || document.documentElement.scrollTop || 0);
    const l = typeof limit === 'number' && limit > 0
      ? limit
      : Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    const rawP = typeof progress === 'number' && !isNaN(progress)
      ? progress
      : (l > 0 ? s / l : 0);

    const p = Math.max(0, Math.min(1, rawP));

    // Update transform scaleX only when difference exceeds threshold
    if (Math.abs(p - lastProgress) > 0.0008) {
      lastProgress = p;
      setScaleX(p);
    }

    // Editorial visibility control:
    // Settle in gently when user starts scrolling (> 25px)
    // Fade out softly when returning very close to top (< 15px)
    if (s > 25) {
      if (!isVisible) {
        isVisible = true;
        indicator.classList.add('is-visible');
      }
    } else if (s < 15) {
      if (isVisible) {
        isVisible = false;
        indicator.classList.remove('is-visible');
      }
    }
  };

  // 1. Hook into Lenis scroll events
  const lenis = getLenis();
  if (lenis) {
    lenis.on('scroll', ({ scroll, limit, progress }) => {
      update(scroll, limit, progress);
    });
  }

  // 2. Native scroll listener fallback / touch synchronization
  window.addEventListener(
    'scroll',
    () => {
      if (lenis) {
        update(lenis.scroll, lenis.limit, lenis.progress);
      } else {
        update();
      }
    },
    { passive: true }
  );

  // 3. Viewport breakpoint change listener (e.g. mobile rotation)
  mql.addEventListener('change', (e) => {
    if (!e.matches && isVisible) {
      isVisible = false;
      indicator.classList.remove('is-visible');
    } else if (e.matches) {
      update();
    }
  });

  // Initial state: scaleX is 0
  setScaleX(0);
}
