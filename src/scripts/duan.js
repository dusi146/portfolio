import '../styles/duan.css';
import { initSmoothScroll } from './core/smoothScroll.js';
import { initCustomCursor } from './core/cursor.js';
import { initProtection } from './core/protection.js';
import { initArchiveTable } from './components/archiveTable.js';
import { initSplitText } from './components/splitText.js';
import { initKineticTypography } from './components/kineticTypo.js';
import { initMobileScrollProgress } from './components/scrollProgress.js';

function start() {
  initProtection();
  initSmoothScroll();
  initCustomCursor();
  initMobileScrollProgress();
  initSplitText();
  initKineticTypography();
  initArchiveTable();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
