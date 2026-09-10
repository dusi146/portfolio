import gsap from 'gsap';

export function initCurtainReveals() {
  // Email Copy Button (pdt.146@gmail.com)
  const emailBtn = document.querySelector('.email-copy-btn');
  if (emailBtn) {
    // Immediate tactile press feedback on mousedown (before async clipboard)
    emailBtn.addEventListener('mousedown', () => {
      gsap.to(emailBtn, { scale: 0.96, duration: 0.12, ease: 'power2.out', overwrite: true });
    });

    emailBtn.addEventListener('click', () => {
      const email = 'pdt.146@gmail.com';
      navigator.clipboard.writeText(email)
        .then(() => {
          gsap.to(emailBtn, { scale: 1, duration: 0.28, ease: 'back.out(1.7)', overwrite: true });
          const origHTML = emailBtn.innerHTML;
          emailBtn.innerHTML = `<span aria-live="polite">COPIED TO CLIPBOARD ✓</span>`;
          setTimeout(() => {
            emailBtn.innerHTML = origHTML;
          }, 2200);
        })
        .catch(() => {
          // Clipboard unavailable (non-secure context or private mode) — fail silently
          gsap.to(emailBtn, { scale: 1, duration: 0.2, ease: 'power2.out', overwrite: true });
        });
    });
  }
}

