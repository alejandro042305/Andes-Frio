import { initNav } from "./nav.js";
import { initContactForm } from "./contact-form.js";
import { initScrollReveal } from "./scroll-reveal.js";
import { initScrollHeader } from "./scroll-header.js";
import { initCounters } from "./counter.js";

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initNav();
  initContactForm();
  initScrollReveal();
  initScrollHeader();
  initCounters();
});
