import { initNav } from "./nav.js?v=2";
import { initContactForm } from "./contact-form.js?v=2";
import { initScrollReveal } from "./scroll-reveal.js?v=2";
import { initScrollHeader } from "./scroll-header.js?v=2";
import { initCounters } from "./counter.js?v=2";

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initNav();
  initContactForm();
  initScrollReveal();
  initScrollHeader();
  initCounters();
});
