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

// Clave para guardar favoritos en localStorage
const FAVORITES_KEY = "ce_favoritos";

// Obtiene los favoritos guardados
function obtenerFavoritos() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

// Verifica si un servicio está en favoritos
function esFavorito(slug) {
  return obtenerFavoritos().includes(slug);
}

// Agrega o quita un servicio de favoritos (toggle)
function toggleFavorito(slug) {
  const favoritos = obtenerFavoritos();
  const index = favoritos.indexOf(slug);
  if (index === -1) {
    favoritos.push(slug);
  } else {
    favoritos.splice(index, 1);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritos));
  return index === -1;
}

// Construye el HTML de cada tarjeta usando los campos reales del JSON
function crearTarjeta(servicio) {
  const esFav = esFavorito(servicio.slug);

  const card = document.createElement("article");
  card.className = "service-card";
  card.dataset.slug = servicio.slug;
  // Usa "name" que es el campo real del JSON
  card.dataset.nombre = servicio.name.toLowerCase();

  card.innerHTML = `
    <div class="card-img-wrapper">
      <img
        class="card-img"
        src="assets/images/${servicio.slug}.jpg"
        alt="${servicio.name}"
        loading="lazy"
        onerror="this.src='https://via.placeholder.com/400x220?text=${servicio.name}'"
      />
      <!-- Botón de favorito -->
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

    <div class="card-body">
      <!-- Usa "name" y "shortDescription" del JSON real -->
      <span class="card-category">${servicio.featured ? "⭐ Destacado" : "Servicio"}</span>
      <h2 class="card-title">${servicio.name}</h2>
      <p class="card-desc">${servicio.shortDescription}</p>

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

  // Evento toggle favorito
  const btnFav = card.querySelector(".btn-fav");
  btnFav.addEventListener("click", (e) => {
    e.preventDefault();
    const ahora = toggleFavorito(servicio.slug);

    btnFav.setAttribute("aria-pressed", ahora);
    btnFav.setAttribute("aria-label", ahora ? "Quitar de favoritos" : "Agregar a favoritos");

    const svgPath = btnFav.querySelector("path");
    if (svgPath) svgPath.setAttribute("fill", ahora ? "currentColor" : "none");

    btnFav.classList.toggle("btn-fav--active", ahora);

    // Animación breve al hacer clic
    btnFav.classList.add("btn-fav--pulse");
    setTimeout(() => btnFav.classList.remove("btn-fav--pulse"), 400);
  });

  return card;
}

// Filtro de búsqueda en tiempo real
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

// Carga principal
document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("servicesGrid");
  const filterInput = document.getElementById("filterInput");

  // Activar filtro en tiempo real
  if (filterInput) {
    filterInput.addEventListener("input", () =>
      filtrarServicios(filterInput.value)
    );
  }

  try {
    const response = await fetch("./data/services.json");
    if (!response.ok) throw new Error("No se pudo cargar services.json");
    const servicios = await response.json();

    // Limpiar skeletons
    grid.innerHTML = "";

    if (!servicios || servicios.length === 0) {
      grid.innerHTML = `<p class="no-results">No hay servicios disponibles.</p>`;
      return;
    }

    // Renderizar cada tarjeta
    servicios.forEach((servicio) => {
      const tarjeta = crearTarjeta(servicio);
      grid.appendChild(tarjeta);
    });

  } catch (error) {
    console.error("Error al cargar servicios:", error);
    grid.innerHTML = `
      <p class="no-results">
        ⚠️ No fue posible cargar los servicios.
        Verifica que <code>data/services.json</code> exista.
      </p>
    `;
  }
});
