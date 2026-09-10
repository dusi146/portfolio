import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initWheelMarquee() {
  const wrapper = document.querySelector('.marquee-wrapper');
  const track1  = document.querySelector('.marquee-track-left');
  const track2  = document.querySelector('.marquee-track-right');
  const link    = document.querySelector('.gateway-link');

  if (!wrapper || !track1 || !track2) return;

  // Cache cursor follower once — avoid repeated querySelector in hot event paths
  const follower = document.querySelector('.cursor-follower');

  // Speeds (pixels per frame at 60fps)
  // Faster base speed as requested by user!
  const BASE_SPEED_1 = -3.8; // Track 1 moves left fast
  const BASE_SPEED_2 =  3.4; // Track 2 moves right fast

  // Slow hover speed — relaxes down so text can be read easily
  const HOVER_SPEED_1 = -0.75;
  const HOVER_SPEED_2 =  0.65;

  let currentSpeed1 = BASE_SPEED_1;
  let currentSpeed2 = BASE_SPEED_2;
  let targetSpeed1  = BASE_SPEED_1;
  let targetSpeed2  = BASE_SPEED_2;

  let pos1 = 0;
  let pos2 = 0;

  // Dragging & Throw Inertia State
  let isDragging = false;
  let startX = 0;
  let lastX = 0;
  let dragDistance = 0;
  let throwVelocity = 0;
  let lastTime = performance.now();

  // Measure half width of tracks for seamless wrap-around
  let loopWidth1 = 0;
  let loopWidth2 = 0;

  function measure() {
    const segments1 = track1.querySelectorAll('.marquee-segment');
    const segments2 = track2.querySelectorAll('.marquee-segment');

    if (segments1.length >= 2) {
      let w1 = 0;
      // Half of the total segments form one complete loop
      const halfCount = Math.floor(segments1.length / 2);
      for (let i = 0; i < halfCount; i++) {
        w1 += segments1[i].getBoundingClientRect().width;
      }
      loopWidth1 = w1 || (track1.scrollWidth / 2);
    } else {
      loopWidth1 = track1.scrollWidth / 2;
    }

    if (segments2.length >= 2) {
      let w2 = 0;
      const halfCount = Math.floor(segments2.length / 2);
      for (let i = 0; i < halfCount; i++) {
        w2 += segments2[i].getBoundingClientRect().width;
      }
      loopWidth2 = w2 || (track2.scrollWidth / 2);
    } else {
      loopWidth2 = track2.scrollWidth / 2;
    }
  }

  // Initial measure after fonts ready
  if (document.fonts) {
    document.fonts.ready.then(measure);
  } else {
    setTimeout(measure, 300);
  }
  window.addEventListener('resize', measure);

  // ── HOVER: Smoothly slow down ──
  wrapper.addEventListener('mouseenter', () => {
    if (!isDragging) {
      targetSpeed1 = HOVER_SPEED_1;
      targetSpeed2 = HOVER_SPEED_2;
      if (follower) {
        follower.textContent = 'DRAG & SPIN';
        follower.classList.add('is-hovering');
      }
    }
  });

  wrapper.addEventListener('mouseleave', () => {
    if (!isDragging) {
      targetSpeed1 = BASE_SPEED_1;
      targetSpeed2 = BASE_SPEED_2;
      if (follower) {
        follower.textContent = '';
        follower.classList.remove('is-hovering');
      }
    }
  });

  // ── POINTER DOWN: Grab the wheel ──
  wrapper.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
    lastX = e.clientX;
    dragDistance = 0;
    throwVelocity = 0;
    lastTime = performance.now();

    wrapper.classList.add('is-grabbing');
    wrapper.setPointerCapture(e.pointerId);

    if (follower) {
      follower.textContent = 'SPINNING';
      follower.classList.add('is-hovering');
    }
  });

  // ── POINTER MOVE: Drag to spin ──
  wrapper.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    const now = performance.now();
    const dt = Math.max(now - lastTime, 1);
    const deltaX = e.clientX - lastX;

    dragDistance += Math.abs(deltaX);

    // Directly spin the wheel by drag delta
    pos1 += deltaX;
    pos2 += deltaX;

    // Calculate throw impulse (normalized per frame)
    throwVelocity = (deltaX / dt) * 16.6;

    lastX = e.clientX;
    lastTime = now;
  });

  // ── POINTER UP: Release with throw inertia ──
  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    wrapper.classList.remove('is-grabbing');

    try {
      wrapper.releasePointerCapture(e.pointerId);
    } catch (_) {}

    // Dampen extreme throw bursts for safety
    throwVelocity = Math.max(Math.min(throwVelocity * 1.35, 45), -45);

    if (follower) {
      follower.textContent = 'DRAG & SPIN';
    }
  }

  wrapper.addEventListener('pointerup', endDrag);
  wrapper.addEventListener('pointercancel', endDrag);

  // ── CLICK HANDLER: Differentiate drag from click ──
  if (link) {
    link.addEventListener('click', (e) => {
      // If user dragged more than 8 pixels, suppress navigation!
      if (dragDistance > 8) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  }

  // ── SCROLL VELOCITY ACCELERATION ──
  let scrollBoost = 0;
  ScrollTrigger.create({
    onUpdate: (self) => {
      const v = Math.abs(self.getVelocity());
      if (v > 100) {
        scrollBoost = Math.min(v / 300, 3.0);
      }
    },
  });

  // ── MASTER ANIMATION TICKER LOOP (120 FPS) ──
  gsap.ticker.add(() => {
    // Decay scroll boost back to 0
    scrollBoost *= 0.94;

    if (isDragging) {
      // While dragging, positions are controlled directly by pointermove
    } else {
      // Smoothly interpolate towards target cruising speed (flywheel momentum)
      currentSpeed1 += (targetSpeed1 - currentSpeed1) * 0.08;
      currentSpeed2 += (targetSpeed2 - currentSpeed2) * 0.08;

      // Apply throw inertia decay
      if (Math.abs(throwVelocity) > 0.05) {
        pos1 += throwVelocity;
        pos2 += throwVelocity;
        throwVelocity *= 0.938; // Friction deceleration
      } else {
        throwVelocity = 0;
      }

      // Add cruise speed plus scroll velocity boost
      const sign1 = Math.sign(currentSpeed1);
      const sign2 = Math.sign(currentSpeed2);
      pos1 += currentSpeed1 + (sign1 * scrollBoost * 2.2);
      pos2 += currentSpeed2 + (sign2 * scrollBoost * 2.2);
    }

    // Seamless infinite wrap-around
    if (loopWidth1 > 50) {
      pos1 = pos1 % loopWidth1;
      if (pos1 > 0) pos1 -= loopWidth1;
    }
    if (loopWidth2 > 50) {
      pos2 = pos2 % loopWidth2;
      if (pos2 > 0) pos2 -= loopWidth2;
    }

    // Apply hardware-accelerated transforms
    track1.style.transform = `translate3d(${pos1.toFixed(2)}px, 0, 0)`;
    track2.style.transform = `translate3d(${pos2.toFixed(2)}px, 0, 0)`;
  });
}
