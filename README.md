# testCountry
## Estructura de la base de datos
Couch DB es una base de datos JSON por lo tanto se crean documentos JSON con los siguientes atributos:

**id, name, kingdom, phylum, class, order, family, genus, specific, range, author, comunName, occurrences**
donde **occurrences** es un arreglo con la informacion de las ocurrencias obtenidas de *gbif.org/*

## Prerequisitos
Tener instalados nodejs y couchdb, descargar los archivos de este repositorio de github.

## Instrucciones de instalación y configuración
0. Instalar la libreria *nano* para el manejo de la base de datos desde nodejs **:>npm install nano --save**

1. Ejecutar el archivo importData.js usando nodejs **:>node importData.js**

2. Crear la siguiente vista en Couch DB usando Futon *http://localhost:5984/_utils/*

  2.1 Seleccionar la base de datos *ocurrence_db*
  
  2.2 En el menú *View* seleccionar *Temporary View...*
  
  2.3 En el campo de texto *Map function* pegar el siguiente codigo:
  
>function(doc) {

>  for(index in doc.occurrences){

>    emit([doc.name, doc.occurrences[index].country], 1);

>  }

>}

  2.4 En el campo de texto *Reduce function* pegar el siguiente codigo:
  
>function(keys, values, rereduce) {

>  return sum(values)

>}

  2.5 Guardar la vista haciendo clic en el boton *Save As...* con nombre *country* para ambos campos requeridos.

3. Iniciar el servidor ejecutando el archivo startServer.js usando nodejs **:>node startServer.js**

4. Abrir el archivo testByCountry.html