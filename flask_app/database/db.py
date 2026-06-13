from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime, Enum, Text

from sqlalchemy.orm import joinedload, sessionmaker, declarative_base, relationship

# Configuración de la base de datos
DB_NAME = "tarea2"
DB_USERNAME = "root"
DB_PASSWORD = "admin"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://"f"{DB_USERNAME}:{DB_PASSWORD}"f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

# modelos de la base de datos

class Region(Base):
    __tablename__ = "region"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)

    #Relaciones
    comunas = relationship( "Comuna", back_populates="region", cascade="all, delete")


class Comuna(Base):
    __tablename__ = "comuna"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column( Integer, ForeignKey("region.id"), nullable=False)

    # relaciones
    region = relationship("Region",back_populates="comunas")
    miembros = relationship("Miembro",back_populates="comuna",cascade="all, delete")


class Miembro(Base):
    __tablename__ = "miembro"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    email = Column(String(80), nullable=False)
    telefono = Column(String(15), nullable=False)
    fecha_registro = Column(DateTime, nullable=False)
    comuna_id = Column( Integer, ForeignKey("comuna.id"), nullable=False )

    # relaciones
    comuna = relationship( "Comuna", back_populates="miembros" )
    actividades = relationship("Actividad",back_populates="miembro",cascade="all, delete")


class Actividad(Base):
    __tablename__ = "actividad"

    id = Column(Integer, primary_key=True, autoincrement=True)
    miembro_id = Column( Integer, ForeignKey("miembro.id"), nullable=False )
    dia = Column(
        Enum(
            "lunes",
            "martes",
            "miércoles",
            "jueves",
            "viernes",
            "sábado",
            "domingo"
        ),
        nullable=False
    )
    hora_inicio = Column(String(5), nullable=False)
    duracion = Column(String(5), nullable=False)
    tipo = Column(
        Enum(
            "arte",
            "deporte",
            "tecnología",
            "social",
            "recreación",
            "otra"
        ),
        nullable=False
    )
    nombre = Column(String(45), nullable=False)
    descripcion = Column(Text, nullable=True)

    # relaciones
    miembro = relationship( "Miembro", back_populates="actividades" )
    fotos = relationship( "Foto", back_populates="actividad", cascade="all, delete" )
    comentarios = relationship( "Comentario", back_populates="actividad", cascade="all, delete" )

class Foto(Base):
    __tablename__ = "foto"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    actividad_id = Column( Integer, ForeignKey("actividad.id"), nullable=False )

    # relaciones
    actividad = relationship( "Actividad", back_populates="fotos" )



 # Nuevo modelo para comentarios

class Comentario(Base):
    __tablename__ = "comentario"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(80), nullable=False)
    texto = Column(String(300), nullable=False)
    fecha = Column(DateTime, nullable=False)
    actividad_id = Column(
        Integer,
        ForeignKey("actividad.id"),
        nullable=False
    )

    actividad = relationship(
        "Actividad",
        back_populates="comentarios"
    )    

# =====================================================
# Funciones para trabajar con la base de datos
# =====================================================


# REGIONES

def get_regiones():
    session = SessionLocal()
    regiones = session.query(Region).all()
    session.close()
    return regiones

def get_region_by_id(region_id):
    session = SessionLocal()
    region = (session.query(Region).filter_by(id=region_id).first())
    session.close()
    return region


# COMUNAS

def get_comunas():
    session = SessionLocal()
    comunas = session.query(Comuna).all()
    session.close()
    return comunas

def get_comunas_by_region(region_id):
    session = SessionLocal()
    comunas = (session.query(Comuna).filter_by(region_id=region_id).all())
    session.close()
    return comunas


def get_comuna_by_id(comuna_id):
    session = SessionLocal()
    comuna = (session.query(Comuna).filter_by(id=comuna_id).first())
    session.close()
    return comuna


# MIEMBROS

def create_miembro( nombre, email, telefono, fecha_registro, comuna_id):

    session = SessionLocal()

    nuevo_miembro = Miembro(
        nombre=nombre,
        email=email,
        telefono=telefono,
        fecha_registro=fecha_registro,
        comuna_id=comuna_id
    )

    session.add(nuevo_miembro)
    session.commit()
    miembro_id = nuevo_miembro.id
    session.close()
    return miembro_id


def get_miembro_by_id(miembro_id):
    session = SessionLocal()
    miembro = (session.query(Miembro).filter_by(id=miembro_id).first())
    session.close()
    return miembro

# Obtener los últimos 5 miembros registrados (para la portada)

def get_ultimos_5_miembros():
    session = SessionLocal()
    miembros = (session.query(Miembro).options(joinedload(Miembro.comuna)).order_by(Miembro.id.desc()).limit(5).all())
    session.close()
    return miembros

# Funcion para obtener miembros por pagina (para el listado)

def get_miembros_page(page, per_page=5):
    session = SessionLocal()
    miembros = (
        session.query(Miembro)
        .options(
            joinedload(Miembro.comuna),
            joinedload(Miembro.actividades).joinedload(Actividad.fotos)
        )
        .order_by(Miembro.id.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
    total = session.query(Miembro).count()
    session.close()
    return miembros, total


def get_todos_los_miembros():
    session = SessionLocal()
    miembros = (
        session.query(Miembro)
        .options(
            joinedload(Miembro.comuna),
            joinedload(Miembro.actividades)
        )
        .all()
    )
    session.close()
    return miembros

# ACTIVIDADES

def create_actividad( miembro_id, dia, hora_inicio, duracion, tipo, nombre, descripcion):

    session = SessionLocal()

    nueva_actividad = Actividad(
        miembro_id=miembro_id,
        dia=dia,
        hora_inicio=hora_inicio,
        duracion=duracion,
        tipo=tipo,
        nombre=nombre,
        descripcion=descripcion
    )

    session.add(nueva_actividad)
    session.commit()
    actividad_id = nueva_actividad.id
    session.close()
    return actividad_id


def get_actividades():
    session = SessionLocal()
    actividades = session.query(Actividad).all()
    session.close()
    return actividades


def get_actividad_by_id(actividad_id):
    session = SessionLocal()
    actividad = (session.query(Actividad).filter_by(id=actividad_id).first())
    session.close()
    return actividad


# FOTOS

def create_foto(ruta_archivo,nombre_archivo,actividad_id):
    session = SessionLocal()

    nueva_foto = Foto(
        ruta_archivo=ruta_archivo,
        nombre_archivo=nombre_archivo,
        actividad_id=actividad_id
    )

    session.add(nueva_foto)
    session.commit()
    session.close()


def get_fotos_by_actividad(actividad_id):
    session = SessionLocal()
    fotos = (session.query(Foto).filter_by(actividad_id=actividad_id).all())
    session.close()
    return fotos


## COMENTARIOS


# Crear un nuevo comentario para una actividad
def crear_comentario(nombre, texto, actividad_id):
    session = SessionLocal()

    comentario = Comentario(
        nombre=nombre,
        texto=texto,
        fecha=DateTime.now(),
        actividad_id=actividad_id
    )

    session.add(comentario)
    session.commit()

    session.close()
