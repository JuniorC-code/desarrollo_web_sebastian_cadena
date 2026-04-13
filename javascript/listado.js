const actividades = [
  {
    username: "seba",
    dia: "25-03-2026",
    horario: "10:00",
    actividad: "Fútbol",
    foto: "https://via.placeholder.com/50",
    categoria: "Deporte",
    descripcion: "Partido en la cancha"
  },
  {
    username: "ana",
    dia: "26-03-2026",
    horario: "15:00",
    actividad: "Estudio",
    foto: "https://via.placeholder.com/50",
    categoria: "Académico",
    descripcion: "Estudio en biblioteca"
  }
];

let actividadesGuardadas = JSON.parse(sessionStorage.getItem("actividades")) || [];
let actividadesOriginal = [...actividades, ...actividadesGuardadas];



let username = sessionStorage.getItem("username");
let saludo = document.getElementById("saludo");
let informar_actividad_boton = document.getElementById("informar-actividad");
let volverbtn = document.getElementById("volverbtn");

if (username) {
    saludo.innerText = "Bienvenido " + username;
    informar_actividad_boton.hidden = false;
} else {
    saludo.innerText = "Bienvenido";
    informar_actividad_boton.hidden = true;
}

volverbtn.addEventListener("click", () => {
    window.location.href = "../html/index.html";
});
informar_actividad_boton.addEventListener("click", () => {
    window.location.href = "../html/informar_actividad.html";
});









let tabla = document.getElementById("actividades-table");

// encabezado
tabla.innerHTML = `
  <thead>
    <tr>
      <th>Username</th>
      <th>Día</th>
      <th>Horario</th>
      <th>Actividad</th>
      <th>Foto</th>
      <th>Categoría</th>
    </tr>
  </thead>
  <tbody></tbody>
`;



// =======================
// RENDER TABLA
// =======================
const renderTabla = (lista) => {
  let tbody = document.querySelector("#actividades-table tbody");
  tbody.innerHTML = "";

  lista.forEach((act) => {
    let fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${act.username}</td>
      <td>${act.dia}</td>
      <td>${act.horario}</td>
      <td>${act.actividad}</td>
      <td><img src="${act.foto}" width="50"></td>
      <td>${act.categoria}</td>
    `;

    fila.addEventListener("click", () => mostrarDetalle(act));
    tbody.appendChild(fila);
  });
}


const parseFecha = (fechaStr) => {
  let [dia, mes, anio] = fechaStr.split("-");
  return new Date(anio, mes - 1, dia);
};

// =======================
// FILTRO + ORDEN
// =======================
let filtroCategoria = document.getElementById("filtro-categoria");
let ordenar = document.getElementById("ordenar");

const aplicarFiltros = () => {
  let lista = [...actividadesOriginal];

  // filtro por categoría
  let categoria = filtroCategoria.value;
  if (categoria) {
    lista = lista.filter(act => act.categoria === categoria);
  }

  // ordenar
  let criterio = ordenar.value;

  if (criterio === "username") {
    lista.sort((a, b) => a.username.localeCompare(b.username));
  }

  if (criterio === "dia") {
    lista.sort((a, b) => parseFecha(a.dia) - parseFecha(b.dia));
  }

  renderTabla(lista);
}

// eventos
filtroCategoria.addEventListener("change", aplicarFiltros);
ordenar.addEventListener("change", aplicarFiltros);


// =======================
// DETALLE
// =======================
const mostrarDetalle = (act) => {
  let detalle = document.getElementById("detalle");

  detalle.innerHTML = `
    <h2>Detalle de actividad</h2>
    <p><strong>Usuario:</strong> ${act.username}</p>
    <p><strong>Día:</strong> ${act.dia}</p>
    <p><strong>Horario:</strong> ${act.horario}</p>
    <p><strong>Actividad:</strong> ${act.actividad}</p>
    <p><strong>Categoría:</strong> ${act.categoria}</p>
    <p><strong>Descripción:</strong> ${act.descripcion}</p>
    <img src="${act.foto}" width="150">
  `;
}


// =======================
// INICIAL
// =======================
renderTabla(actividadesOriginal);