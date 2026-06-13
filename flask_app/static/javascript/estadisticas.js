window.addEventListener("load", () => {

    fetch("/api/estadisticas")
        .then(response => response.json())
        .then(data => {

            crearGraficoLineas(
                data.miembros_por_dia
            );

            crearGraficoTorta(
                data.actividades_por_tipo
            );

            crearGraficoBarras(
                data.actividades_por_comuna
            );

        })
        .catch(error => {
            console.error(
                "Error obteniendo estadísticas:",
                error
            );
        });

});


function crearGraficoLineas(datos) {

    let puntos = [];
    let ticks = [];

    datos.forEach((item, index) => {

        puntos.push([
            index,
            item.total
        ]);

        ticks.push([
            index,
            item.dia
        ]);

    });

    $.plot(
        $("#grafico-lineas"),
        [
            {
                data: puntos,
                lines: {
                    show: true
                },
                points: {
                    show: true
                }
            }
        ],
        {
            xaxis: {
                ticks: ticks
            },
            grid: {
                hoverable: true,
                clickable: true
            }
        }
    );
}


function crearGraficoTorta(datos) {

    let pieData = [];

    datos.forEach(item => {

        pieData.push({
            label: item.tipo,
            data: item.total
        });

    });

    $.plot(
        $("#grafico-torta"),
        pieData,
        {
            series: {
                pie: {
                    show: true,
                    radius: 1
                }
            },
            legend: {
                show: true
            }
        }
    );
}


function crearGraficoBarras(datos) {

    let barras = [];
    let ticks = [];

    datos.forEach((item, index) => {

        barras.push([
            index,
            item.total
        ]);

        ticks.push([
            index,
            item.comuna
        ]);

    });

    $.plot(
        $("#grafico-barras"),
        [
            {
                data: barras,
                bars: {
                    show: true,
                    barWidth: 0.6,
                    align: "center"
                }
            }
        ],
        {
            xaxis: {
                ticks: ticks
            },
            grid: {
                hoverable: true,
                clickable: true
            }
        }
    );
}