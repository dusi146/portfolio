import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export async function initSplitText() {
  await document.fonts.ready;

  const splitEls = document.querySelectorAll('[data-split]');
  if (!splitEls.length) return;

  splitEls.forEach((el) => {
    // Avoid double splitting
    if (el.dataset.hasSplit) return;
    el.dataset.hasSplit = 'true';

    const split = new SplitType(el, { types: 'lines' });
    if (!split.lines || !split.lines.length) return;

    split.lines.forEach((line) => {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'overflow:hidden;display:block;padding-bottom:0.08em;';
      line.parentNode.insertBefore(wrap, line);
      wrap.appendChild(line);
    });

    gsap.fromTo(split.lines,
      { y: '110%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 1.2,
        stagger: 0.08,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}
