import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let _lenis = null;

export function initSmoothScroll() {
  if (_lenis) return _lenis;

  _lenis = new Lenis({
    duration: 1.1,
    easing: (t) => {
      // Refined exponential ease-out — rapid deceleration without the dead "coast"
      // Math.min guard prevents floating-point overshoot past 1.0
      return Math.min(1, 1.001 - Math.pow(2, -10 * t));
    },
    orientation:        'vertical',
    gestureOrientation: 'vertical',
    smoothWheel:        true,
    wheelMultiplier:    1.0,
    touchMultiplier:    2.0,
    infinite:           false,
  });

  // Bridge Lenis RAF with GSAP — zero lagSmoothing for maximum fidelity
  _lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => _lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(500, 33);

  return _lenis;
}

export function getLenis() { return _lenis; }
