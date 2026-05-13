function toggleDetalle(id){
    let detalle = document.getElementById(
        `detalle-${id}`
    );

    if(detalle.style.display === "table-row"){
        detalle.style.display = "none";
    }
    else{
        detalle.style.display = "table-row";
    }
}

volverbtn = document.getElementById("volver-btn");
volverbtn.addEventListener("click", () => {
    window.location.href = "/";
});