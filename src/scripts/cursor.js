import gsap from 'gsap';

export function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  const dot = document.querySelector('.cursor-dot');
  const follower = document.querySelector('.cursor-follower');

  if (!dot || !follower) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;
  let isHovered = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    gsap.to(dot, {
      x: mouseX,
      y: mouseY,
      duration: 0.1,
      ease: 'power2.out',
    });
  });

  gsap.ticker.add(() => {
    if (!isHovered) {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;

      gsap.set(follower, {
        x: followerX,
        y: followerY,
      });
    }
  });

  // Target elements with data-cursor
  const hoverTargets = document.querySelectorAll('[data-cursor]');
  hoverTargets.forEach((target) => {
    target.addEventListener('mouseenter', () => {
      const label = target.getAttribute('data-cursor') || '';
      follower.classList.add('is-hovering');
      follower.textContent = label;
      gsap.to(dot, { opacity: 0, duration: 0.2 });
    });

    target.addEventListener('mouseleave', () => {
      follower.classList.remove('is-hovering');
      follower.textContent = '';
      gsap.to(dot, { opacity: 1, duration: 0.2 });
    });
  });

  // Magnetic elements
  const magneticElements = document.querySelectorAll('[data-magnetic]');
  magneticElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * 0.35;
      const deltaY = (e.clientY - centerY) * 0.35;

      gsap.to(el, {
        x: deltaX,
        y: deltaY,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.4)',
      });
    });
  });
}
