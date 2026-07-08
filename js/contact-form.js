const CONTACT_EMAIL = "andesfriocolombia@gmail.com";

function setFieldError(field, message) {
  const wrapper = field.closest(".form-field");
  const errorEl = wrapper.querySelector(".form-error");
  if (message) {
    wrapper.classList.add("has-error");
    if (errorEl) errorEl.textContent = message;
    field.setAttribute("aria-invalid", "true");
  } else {
    wrapper.classList.remove("has-error");
    field.removeAttribute("aria-invalid");
  }
}

function validateField(field) {
  if (field.type === "checkbox") {
    if (field.required && !field.checked) {
      setFieldError(field, "Debes aceptar el tratamiento de datos.");
      return false;
    }
    setFieldError(field, "");
    return true;
  }

  if (field.required && !field.value.trim()) {
    setFieldError(field, "Este campo es obligatorio.");
    return false;
  }

  if (field.type === "email" && field.value && !/^\S+@\S+\.\S+$/.test(field.value)) {
    setFieldError(field, "Ingresa un correo electrónico válido.");
    return false;
  }

  if (field.type === "tel" && field.value && !/^[\d\s()+-]{7,}$/.test(field.value)) {
    setFieldError(field, "Ingresa un teléfono válido.");
    return false;
  }

  setFieldError(field, "");
  return true;
}

function prefillFromQuery(form) {
  const params = new URLSearchParams(location.search);
  const interest = params.get("equipo") || params.get("servicio") || params.get("interes");
  if (!interest) return;
  const interestField = form.querySelector('[name="interes"]');
  if (!interestField) return;

  const normalized = interest.toLowerCase();
  const match = Array.from(interestField.options).find((option) =>
    normalized.includes(option.value)
  );
  if (match) interestField.value = match.value;

  const messageField = form.querySelector('[name="mensaje"]');
  if (messageField && !messageField.value) {
    messageField.value = `Hola, quiero más información sobre: ${interest.replace(/-/g, " ")}.`;
  }
}

export function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  prefillFromQuery(form);

  const fields = Array.from(form.querySelectorAll("input, select, textarea"));
  const note = form.querySelector("[data-form-note]");

  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    const liveEvent = field.type === "checkbox" ? "change" : "input";
    field.addEventListener(liveEvent, () => {
      if (field.closest(".form-field").classList.contains("has-error")) {
        validateField(field);
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const allValid = fields.map(validateField).every(Boolean);

    if (!allValid) {
      if (note) {
        note.textContent = "Por favor corrige los campos marcados antes de enviar.";
        note.className = "form-note is-error";
      }
      return;
    }

    const data = new FormData(form);
    const lines = [
      `Nombre: ${data.get("nombre") || ""}`,
      `Empresa: ${data.get("empresa") || ""}`,
      `Email: ${data.get("email") || ""}`,
      `Teléfono: ${data.get("telefono") || ""}`,
      `Ciudad: ${data.get("ciudad") || ""}`,
      `Servicio de interés: ${data.get("interes") || ""}`,
      "",
      data.get("mensaje") || "",
    ];
    const subject = encodeURIComponent(`Solicitud de cotización — ${data.get("nombre") || ""}`);
    const body = encodeURIComponent(lines.join("\n"));

    // TODO: reemplazar por integración con un proveedor de formularios (ej. Formspree)
    // cuando el sitio esté desplegado con conexión a internet.
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    if (note) {
      note.textContent = "Se abrió tu cliente de correo con el mensaje listo para enviar. ¡Gracias por contactarnos!";
      note.className = "form-note is-success";
    }
    form.reset();
  });
}
