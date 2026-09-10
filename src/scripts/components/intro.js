import gsap from 'gsap';

const GREETINGS = [
  { word: 'Xin chào',    lang: 'VIETNAMESE' },
  { word: 'Hello',       lang: 'ENGLISH'    },
  { word: 'Bonjour',     lang: 'FRANÇAIS'   },
  { word: 'Ciao',        lang: 'ITALIANO'   },
  { word: 'こんにちは',   lang: 'JAPANESE'   },
  { word: 'DUVANSI',     lang: 'STUDIO'     },
];

// Accelerated tempo: deliberate opening -> kinetic velocity -> bold arrival
const HOLDS = [0.32, 0.20, 0.15, 0.12, 0.10, 0.38];
const IN_DUR  = 0.22;
const OUT_DUR = 0.14;

export function initIntro() {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.id = 'intro-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="intro-bg-watermark" aria-hidden="true">DUVANSI</div>

      <div class="intro-stage">
        <div class="intro-lang-label" id="intro-lang">VIETNAMESE</div>
        <div class="intro-word-mask">
          <div class="intro-word" id="intro-word">Xin chào</div>
        </div>
      </div>

      <div class="intro-footer">
        <div class="intro-progress-wrap">
          <div class="intro-progress-fill" id="intro-fill"></div>
        </div>
        <div class="intro-counter" id="intro-counter">01 / 06</div>
      </div>
    `;

    document.body.prepend(overlay);
    document.body.style.overflow = 'hidden';

    const wordEl    = document.getElementById('intro-word');
    const langEl    = document.getElementById('intro-lang');
    const counterEl = document.getElementById('intro-counter');
    const fillEl    = document.getElementById('intro-fill');
    const TOTAL     = GREETINGS.length;

    const times = [];
    let cursor = 0;
    GREETINGS.forEach((_, i) => {
      times.push(cursor);
      cursor += IN_DUR + HOLDS[i] + (i < TOTAL - 1 ? OUT_DUR : 0);
    });
    const TOTAL_DUR = cursor;

    let isDone = false;
    const finishIntro = () => {
      if (isDone) return;
      isDone = true;
      document.body.style.overflow = '';
      gsap.killTweensOf([overlay, fillEl, wordEl, langEl]);

      gsap.to(overlay, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
        force3D: true,
        onStart: () => {
          resolve();
        },
        onComplete: () => {
          overlay.remove();
        },
      });
    };

    // Click anywhere to skip immediately
    overlay.addEventListener('click', finishIntro);

    const tl = gsap.timeline({
      onComplete: finishIntro,
    });

    // Hairline golden progress beam (pure GPU scaleX)
    tl.fromTo(fillEl,
      { scaleX: 0 },
      { scaleX: 1, duration: TOTAL_DUR, ease: 'none', force3D: true },
      0
    );

    GREETINGS.forEach((item, i) => {
      const t0 = times[i];
      const isLast = i === TOTAL - 1;

      tl.call(() => {
        wordEl.textContent    = item.word;
        langEl.textContent    = item.lang;
        counterEl.textContent = `${String(i + 1).padStart(2, '0')} / ${String(TOTAL).padStart(2, '0')}`;

        if (isLast) {
          wordEl.style.color = 'var(--gold)';
          langEl.style.color = 'var(--gold-light)';
        }
      }, [], t0);

      // IN: Pure translate3d + opacity (0% layout thrashing, locked 120 FPS)
      tl.fromTo(wordEl,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: IN_DUR, ease: 'power3.out', force3D: true },
        t0
      );

      tl.fromTo(langEl,
        { opacity: 0, y: 6 },
        { opacity: 0.7, y: 0, duration: IN_DUR * 0.75, ease: 'power2.out', force3D: true },
        t0 + 0.02
      );

      // OUT: Pure translate3d + opacity upward
      if (!isLast) {
        const tOut = t0 + IN_DUR + HOLDS[i];
        tl.to(wordEl,
          { yPercent: -110, opacity: 0, duration: OUT_DUR, ease: 'power3.in', force3D: true },
          tOut
        );
        tl.to(langEl,
          { opacity: 0, y: -6, duration: OUT_DUR * 0.7, ease: 'power2.in', force3D: true },
          tOut
        );
      }
    });
  });
}
