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