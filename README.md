# Andes Frío Industrial — Sitio web

Sitio web estático (HTML/CSS/JS puro, sin build ni frameworks) para una empresa colombiana ficticia de climatización y refrigeración industrial. El nombre de la empresa y los datos de contacto son inventados y deben reemplazarse cuando el cliente real confirme su información.

## Estructura

```
index.html, equipos.html, chillers.html, servicios.html, empresa.html, contacto.html, 404.html
css/        variables.css, base.css, components.css, layout.css, main.css
js/         nav.js, contact-form.js, scroll-reveal.js, scroll-header.js, counter.js, main.js
assets/img/ favicon.svg
```

## Cómo ver el sitio localmente

Los scripts usan módulos ES (`type="module"`), que **no funcionan de forma confiable abriendo los archivos con doble clic** (protocolo `file://`) en algunos navegadores. Sirve la carpeta con un servidor local:

```bash
python -m http.server 8000
```

y abre `http://localhost:8000/index.html`. También funciona con la extensión "Live Server" de VS Code.

## Reemplazar antes de producción

- **Datos de la empresa**: nombre, NIT, dirección, teléfonos, WhatsApp y correos son de ejemplo — están repetidos en el header/footer/JSON-LD de las 7 páginas y en `js/contact-form.js` (`CONTACT_EMAIL`) y los enlaces `wa.me`. Cobertura actual: solo Bogotá.
- **Fotos de equipos**: cada `.img-placeholder` es un espacio reservado con texto `[FOTO — ...]`. Reemplázalo por una etiqueta `<img>` real manteniendo la misma proporción (`aspect-ratio`) para no romper el layout.
- **Formulario de contacto**: actualmente envía vía `mailto:`. Hay un comentario `TODO` en `js/contact-form.js` para migrar a un proveedor de formularios (ej. Formspree) cuando el sitio esté desplegado con conexión a internet.
- **Mapa de contacto**: `contacto.html` ya incluye un `<iframe>` de Google Maps embebido (sin API key) apuntando a "Cra. 106 #71 a 83, Bogotá". Si la dirección cambia, actualiza el parámetro `q=` de la URL del `src` del iframe.
- **Redes sociales**: los íconos de Facebook/Instagram/LinkedIn en el footer enlazan a `#` — actualízalos con las URLs reales.

## Verificación manual sugerida

1. Servir localmente y navegar las 7 páginas desde el menú y el footer.
2. Probar el menú hamburguesa y el responsive en ~360px, 768px, 1024px y 1440px de ancho.
3. Probar el formulario de `contacto.html`: campos vacíos, email/teléfono inválidos, checkbox de datos sin marcar, y envío exitoso.
4. Verificar que el mapa embebido de `contacto.html` carga correctamente (requiere conexión a internet).
5. Revisar accesibilidad y SEO con Lighthouse (DevTools de Chrome).
