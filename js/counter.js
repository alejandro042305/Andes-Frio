export function initCounters() {
  const targets = document.querySelectorAll("[data-count-target]");
  if (!targets.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animate(el) {
    const target = parseInt(el.dataset.countTarget, 10);
    const prefix = el.dataset.countPrefix || "";

    if (reduceMotion || !("requestAnimationFrame" in window)) {
      el.textContent = `${prefix}${target}`;
      return;
    }

    const duration = 1200;
    const start = performance.now();

    function step(now) {
      const elapsed = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const value = Math.round(target * eased);
      el.textContent = `${prefix}${value}`;
      if (elapsed < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  if (!("IntersectionObserver" in window)) {
    targets.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  targets.forEach((el) => observer.observe(el));
}
