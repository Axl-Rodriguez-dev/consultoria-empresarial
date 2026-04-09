// CARGAR DATOS DINÁMICOS
fetch('./data/contact.json')
  .then(res => res.json())
  .then(data => {
    document.getElementById('email').textContent = data.email;
    document.getElementById('telefono').textContent = data.telefono;
    document.getElementById('direccion').textContent = data.direccion;

	document.getElementById('horario').innerHTML = `
	  <p>Lunes - Viernes: ${data.horario.lunes_viernes}</p>
	  <p>Sábado: ${data.horario.sabado}</p>
	  <p>Domingo: ${data.horario.domingo}</p>
	`;
  })
  .catch(error => console.log("Error cargando JSON:", error));
  
 
  document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (!nombre || !email || !mensaje) {
      alert('Completa los campos obligatorios');
      return;
    }

    if (!email.includes('@')) {
      alert('Correo inválido');
      return;
    }

    alert('Mensaje enviado correctamente');
  });
  
  
  