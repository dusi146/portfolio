export function initProtection() {
  // 1. Disable Right Click Context Menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  }, { capture: true });

  // 2. Disable Keyboard Shortcuts:
  // - F12 (DevTools)
  // - Ctrl/Cmd + Shift + I / J / C (DevTools / Console / Inspector)
  // - Ctrl/Cmd + U (View Source)
  // - Ctrl/Cmd + S (Save Page)
  // - Ctrl/Cmd + C (Copy)
  // - Ctrl/Cmd + P (Print)
  document.addEventListener('keydown', (e) => {
    const isMac = navigator.platform && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;
    const key = (e.key || '').toLowerCase();
    const code = e.keyCode || e.which;

    // F12
    if (e.key === 'F12' || code === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    if (modifier) {
      // Ctrl/Cmd + Shift + I / J / C
      if (e.shiftKey && (key === 'i' || key === 'j' || key === 'c' || code === 73 || code === 74 || code === 67)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl/Cmd + U (View Source)
      if (key === 'u' || code === 85) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl/Cmd + S (Save Page)
      if (key === 's' || code === 83) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl/Cmd + C (Copy)
      if (key === 'c' || code === 67) {
        const targetTag = (e.target && e.target.tagName || '').toLowerCase();
        if (targetTag !== 'input' && targetTag !== 'textarea') {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }

      // Ctrl/Cmd + P (Print)
      if (key === 'p' || code === 80) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
  }, { capture: true });

  // 3. Disable Copy & Cut Events
  document.addEventListener('copy', (e) => {
    const targetTag = (e.target && e.target.tagName || '').toLowerCase();
    if (targetTag !== 'input' && targetTag !== 'textarea') {
      e.preventDefault();
      return false;
    }
  }, { capture: true });

  document.addEventListener('cut', (e) => {
    const targetTag = (e.target && e.target.tagName || '').toLowerCase();
    if (targetTag !== 'input' && targetTag !== 'textarea') {
      e.preventDefault();
      return false;
    }
  }, { capture: true });

  // 4. Disable Text Selection via Drag
  document.addEventListener('selectstart', (e) => {
    const targetTag = (e.target && e.target.tagName || '').toLowerCase();
    if (targetTag !== 'input' && targetTag !== 'textarea') {
      e.preventDefault();
      return false;
    }
  }, { capture: true });

  // 5. Disable Native Image Dragging
  document.addEventListener('dragstart', (e) => {
    if (e.target && e.target.nodeName === 'IMG') {
      e.preventDefault();
      return false;
    }
  }, { capture: true });
}
