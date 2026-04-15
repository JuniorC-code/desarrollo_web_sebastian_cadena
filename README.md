# desarrollo_web_sebastian_cadena

Repositorio que consta de la primera tarea para el ramo Desarrollo web de la Universidad de Chile.

Se desarrolla una pagina web la cual no tiene back-end, solo se maneja a travez de HTML, CSS, y Javascript.

Inicialmente tiene un apartado para ver el listado de actividades existentes, las estadisticas de dichas estadisticas y tambien un  apartado para poder registrarse en la pagina.

Se utilizo un sessionstorage con la intencion de poder guardar datos para poder utilizar posteriormente.

En particular se guarda el username de cualquier usuario registrado asi como *objetos* con distintas claves, todo esto con el proposito de poder dibujarlos de manera dinamica a travez de JS en los listados de actividades asi como tambien poder generar graficos y estadisticas de estas mismas.

## Decisiones de diseño

Se obto por una pagina inicial sencilla con 3 botones los cuales permiten movilizarnos a distintas partes de la app web.

Uno de los detalles mas importantes fue la creacion de formularios, se usaron los labels $<form>$ que permitieron luego obtener la informacion de los campos llenados por los usuarios.

A su vez tambien fue de suma importancia el uso de *sessionstorage* para poder usar los datos obtenidos de los forms. en base a ellos se crearon objetos para poder trabajar de manera mas sencilla en el uso dinamico de los datos en distintos apartados de la pagina.

Finalmente se uso *chart.js* con los datos iniciales asi como los guardados con sessionstorage para poder generar visualizaciones de los datos obtenidos.
