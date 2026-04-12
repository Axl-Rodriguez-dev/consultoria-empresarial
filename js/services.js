/**
 * services.js
 * Lógica del catálogo de servicios:
 *  - Carga dinámica de servicios desde data/services.json
 *  - Renderizado de tarjetas (cards) en el grid
 *  - Toggle de favoritos persistido en localStorage
 *  - Filtro de búsqueda en tiempo real
 *
 * Autores: Equipo Front-end — Politécnico Grancolombiano 2026
 */

// ─── Constante de clave para localStorage ────────────────────────────────────
const FAVORITES_KEY = "ce_favoritos";

// ─── Utilidades de favoritos ─────────────────────────────────────────────────

/**
 * Obtiene los slugs guardados como favoritos desde localStorage.
 * @returns {string[]}
 */
function obtenerFavoritos() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Guarda el array actualizado de favoritos en localStorage.
 * @param {string[]} favoritos
 */
function guardarFavoritos(favoritos) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritos));
}

/**
 * Verifica si un slug está en favoritos.
 * @param {string} slug
 * @returns {boolean}
 */
function esFavorito(slug) {
  return obtenerFavoritos().includes(slug);
}

/**
 * Agrega o quita un slug de favoritos (toggle).
 * @param {string} slug
 * @returns {boolean} true si quedó como favorito, false si fue eliminado
 */
function toggleFavorito(slug) {
  const favoritos = obtenerFavoritos();
  const index = favoritos.indexOf(slug);
  if (index === -1) {
    favoritos.push(slug);
    guardarFavoritos(favoritos);
    return true;
  } else {
    favoritos.splice(index, 1);
    guardarFavoritos(favoritos);
    return false;
  }
}

// ─── Renderizado de tarjetas ──────────────────────────────────────────────────

/**
 * Construye el HTML de una tarjeta de servicio.
 * @param {Object} servicio - Objeto con los datos del servicio
 * @returns {HTMLElement}
 */
function crearTarjeta(servicio) {
  const esFav = esFavorito(servicio.slug);

  // Contenedor de la tarjeta
  const card = document.createElement("article");
  card.className = "service-card";
  card.dataset.slug = servicio.slug;
  card.dataset.nombre = servicio.nombre.toLowerCase();

  card.innerHTML = `
    <!-- Imagen del servicio -->
    <div class="card-img-wrapper">
      <img
        class="card-img"
        src="${servicio.imagen}"
        alt="${servicio.nombre}"
        loading="lazy"
        onerror="this.src='https://via.placeholder.com/400x220?text=Servicio'"
      />
      <!-- Botón de favorito sobre la imagen -->
      <button
        class="btn-fav ${esFav ? "btn-fav--active" : ""}"
        data-slug="${servicio.slug}"
        aria-label="${esFav ? "Quitar de favoritos" : "Agregar a favoritos"}"
        aria-pressed="${esFav}"
        title="Favoritos"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
          viewBox="0 0 24 24"
          fill="${esFav ? "currentColor" : "none"}"
          stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round"
          aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    </div>

    <!-- Cuerpo de la tarjeta -->
    <div class="card-body">
      <span class="card-category">${servicio.categoria || "Servicio"}</span>
      <h2 class="card-title">${servicio.nombre}</h2>
      <p class="card-desc">${servicio.descripcion}</p>

      <div class="card-actions">
        <a class="btn btn-primary" href="${servicio.slug}.html">
          <span>Ver más</span>
          <span class="btn-icon" aria-hidden="true">→</span>
        </a>
        <a class="btn btn-secondary" href="contact.html?servicio=${servicio.slug}">
          Contactar
        </a>
      </div>
    </div>
  `;

  // ── Evento toggle favorito ────────────────────────────────────────────────
  const btnFav = card.querySelector(".btn-fav");
  btnFav.addEventListener("click", (e) => {
    e.preventDefault();
    const ahora = toggleFavorito(servicio.slug);

    // Actualizar atributos de accesibilidad
    btnFav.setAttribute("aria-pressed", ahora);
    btnFav.setAttribute("aria-label", ahora ? "Quitar de favoritos" : "Agregar a favoritos");

    // Actualizar ícono (relleno o vacío)
    const svgPath = btnFav.querySelector("path");
    if (svgPath) svgPath.setAttribute("fill", ahora ? "currentColor" : "none");

    // Actualizar clase visual
    btnFav.classList.toggle("btn-fav--active", ahora);

    // Feedback visual breve
    btnFav.classList.add("btn-fav--pulse");
    setTimeout(() => btnFav.classList.remove("btn-fav--pulse"), 400);
  });

  return card;
}

// ─── Filtro de búsqueda ───────────────────────────────────────────────────────

/**
 * Filtra las tarjetas visibles según el texto ingresado.
 * @param {string} texto
 */
function filtrarServicios(texto) {
  const cards = document.querySelectorAll(".service-card");
  const noResults = document.getElementById("noResults");
  const query = texto.toLowerCase().trim();
  let visibles = 0;

  cards.forEach((card) => {
    const nombre = card.dataset.nombre || "";
    const coincide = nombre.includes(query);
    card.hidden = !coincide;
    if (coincide) visibles++;
  });

  if (noResults) noResults.hidden = visibles > 0;
}

// ─── Carga principal ──────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("servicesGrid");
  const filterInput = document.getElementById("filterInput");

  // Filtro en tiempo real
  if (filterInput) {
    filterInput.addEventListener("input", () => filtrarServicios(filterInput.value));
  }

  try {
    // Cargar datos desde el JSON del proyecto
    const response = await fetch("./data/services.json");
    if (!response.ok) throw new Error("No se pudo cargar services.json");
    const servicios = await response.json();

    // Limpiar skeletons y renderizar tarjetas
    grid.innerHTML = "";

    if (!servicios || servicios.length === 0) {
      grid.innerHTML = `<p class="no-results">No hay servicios disponibles en este momento.</p>`;
      return;
    }

    servicios.forEach((servicio) => {
      const tarjeta = crearTarjeta(servicio);
      grid.appendChild(tarjeta);
    });

  } catch (error) {
    // Si falla la carga del JSON, mostrar mensaje de error
    console.error("Error al cargar servicios:", error);
    grid.innerHTML = `
      <p class="no-results">
        ⚠️ No fue posible cargar los servicios. Verifica que el archivo
        <code>data/services.json</code> exista y sea accesible.
      </p>
    `;
  }
});
