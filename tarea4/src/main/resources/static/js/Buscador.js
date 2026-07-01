// Capturamos los elementos del DOM (HTML)
const inputBusqueda = document.getElementById('input-busqueda');
const contenedorResultados = document.getElementById('contenedor-resultados');

// Escuchamos las pulsaciones del teclado mediante el evento 'input'
inputBusqueda.addEventListener('input', function(evento) {
    const texto = evento.target.value.trim(); // Limpia espacios en blanco iniciales/finales

    // Regla del enunciado: Mínimo 3 caracteres para disparar la búsqueda
    if (texto.length >= 3) {
        
        // Llamada asíncrona (Fetch) hacia nuestro ApiController del Backend
        fetch(`/api/buscar/${encodeURIComponent(texto)}`)
            .then(response => response.json()) // Convierte la respuesta JSON pura a un objeto JS
            .then(resultado => {
                // Pasamos la lista (resultado.data) y el texto buscado a la función de dibujo
                renderizarResultados(resultado.data, texto);
            })
            .catch(error => {
                console.error("Error en la petición asíncrona:", error);
            });

    } else {
        // Si hay menos de 3 caracteres (o borró el texto), limpiamos la pantalla
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
        
        // --- NUEVOS DATOS SOLICITADOS ---
        // Obtenemos la nota promedio calculada en el backend (devuelve "-" si no hay notas)
        const notaPromedio = act.notaPromedio || '-';
        // Contamos cuántas evaluaciones tiene en total esta actividad
        const totalNotas = act.notas ? act.notas.length : 0;

        const nombreResaltado = resaltarTexto(nombre, textoBuscado);
        const descResaltada = resaltarTexto(descripcion, textoBuscado);
        const comunaResaltada = resaltarTexto(comuna, textoBuscado);

        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-actividad';
        
        // Mantenemos la estructura de tu HTML original agregando la información de evaluación abajo
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

// Función con Expresión Regular para envolver las coincidencias en etiquetas <mark>
function resaltarTexto(textoOriginal, textoABuscar) {
    if (!textoOriginal) return '';
    
    // 'g' = global (todas las apariciones), 'i' = case-insensitive (ignora mayúsculas/minúsculas)
    const regex = new RegExp(`(${textoABuscar})`, 'gi');
    
    // Reemplaza reteniendo el formato original del texto usando el grupo capturado ($1)
    return textoOriginal.replace(regex, '<mark>$1</mark>');
}


function enviarEvaluacion(actividadId) {
    const select = document.getElementById(`select-nota-${actividadId}`);
    const notaSeleccionada = select.value;

    // Validación en el frontend antes de enviar
    if (!notaSeleccionada) {
        alert("Por favor, selecciona una nota entre 1 y 7.");
        return;
    }

    // Usamos FormData para enviar los parámetros que espera el @RequestParam de Java
    const datos = new FormData();
    datos.append("actividadId", actividadId);
    datos.append("nota", notaSeleccionada);

    // Llamada asíncrona mediante POST
    fetch('/api/actividades/evaluar', {
        method: 'POST',
        body: datos
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // ¡Magia! Recalculamos y actualizamos la interfaz inmediatamente sin recargar
            document.getElementById(`nota-val-${actividadId}`).innerText = data.nuevaNotaPromedio;
            document.getElementById(`nota-count-${actividadId}`).innerText = data.totalNotas;
            
            // Limpiamos el selector
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