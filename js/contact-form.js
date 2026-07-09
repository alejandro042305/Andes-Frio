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

  const targetFrame = document.querySelector('iframe[name="web3forms-frame"]');
  let submitted = false;

  if (targetFrame) {
    targetFrame.addEventListener("load", () => {
      if (submitted) {
        window.location.href = "gracias.html";
      }
    });
  }

  form.addEventListener("submit", (event) => {
    const allValid = fields.map(validateField).every(Boolean);

    if (!allValid) {
      event.preventDefault();
      if (note) {
        note.textContent = "Por favor corrige los campos marcados antes de enviar.";
        note.className = "form-note is-error";
      }
      return;
    }

    form.querySelector('[name="subject"]')?.remove();
    const subjectField = document.createElement("input");
    subjectField.type = "hidden";
    subjectField.name = "subject";
    subjectField.value = `Solicitud de cotización — ${form.querySelector('[name="nombre"]')?.value || ""}`;
    form.appendChild(subjectField);

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Enviando...";
    }

    submitted = true;
    // El formulario se envía a un iframe oculto; al cargar la respuesta, redirigimos a gracias.html.
    setTimeout(() => {
      if (submitted) window.location.href = "gracias.html";
    }, 4000);
  });
}
