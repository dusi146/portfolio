export function initLiveClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  const updateClock = () => {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    clockEl.textContent = `ĐÀ NẴNG ${now.toLocaleTimeString('en-GB', options)} (GMT+7)`;
  };

  updateClock();
  setInterval(updateClock, 1000);
}
