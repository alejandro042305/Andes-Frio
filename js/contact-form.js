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

  const fields = Array.from(form.querySelectorAll("input, select, textarea")).filter((field) =>
    field.closest(".form-field")
  );
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

    const formData = new FormData(form);
    formData.set("subject", `Solicitud de cotización — ${formData.get("nombre") || ""}`);

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Enviando...";
    }
    if (note) {
      note.textContent = "Enviando...";
      note.className = "form-note";
    }

    fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          window.location.href = "/gracias.html";
          return;
        }
        throw new Error(result.message || "Error desconocido");
      })
      .catch(() => {
        if (note) {
          note.textContent = "No pudimos enviar el mensaje. Intenta de nuevo o escríbenos por WhatsApp.";
          note.className = "form-note is-error";
        }
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Enviar mensaje";
        }
      });
  });
}
