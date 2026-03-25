propuesta de estructura de carpetas


CONSULTORIA-EMPRESARIAL/
│
├── index.html                        # HOME - Hero, servicios destacados, CTA, footer
├── services.html                     # SERVICIOS - Listado de servicios en tarjetas
├── service-detail-consulting.html    # DETALLE - Consultoría Empresarial
├── service-detail-web.html           # DETALLE - Desarrollo Web
├── contact.html                      # CONTACTO - Info + formulario
│
├── css/
│   ├── global.css                    # Variables CSS, reset, tipografía, colores
│   ├── components.css                # Navbar, footer, botones, tarjetas (reutilizables)
│   ├── index.css                     # Estilos exclusivos del HOME
│   ├── services.css                  # Estilos exclusivos del listado de servicios
│   ├── service-detail.css            # Estilos exclusivos de las páginas de detalle
│   └── contact.css                   # Estilos exclusivos de contacto
│
├── js/
│   ├── main.js                       # Navbar activo, footer, utilidades compartidas
│   ├── index.js                      # Lógica del HOME (carga servicios destacados)
│   ├── services.js                   # Renderiza tarjetas desde services.json
│   ├── service-detail.js             # Detalle del servicio + favoritos (toggle) + pre-fill contacto
│   └── contact.js                    # Validación del formulario + mensaje de éxito
│
├── data/
│   ├── services.json                 # Datos de todos los servicios (id, nombre, descripción, imagen, features)
│   └── contact.json                  # Info de contacto (email, teléfono, dirección, horarios)
│
└── assets/
    ├── images/
    ├── icons/                        # Íconos SVG (email, teléfono, ubicación, favoritos...)
    └── fonts/                        # Fuentes locales (si aplica)