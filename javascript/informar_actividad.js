const validarDia = (dia) => {
  if (!dia) return false;

  let hoy = new Date();
  let fecha = new Date(dia);

  return fecha >= hoy.setHours(0,0,0,0);
};

const validarHorario = (horario) => {
  return !!horario;
};

const validarActividad = (actividad) => {
  return actividad && actividad.trim().length >= 3;
};

const validarCategoria = (categoria) => {
  return !!categoria;
};

const validarDescripcion = (descripcion) => {
  return descripcion && descripcion.trim().length >= 10;
};

const validarFoto = (files) => {
  if (!files || files.length === 0) return false;

  let file = files[0];
  let tipo = file.type.split("/")[0];

  return tipo === "image";
};


const validarFormulario = () => {
  let myform = document.forms["informar-actividad-form"];
  let dia = myform["Dia"].value;
  let horario = myform["horario"].value;
  let actividad = myform["actividad"].value;
  let categoria = myform["categoria"].value;
  let descripcion = myform["descripcion"].value;
  let foto = myform["foto"].files;

  let invalidInputs = [];
  let isValid = true;
  const setInvalidInput = (inputName) => {
  invalidInputs.push(inputName);
  isValid &&= false;
  };

  if (!validarDia(dia)) {
    setInvalidInput("Día (inválido o pasado)");
  }

  if (!validarHorario(horario)) {
    setInvalidInput("Horario");
  }

  if (!validarActividad(actividad)) {
    setInvalidInput("Actividad (mínimo 3 caracteres)");
  }

  if (!validarCategoria(categoria)) {
    setInvalidInput("Categoría");
  }

  if (!validarDescripcion(descripcion)) {
    setInvalidInput("Descripción (mínimo 10 caracteres)");
  }

  if (!validarFoto(foto)) {
    setInvalidInput("Foto (debe ser imagen)");
  }

    let validationBox = document.getElementById("val-box");
    let validationMessageElem = document.getElementById("val-msg");
    let validationListElem = document.getElementById("val-list");
    let formContainer = document.querySelector(".main-container");

    if (!isValid) {
      validationListElem.textContent = "";
      // agregar elementos inválidos al elemento val-list.
      for (input of invalidInputs) {
        let listElement = document.createElement("li");
        listElement.innerText = input;
        validationListElem.append(listElement);
      }
      // establecer val-msg
      validationMessageElem.innerText = "Los siguientes campos son inválidos:";

      validationBox.style.margin = "20px";
      validationBox.style.padding = "20px";
      // aplicar estilos de error
      validationBox.style.backgroundColor = "#ffdddd";
      validationBox.style.borderLeftColor = "#f44336";

      // hacer visible el mensaje de validación
      validationBox.hidden = false;
    } else {
      //Exitoso, se puede guardar la actividad y redirigir al listado
      // Ocultar el formulario
      myform.style.display = "none";

      // establecer mensaje de éxito
      validationMessageElem.innerText = "¡Formulario válido! ¿Deseas enviarlo o volver?";
      validationListElem.textContent = "";

      // aplicar estilos de éxito
      validationBox.style.backgroundColor = "#ddffdd";
      validationBox.style.borderLeftColor = "#4CAF50";

      // Agregar botones para enviar el formulario o volver
      let submitButton = document.createElement("button");
      submitButton.innerText = "Enviar";
      submitButton.style.marginRight = "10px";
      submitButton.addEventListener("click", () => {
          let username = sessionStorage.getItem("username") || "anon";
          let [year, month, day] = dia.split("-");
          let diaFormateado = `${day}-${month}-${year}`;
          let reader = new FileReader();
          reader.onload = () => {
            let nuevaActividad = {
              username: username,
              dia: diaFormateado,
              horario: horario,
              actividad: actividad,
              categoria: categoria,
              descripcion: descripcion,
              foto: reader.result
            };
          
            let actividadesGuardadas = JSON.parse(sessionStorage.getItem("actividades")) || [];
          
            // agregar nueva
            actividadesGuardadas.push(nuevaActividad);
          
            // guardar de vuelta
            sessionStorage.setItem("actividades", JSON.stringify(actividadesGuardadas));
          
            // ir al listado
            window.location.href = "../html/listado.html";
          };
          
          reader.readAsDataURL(foto[0]); 
        });

      let backButton = document.createElement("button");
      backButton.innerText = "Volver";
      backButton.addEventListener("click", () => {
        // Mostrar el formulario nuevamente
        myform.style.display = "block";
        validationBox.hidden = true;
      });

      validationListElem.appendChild(submitButton);
      validationListElem.appendChild(backButton);

      // hacer visible el mensaje de validación
      validationBox.hidden = false;
      
    }
};

let Informar_actividadForm = document.getElementById('informaractividad-btn');
Informar_actividadForm.addEventListener("click", validarFormulario); 