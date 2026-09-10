import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  // 1. SplitType Reveal on Text
  const splitElements = document.querySelectorAll('[data-split]');
  splitElements.forEach((el) => {
    const split = new SplitType(el, { types: 'lines, words' });
    
    // Wrap each line into an overflow-hidden mask
    if (split.lines && split.lines.length) {
      split.lines.forEach((line) => {
        const wrap = document.createElement('div');
        wrap.className = 'split-line-wrap';
        line.parentNode.insertBefore(wrap, line);
        wrap.appendChild(line);
      });

      gsap.from(split.lines, {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        y: '120%',
        rotate: 1.5,
        opacity: 0,
        duration: 1.3,
        stagger: 0.08,
        ease: 'power3.out',
      });
    }
  });

  // 2. Curtain Image Reveal with Clip-path & Scale Parallax
  const curtainImages = document.querySelectorAll('.curtain-reveal');
  curtainImages.forEach((curtain) => {
    const inner = curtain.querySelector('.curtain-inner');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: curtain,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    tl.to(curtain, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.4,
      ease: 'power4.inOut',
    });

    if (inner) {
      tl.to(inner, {
        scale: 1,
        duration: 1.6,
        ease: 'power3.out',
      }, '<');
    }
  });

  // 3. Staggered Fade Up for Cards and Info Blocks
  const fadeUpElements = document.querySelectorAll('[data-fade-up]');
  fadeUpElements.forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 92%',
        toggleActions: 'play none none none',
      },
      y: 45,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
    });
  });

  // 4. Hero Entrance Timeline (Plays automatically on load)
  const heroTL = gsap.timeline({ delay: 0.2 });
  heroTL
    .from('.nav-header', {
      y: -30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    })
    .from('.hero-eyebrow', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.6')
    .from('.hero-bottom-bar', {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out',
    }, '-=0.4');

  // 5. Live Saigon (GMT+7) Clock
  const clockEl = document.getElementById('live-clock');
  if (clockEl) {
    const updateClock = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      clockEl.textContent = `${now.toLocaleTimeString('en-GB', options)} GMT+7`;
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  // 6. Interactive Email Copy to Clipboard
  const emailBtn = document.querySelector('.email-copy-btn');
  if (emailBtn) {
    emailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('hello@duvansi.com').then(() => {
        const originalText = emailBtn.innerHTML;
        emailBtn.innerHTML = `<span>COPIED TO CLIPBOARD ?</span>`;
        setTimeout(() => {
          emailBtn.innerHTML = originalText;
        }, 2200);
      });
    });
  }
}
