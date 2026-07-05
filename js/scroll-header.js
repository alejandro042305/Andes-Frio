export function initScrollHeader() {
  const header = document.querySelector(".site-header");
  const progress = document.querySelector("[data-scroll-progress]");
  if (!header && !progress) return;

  let ticking = false;

  function update() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    if (header) header.classList.toggle("is-scrolled", scrollY > 8);

    if (progress) {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollHeight > 0 ? (scrollY / scrollHeight) * 100 : 0;
      progress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    }

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  update();
}
