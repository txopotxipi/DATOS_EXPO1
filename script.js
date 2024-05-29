// Obtener los datos desde el archivo JSON
let datos;
fetch('datos.json')
  .then(response => response.json())
  .then(data => {
    datos = data;
    crearMenuAcordeon();
  })
  .catch(error => {
    console.error('Error al cargar el archivo JSON:', error);
  });

function crearMenuAcordeon() {
  const menuAcordeon = document.getElementById('menu-acordeon');
  const titulo = document.getElementById('titulo');
  titulo.textContent = datos.titulo;

  datos.especialidades.forEach(especialidad => {
    if (especialidad.esTitulo) {
      const tituloElemento = document.createElement('h2');
      tituloElemento.textContent = especialidad.nombre;
      tituloElemento.style.backgroundColor = 'white';
      tituloElemento.style.pointerEvents = 'none';
      menuAcordeon.appendChild(tituloElemento);
    } else {
      const acordeonItem = document.createElement('div');
      acordeonItem.classList.add('acordeon-item');

      const acordeonTitulo = document.createElement('div');
      acordeonTitulo.classList.add('acordeon-titulo');
      acordeonTitulo.innerHTML = `${especialidad.nombre} - ${especialidad.valor} <i class="fas fa-chevron-down"></i>`;
      if (especialidad.nombre === "UNIFORMIDADES DE LA MUJER") {
        acordeonTitulo.classList.add('titulo-destacado');
      }

      acordeonTitulo.addEventListener('click', () => {
        const contenido = acordeonTitulo.nextElementSibling;
        const icon = acordeonTitulo.querySelector('.fas');
        if (contenido.style.display === 'none' || !contenido.style.display) {
          contenido.style.display = 'block';
          icon.classList.add('active');
        } else {
          contenido.style.display = 'none';
          icon.classList.remove('active');
        }
      });

      const acordeonContenido = document.createElement('div');
      acordeonContenido.classList.add('acordeon-contenido');

      especialidad.elementos.forEach(elemento => {
        const subAcordeonItem = document.createElement('div');
        subAcordeonItem.classList.add('sub-acordeon-item');

        const subAcordeonTitulo = document.createElement('div');
        subAcordeonTitulo.classList.add('acordeon-titulo');
        subAcordeonTitulo.textContent = `${elemento.nombre} - ${elemento.valor || ''}`;

        subAcordeonTitulo.addEventListener('click', () => {
          const contenido = subAcordeonTitulo.nextElementSibling;
          if (contenido.style.display === 'none' || !contenido.style.display) {
            contenido.style.display = 'block';
          } else {
            contenido.style.display = 'none';
          }
        });

        const subAcordeonContenido = document.createElement('div');
        subAcordeonContenido.classList.add('acordeon-contenido');

        elemento.componentes.forEach(componente => {
          const componenteItem = document.createElement('div');
          componenteItem.textContent = `${componente.nombre} - ${componente.valor}`;
          subAcordeonContenido.appendChild(componenteItem);
        });

        subAcordeonItem.appendChild(subAcordeonTitulo);
        subAcordeonItem.appendChild(subAcordeonContenido);
        acordeonContenido.appendChild(subAcordeonItem);
      });

      acordeonItem.appendChild(acordeonTitulo);
      acordeonItem.appendChild(acordeonContenido);
      menuAcordeon.appendChild(acordeonItem);
    }
  });
}