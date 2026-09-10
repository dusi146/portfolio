import gsap from 'gsap';

export function initCustomCursor() {
  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse), (hover: none)').matches) return;

  const dot      = document.querySelector('.cursor-dot');
  const follower = document.querySelector('.cursor-follower');
  if (!dot || !follower) return;

  let mX = window.innerWidth / 2;
  let mY = window.innerHeight / 2;
  let fX = mX, fY = mY;

  // Direct GPU transform for instant dot response (0% overhead)
  window.addEventListener('mousemove', ({ clientX, clientY }) => {
    mX = clientX;
    mY = clientY;
    dot.style.transform = `translate3d(${mX}px, ${mY}px, 0)`;
  }, { passive: true });

  // Follower uses smooth lerp via GSAP ticker
  gsap.ticker.add(() => {
    fX += (mX - fX) * 0.15;
    fY += (mY - fY) * 0.15;
    follower.style.transform = `translate3d(${fX}px, ${fY}px, 0)`;
  });

  // ── LABEL STATE MACHINE ──────────────────────
  const hoverTargets = document.querySelectorAll('[data-cursor]');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      const label = el.getAttribute('data-cursor') || '';
      follower.classList.add('is-hovering');
      follower.textContent = label;
      dot.style.opacity = '0';
    });
    el.addEventListener('mouseleave', () => {
      follower.classList.remove('is-hovering');
      follower.textContent = '';
      dot.style.opacity = '1';
    });
  });

  // ── MAGNETIC ELEMENTS ────────────────────────
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r  = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.3;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.3;
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      follower.classList.add('is-magnetic');
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'power2.out', overwrite: true });
      follower.classList.remove('is-magnetic');
    });
  });
}
