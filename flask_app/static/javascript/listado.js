function toggleDetalle(id){
    let detalle =
        document.getElementById(
            `detalle-${id}`
        );

    if(detalle.style.display === "table-row"){
        detalle.style.display = "none";
    }
    else{
        detalle.style.display = "table-row";
    }
}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        let volverbtn =
            document.getElementById(
                "volver-btn"
            );

        if(volverbtn){
            volverbtn.addEventListener(
                "click",
                () => {
                    window.location.href = "/";
                }
            );
        }

        document
        .querySelectorAll(".comentario-form")
        .forEach(form => {

            form.addEventListener(
                "submit",
                function(e){

                    e.preventDefault();

                    let actividadId =
                        this.dataset.actividad;

                    let formData =
                        new FormData(this);

                    formData.append(
                        "actividad_id",
                        actividadId
                    );

                    fetch(
                        "/agregar-comentario",
                        {
                            method: "POST",
                            body: formData
                        }
                    )
                    .then(response => response.json())
                    .then(data => {

                        let errores =
                            this.querySelector(
                                ".errores"
                            );

                        errores.innerHTML = "";

                        if(!data.success){

                            data.errores.forEach(
                                error => {
                                    errores.innerHTML +=
                                        `<p>${error}</p>`;
                                }
                            );

                            return;
                        }

                        alert(
                            "Comentario agregado correctamente"
                        );

                        this.reset();
                    });
                }
            );
        });
    }
);