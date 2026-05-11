let actividadesGuardadas = JSON.parse(sessionStorage.getItem("actividades")) || [];

let actividades = [
  {
    username: "seba",
    dia: "25-03-2026",
    horario: "10:00",
    actividad: "Fútbol",
    foto: "",
    categoria: "Deporte",
    descripcion: ""
  },
  {
    username: "ana",
    dia: "26-03-2026",
    horario: "15:00",
    actividad: "Estudio",
    foto: "",
    categoria: "Académico",
    descripcion: ""
  }
];

let todas = [...actividades, ...actividadesGuardadas];

document.getElementById("total").innerText = todas.length;

const contarPor = (campo) => {
  let conteo = {};

  todas.forEach(act => {
    let valor = act[campo];
    conteo[valor] = (conteo[valor] || 0) + 1;
  });

  return conteo;
};


const crearGrafico = (canvasId, datos, tipo) => {
  let labels = Object.keys(datos);
  let valores = Object.values(datos);

  new Chart(document.getElementById(canvasId), {
    type: tipo, // 'bar' o 'pie'
    data: {
      labels: labels,
      datasets: [{
        label: "Cantidad",
        data: valores
      }]
    }
  });
};


crearGrafico("graficoCategoria", contarPor("categoria"), "pie");
crearGrafico("graficoUsuario", contarPor("username"), "bar");

document.getElementById("volver").addEventListener("click", () => {
  window.location.href = "../html/index.html";
});