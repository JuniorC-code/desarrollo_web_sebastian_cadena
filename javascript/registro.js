const validateName = (name) => {
    if (!name) return false;
    let lengthValid = name.trim().length >= 6;
    return lengthValid;
};

const validateAge = (age) => {
    if (!age) return false;
    let lengthValid = age <= 120;
    let isnumber = !isNaN(age);
    return lengthValid && isnumber;
};

const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return false;
  // validación de longitud
  let lengthValid = phoneNumber.length >= 8;

  // validación de formato
  let re = /^[0-9]+$/;
  let formatValid = re.test(phoneNumber);

  // devolvemos la lógica AND de las validaciones.
  return lengthValid && formatValid;
};

const validateEmail = (email) => {
    if (!email) return false;
    let lengthValid = email.length > 15;

    // validamos el formato
    let re = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    let formatValid = re.test(email);

    // devolvemos la lógica AND de las validaciones.
    return lengthValid && formatValid;
};

const validatePassword = (password) => {
    if (!password) return false;
    let lengthValid = password.length >= 8;
    return lengthValid;
}

const validatetipo = (select) => {
    if (!select) return;
    return true
}

const validarRegistro = () =>{
    let myform = document.forms['registro-form'];
    let nombre = myform['name'].value;
    let edad = myform['age'].value;
    let telefono = myform['telefono'].value;
    let username = myform['username'].value;
    let email = myform['email'].value;
    let password = myform['password'].value;
    let tipo_user = myform['tipo'].value;


    let invalidInputs = [];
    let isValid = true;
    const setInvalidInput = (inputName) => {
    invalidInputs.push(inputName);
    isValid &&= false;
    };
    
    if (!validateName(nombre)){
        setInvalidInput("Nombre Completo")
    }

    if (!validateAge(edad)){
        setInvalidInput("Edad")
    }

    if (!validatePhoneNumber(telefono)){
        setInvalidInput("Telefono")
    }

    if(!validateName(username)){
        setInvalidInput("Username")
    }
    if(!validateEmail(email)){
        setInvalidInput("Email")
    }

    if(!validatePassword(password)){
        setInvalidInput("Password")
    }


    if(!validatetipo(tipo_user)){
        setInvalidInput("Tipo de usuario")
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
        window.location.href = "../html/listado.html";
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
      sessionStorage.setItem("username", username);
    }
};


let volverbtn = document.getElementById("volverbtn");
volverbtn.addEventListener("click", () => {
    window.location.href = "../html/index.html";
});


let registroForm = document.getElementById('registro-btn');
registroForm.addEventListener("click",validarRegistro);