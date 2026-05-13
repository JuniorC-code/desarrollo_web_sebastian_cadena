import re

def validate_nombre(nombre):
    return len(nombre.strip()) >= 3


def validate_email(email):
    email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return re.match(email_regex, email)


def validate_telefono(telefono):
    telefono_regex = r"^\+?[0-9]{8,15}$"
    return re.match(telefono_regex, telefono)


def validate_duracion(duracion):
    duracion_regex = r"^\d{2}:\d{2}$"
    return re.match(duracion_regex, duracion)


def validate_actividad_nombre(nombre):
    return len(nombre.strip()) >= 3


def validate_foto(foto):
    if foto.filename == "":
        return False

    allowed_extensions = (
        ".png",
        ".jpg",
        ".jpeg",
        ".gif"
    )

    filename = foto.filename.lower()

    return filename.endswith(allowed_extensions)


def validate_register_data(nombre,email,telefono,duracion,actividad_nombre,foto):
    errors = []
    if not validate_nombre(nombre):
        errors.append("El nombre debe tener al menos 3 caracteres.")
    if not validate_email(email):
        errors.append("El correo electrónico no es válido.")
    if not validate_telefono(telefono):
        errors.append("El teléfono no es válido.")
    if not validate_duracion(duracion):
        errors.append("La duración debe tener formato HH:MM.")
    if not validate_actividad_nombre(actividad_nombre):
        errors.append("El nombre de la actividad es muy corto.")
    if not validate_foto(foto):
        errors.append("La foto debe ser PNG, JPG, JPEG o GIF.")

    return errors