const selectElemento = document.getElementById('selectElemento');
const selectElementoPadre = document.getElementById('selectElementoPadre');

fetch('actualizar.php?action=obtenerEstructura')
    .then(response => response.json())
    .then(data => {
        data.forEach(especialidad => {
            llenarMenuDesplegableActualizar(especialidad);
            llenarMenuDesplegableCrear(especialidad);
        });
    });

function llenarMenuDesplegableActualizar(elemento, nivel = 0) {
    const opcion = document.createElement('option');
    opcion.value = elemento.nombre;
    opcion.textContent = Array(nivel + 1).join('--') + ' ' + elemento.nombre;
    selectElemento.appendChild(opcion);

    if (elemento.elementos) {
        elemento.elementos.forEach(componente => {
            llenarMenuDesplegableActualizar(componente, nivel + 1);
        });
    } else if (elemento.componentes) {
        const optGroup = document.createElement('optgroup');
        optGroup.label = elemento.nombre;
        elemento.componentes.forEach(el => {
            const opcionElemento = document.createElement('option');
            opcionElemento.value = el.nombre;
            opcionElemento.textContent = Array(nivel + 2).join('--') + ' ' + el.nombre;
            optGroup.appendChild(opcionElemento);
        });
        selectElemento.appendChild(optGroup);
    }
}

function llenarMenuDesplegableCrear(elemento, nivel = 0) {
    const opcion = document.createElement('option');
    opcion.value = elemento.nombre;
    opcion.textContent = Array(nivel + 1).join('--') + ' ' + elemento.nombre;
    selectElementoPadre.appendChild(opcion);

    if (elemento.elementos) {
        elemento.elementos.forEach(componente => {
            llenarMenuDesplegableCrear(componente, nivel + 1);
        });
    }
}

function actualizarValor() {
    const nuevoValor = document.getElementById('nuevoValorActualizar').value;
    const elementoSeleccionado = selectElemento.value;

    const datos = {
        accion: 'actualizar',
        elemento: elementoSeleccionado,
        nuevoValor: nuevoValor
    };

    fetch('actualizar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(datos).toString()
    })
    .then(response => {
        if (response.ok) {
            alert('Valor actualizado correctamente');
        } else {
            alert('Error al actualizar el valor');
        }
    })
    .catch(error => {
        alert('Error en la solicitud: ' + error);
    });
}

function crearElemento() {
    const nuevoElemento = document.getElementById('nuevoElemento').value;
    const nuevoValor = document.getElementById('nuevoValorCrear').value;
    const rutaPadre = selectElementoPadre.value;

    const datos = {
        accion: 'crear',
        rutaPadre: rutaPadre,
        nuevoElemento: nuevoElemento,
        nuevoValor: nuevoValor
    };

    fetch('actualizar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(datos).toString()
    })
    .then(response => {
        if (response.ok) {
            alert('Elemento creado correctamente');
            window.location.reload(); // Recarga la página para actualizar los menús desplegables
        } else {
            alert('Error al crear el elemento');
        }
    })
    .catch(error => {
        alert('Error en la solicitud: ' + error);
    });
}