from datetime import datetime

from flask import Flask, render_template, redirect, url_for, request, jsonify
from database.db import create_actividad, create_foto, create_miembro, get_comunas, get_miembros_page, get_todos_los_miembros, get_ultimos_5_miembros, get_actividades
from utils.validations import validate_register_data

from collections import defaultdict
import json

UPLOAD_FOLDER = 'static/uploads'

app = Flask(__name__)


app.secret_key = "s3cr3t_k3y"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    ultimos_miembros = get_ultimos_5_miembros()
    return render_template('index.html', miembros=ultimos_miembros)

@app.route('/registro', methods=['GET', 'POST'])
def registro():
    comunas = get_comunas()
    if request.method == "POST":
        nombre = request.form["nombre"].strip()
        email = request.form["email"].strip()
        telefono = request.form["telefono"].strip()
        comuna_id = request.form["comuna_id"]
        dia = request.form["dia"]
        hora_inicio = request.form["hora_inicio"]
        duracion = request.form["duracion"]
        tipo = request.form["tipo"]
        actividad_nombre = request.form["actividad_nombre"].strip()
        descripcion = request.form["descripcion"].strip()
        foto = request.files["foto"]

        errors = validate_register_data(nombre,email,telefono,duracion,actividad_nombre,foto)

        if len(errors) == 0:

            fecha_registro = datetime.now()
            miembro_id = create_miembro(nombre,email,telefono,fecha_registro,comuna_id)
            actividad_id = create_actividad(miembro_id,dia,hora_inicio,duracion,tipo,actividad_nombre,descripcion)
            ruta_archivo = f"static/uploads/{foto.filename}"
            foto.save(ruta_archivo)
            create_foto(ruta_archivo,foto.filename,actividad_id)
            return redirect(url_for("index"))

        # Si hay errores, se vuelven a mostrar en el formulario
        return render_template("registro.html", comunas=comunas, errors=errors)
    if request.method == "GET":
        return render_template("registro.html", comunas=comunas)

@app.route('/listado')        
def listado():
    page = request.args.get("page", 1, type=int)
    miembros, total = get_miembros_page(page)
    per_page = 5
    total_pages = total // per_page
    if total % per_page != 0:
        total_pages += 1
    return render_template( "listado.html", miembros=miembros, page=page, total_pages=total_pages )


@app.route('/estadisticas')   
def estadisticas():
    return render_template('estadisticas.html')

# Ruta para obtener datos de las estadísticas desde la db c:

@app.route('/api/estadisticas')
def api_estadisticas():

    # Gráfico 1
    todos_miembros = get_todos_los_miembros()

    conteo_dias = defaultdict(int)

    for miembro in todos_miembros:
        dia = miembro.fecha_registro.strftime("%Y-%m-%d")
        conteo_dias[dia] += 1

    miembros_por_dia = [
        {
            "dia": dia,
            "total": total
        }
        for dia, total in sorted(conteo_dias.items())
    ]

    # Gráfico 2
    actividades = get_actividades()

    conteo_tipo = defaultdict(int)

    for actividad in actividades:
        conteo_tipo[actividad.tipo] += 1

    actividades_por_tipo = [
        {
            "tipo": tipo,
            "total": total
        }
        for tipo, total in conteo_tipo.items()
    ]

    # Gráfico 3
    conteo_comuna = defaultdict(int)

    for miembro in todos_miembros:
        for actividad in miembro.actividades:
            conteo_comuna[miembro.comuna.nombre] += 1

    actividades_por_comuna = [
        {
            "comuna": comuna,
            "total": total
        }
        for comuna, total in sorted(
            conteo_comuna.items(),
            key=lambda x: x[1],
            reverse=True
        )
    ]

    return jsonify({
        "miembros_por_dia": miembros_por_dia,
        "actividades_por_tipo": actividades_por_tipo,
        "actividades_por_comuna": actividades_por_comuna
    })