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

// Función que genera dinámicamente las tarjetas en el HTML
function renderizarResultados(actividades, textoBuscado) {
    // Reseteamos el contenedor antes de dibujar los nuevos resultados
    contenedorResultados.innerHTML = '';

    // Si el backend no encontró registros coincidentes
    if (actividades.length === 0) {
        contenedorResultados.innerHTML = '<p class="mensaje">No se encontraron actividades que coincidan con la búsqueda.</p>';
        return;
    }

    // Si hay registros, los iteramos estilo 'for each'
    actividades.forEach(act => {
        // Desestructuración o fallback seguro si algún campo viene nulo desde la DB
        const nombre = act.nombre || '';
        const descripcion = act.descripcion || '';
        const comuna = (act.miembro && act.miembro.comuna) ? act.miembro.comuna.nombre : 'No especificada';
        const miembro = act.miembro ? act.miembro.nombre : 'Anónimo';
        const dia = act.dia || '';
        const tipo = act.tipo || '';

        // Resaltamos las palabras coincidentes usando la función auxiliar
        const nombreResaltado = resaltarTexto(nombre, textoBuscado);
        const descResaltada = resaltarTexto(descripcion, textoBuscado);
        const comunaResaltada = resaltarTexto(comuna, textoBuscado);

        // Construimos el nodo HTML para la tarjeta de la actividad
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
        `;

        // Añadimos la tarjeta al final del contenedor de resultados
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