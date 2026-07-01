// Capturamos los elementos del DOM (HTML)
const inputBusqueda = document.getElementById('input-busqueda');
const contenedorResultados = document.getElementById('contenedor-resultados');


inputBusqueda.addEventListener('input', function(evento) {
    const texto = evento.target.value.trim(); // Limpiar espacios

    // 3 caracts. minimo
    if (texto.length >= 3) {
        fetch(`/api/buscar/${encodeURIComponent(texto)}`)
            .then(response => response.json()) // C
            .then(resultado => {
                renderizarResultados(resultado.data, texto);
            })
            .catch(error => {
                console.error("Error en la petición asíncrona:", error);
            });

    } else {
        // Smenos de 3 -> Limpiar resultados
        contenedorResultados.innerHTML = '';
    }
});


function renderizarResultados(actividades, textoBuscado) {
    contenedorResultados.innerHTML = '';

    if (actividades.length === 0) {
        contenedorResultados.innerHTML = '<p class="mensaje">No se encontraron actividades que coincidan con la búsqueda.</p>';
        return;
    }

    actividades.forEach(act => {
        const nombre = act.nombre || '';
        const descripcion = act.descripcion || '';
        const comuna = (act.miembro && act.miembro.comuna) ? act.miembro.comuna.nombre : 'No especificada';
        const miembro = act.miembro ? act.miembro.nombre : 'Anónimo';
        const dia = act.dia || '';
        const tipo = act.tipo || '';
        
        // 2da parte: obtener nota promedio y total de evaluaciones
        const notaPromedio = act.notaPromedio || '-';
        const totalNotas = act.notas ? act.notas.length : 0;

        const nombreResaltado = resaltarTexto(nombre, textoBuscado);
        const descResaltada = resaltarTexto(descripcion, textoBuscado);
        const comunaResaltada = resaltarTexto(comuna, textoBuscado);

        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-actividad';

        tarjeta.innerHTML = `
            <h3>${nombreResaltado}</h3>
            <p>${descResaltada}</p>
            <div class="meta-info">
                <strong>Comuna:</strong> ${comunaResaltada} | 
                <strong>Organiza:</strong> ${miembro} | 
                <strong>Día:</strong> ${dia} | 
                <strong>Tipo:</strong> ${tipo}
            </div>
            
            <div class="evaluacion-box" style="margin-top: 12px; padding: 10px; background-color: #f0f0f0; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>Nota Promedio:</strong> <span id="nota-val-${act.id}" style="font-weight: bold; color: #007bff;">${notaPromedio}</span>
                    <span style="color: #666; font-size: 13px; margin-left: 5px;">
                        (<span id="nota-count-${act.id}">${totalNotas}</span> evaluaciones)
                    </span>
                </div>
                
                <div class="evaluar-form">
                    <label for="select-nota-${act.id}" style="font-size: 14px; margin-right: 5px;">Evaluar:</label>
                    <select id="select-nota-${act.id}" style="padding: 4px; border-radius: 4px; border: 1px solid #ccc;">
                        <option value="">--</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                    </select>
                    <button onclick="enviarEvaluacion(${act.id})" style="margin-left: 5px; padding: 4px 10px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Guardar
                    </button>
                </div>
            </div>
        `;

        contenedorResultados.appendChild(tarjeta);
    });
}

function resaltarTexto(textoOriginal, textoABuscar) {
    if (!textoOriginal) return '';
    const regex = new RegExp(`(${textoABuscar})`, 'gi');
    return textoOriginal.replace(regex, '<mark>$1</mark>');
}


function enviarEvaluacion(actividadId) {
    const select = document.getElementById(`select-nota-${actividadId}`);
    const notaSeleccionada = select.value;

    if (!notaSeleccionada) {
        alert("Por favor, selecciona una nota entre 1 y 7.");
        return;
    }
    const datos = new FormData();
    datos.append("actividadId", actividadId);
    datos.append("nota", notaSeleccionada);

    fetch('/api/actividades/evaluar', {
        method: 'POST',
        body: datos
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Recalcular!!!
            document.getElementById(`nota-val-${actividadId}`).innerText = data.nuevaNotaPromedio;
            document.getElementById(`nota-count-${actividadId}`).innerText = data.totalNotas;
            select.value = "";
            alert("Nota agregada correctamente.");
        } else {
            alert("Error al guardar la nota: " + data.error);
        }
    })
    .catch(error => {
        console.error("Error en la petición de evaluación:", error);
    });
}