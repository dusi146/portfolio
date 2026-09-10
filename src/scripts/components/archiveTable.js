import gsap from 'gsap';

export function initArchiveTable() {
  const capsule   = document.getElementById('spec-capsule');
  const watermark = document.getElementById('archive-watermark');
  const capTitle  = document.getElementById('cap-title');
  const capMeta   = document.getElementById('cap-meta');
  const rows      = document.querySelectorAll('.archive-row');

  if (!capsule || !rows.length) return;

  let mX = 0, mY = 0, tX = 0, tY = 0, isHov = false;

  window.addEventListener('mousemove', ({ clientX, clientY }) => {
    const capWidth = 340;
    // Edge protection: flip capsule to left if nearing right edge of viewport
    if (clientX + capWidth + 40 > window.innerWidth) {
      mX = clientX - capWidth - 24;
    } else {
      mX = clientX + 32;
    }
    // Prevent capsule from overflowing viewport top or bottom
    mY = Math.max(20, Math.min(window.innerHeight - 220, clientY - 80));
  });

  // Lerp capsule to cursor
  gsap.ticker.add(() => {
    if (!isHov) return;
    tX += (mX - tX) * 0.12;
    tY += (mY - tY) * 0.12;
    gsap.set(capsule, { x: tX, y: tY });
  });

  const specCodeEl = capsule.querySelector('.spec-code');

  rows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      const wm    = row.dataset.watermark || 'WORK';
      const title = row.dataset.title     || '';
      const code  = row.dataset.code      || '';
      const type  = row.dataset.type      || '';
      const desc  = row.dataset.desc      || '';

      // Swap watermark with smooth fade
      if (watermark) {
        gsap.to(watermark, {
          opacity: 0, y: -18, duration: 0.2,
          overwrite: 'auto',
          onComplete: () => {
            watermark.textContent = wm;
            gsap.fromTo(watermark,
              { opacity: 0, y: 18 },
              { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', overwrite: 'auto' }
            );
          },
        });
      }

      // Populate capsule
      if (capTitle) capTitle.textContent = title;
      if (specCodeEl) specCodeEl.textContent = code;
      if (capMeta) capMeta.innerHTML = `
        <div><span style="color:var(--text-faint)">DISCIPLINE //</span> ${type}</div>
        <div><span style="color:var(--text-faint)">SCOPE //</span> ${desc}</div>
        <div><span style="color:var(--gold)">STATUS //</span> COMPLETED</div>
      `;

      isHov = true;
      gsap.to(capsule, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
    });

    row.addEventListener('mouseleave', () => {
      isHov = false;
      gsap.to(capsule, { opacity: 0, scale: 0.88, duration: 0.25, ease: 'power3.in', overwrite: 'auto' });
    });
  });

  // Table mouseleave: restore watermark to 'WORK'
  const table = document.querySelector('.archive-table');
  if (table && watermark) {
    table.addEventListener('mouseleave', () => {
      gsap.to(watermark, {
        opacity: 0, y: -15, duration: 0.25,
        overwrite: 'auto',
        onComplete: () => {
          watermark.textContent = 'WORK';
          gsap.fromTo(watermark,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', overwrite: 'auto' }
          );
        },
      });
    });
  }

  // ── FILTER PILLS ─────────────────────────────────
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.dataset.filter;

      rows.forEach((row) => {
        const cat = row.dataset.category;
        const visible = filter === 'all' || cat === filter;

        gsap.to(row, {
          opacity:  visible ? 1 : 0,
          y:        visible ? 0 : 12,
          duration: 0.45,
          ease:     'power3.out',
          onStart:  () => { if (visible) row.style.display = 'grid'; },
          onComplete: () => { if (!visible) row.style.display = 'none'; },
        });
      });
    });
  });

  // ── ENTRANCE STAGGER for archive rows ───────────
  gsap.fromTo(rows,
    { opacity: 0, y: 24 },
    {
      opacity: 1, y: 0,
      duration: 0.85,
      stagger:  0.07,
      ease:     'power3.out',
      delay:    0.3,
    }
  );
}
