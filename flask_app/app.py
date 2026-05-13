from flask import Flask, render_template, redirect, url_for
from database.db import get_ultimos_5_miembros

UPLOAD_FOLDER = 'static/uploads'

app = Flask(__name__)


app.secret_key = "s3cr3t_k3y"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    ultimos_miembros = get_ultimos_5_miembros()
    return render_template('index.html', miembros=ultimos_miembros)

@app.route('/registro')
def registro():
    return render_template('registro.html')

@app.route('/listado')        
def listado():
    return render_template('listado.html')

@app.route('/estadisticas')   
def estadisticas():
    return render_template('estadisticas.html')