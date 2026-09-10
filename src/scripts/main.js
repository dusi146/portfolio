import '../styles/main.css';
import { initSmoothScroll } from './core/smoothScroll.js';
import { initCustomCursor } from './core/cursor.js';
import { initLiveClock } from './components/clock.js';
import { initProtection } from './core/protection.js';
import { initSplitText } from './components/splitText.js';
import { initKineticTypography, triggerNavScramble } from './components/kineticTypo.js';
import { initCurtainReveals } from './components/curtainReveal.js';
import { initIntro } from './components/intro.js';
import { runHeroEntrance } from './components/heroReveal.js';
import { initWheelMarquee } from './components/wheelMarquee.js';

async function start() {
  // 1. Core engines initialize immediately
  initProtection();
  initSmoothScroll();
  initCustomCursor();
  initLiveClock();

  // 2. Play intro greeting (accelerating, ~2s total)
  await initIntro();

  // 3. Brief wait — lets the intro curtain visually clear before hero entrance begins
  await new Promise(resolve => setTimeout(resolve, 300));

  // 4. Choreographed page entrance
  runHeroEntrance();

  // Auto-scramble nav status items sequentially — site feels alive on arrival
  setTimeout(triggerNavScramble, 800);

  // 5. Initialize scroll-triggered animations
  initSplitText();
  initKineticTypography();
  initCurtainReveals();
  initWheelMarquee();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
