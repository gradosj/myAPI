# NODEPOP - PRACTICA FUNDAMENTOS NODE
Practica de proyecto Fundamentos Node.

# Descripcion
La pracita consiste en crear un API Node/express - MongoDB (Para ver dependencias, consultar package.json). Dicho API es llamado para gestionar una Web o APP de anuncios de compra / venta. 


# Instalacion

Para la instalacion de dependencias ejecutar
```
npm install

```

Para la inicializacion de la base de datos es necesario ejecutar

```
npm run install-db.js

```


Para la ejecucion del servidor

```
npm run dev

```


# Metodos
La V1 de la API tiene dos funcionalidades, la lista y la creacion de anuncion (GEST y POST).

# Post
Para publicar un anuncio hay que realizar una peticion POST a la direccion:

```
url/api/anuncios/post

```

## Schema de mongoose

```
const anuncioSchema = mongoose.Schema({
    nombre: String, /* Obligatorio */
    venta: Boolean, /* Obligatorio */
    precio: Number, /* Obligatorio */
    foto: String,   /* Opcional */
    tags: [String]  /* 1 obligatorio (work, lifestyle, mobile, motor) */

});

```

## Get
- La API muestra los anuncios en la ruta:

```
url/api/anuncios

devuelve consultas tipo: 

{
"tags": [
"lifestyle",
"motor"
],
"_id": "5e6e93ba7b438a3c90da5bc2",
"nombre": "bicicleta",
"venta": true,
"precio": 200,
"foto": "/images/work.jpg",
"__v": 0
},
{
"tags": [
"lifestyle",
"motor"
],
"_id": "5e6e93ba7b438a3c90da5bc3",
"nombre": "iphone",
"venta": true,
"precio": 500,
"foto": "/images/mobile.jpg",
"__v": 0
},

```

Se dispone de varios filtros para facilitar la busqueda de los usuarios, que seran aplicados por query string, sin importar el orden y con paginacion disponible. Los registros estan limitados a 10 por peticion. Puede cambiarse en api/anuncios.js

```
 const limit = parseInt(req.query.limit || 10);

```

### Filtro nombre
Devuelve registros con la palabra de busqueda en nombre

```
url\api\nuncios?nombre=raton

{
"tags": [],
"_id": "5e7fb1574178ef3ef4393ced",
"nombre": "raton de pc",
"venta": false,
"precio": 10,
"foto": "/images/motor.jpg",
"__v": 0
},
{
"tags": [],
"_id": "5e7fb3d05f794b2ca4ccc1ee",
"nombre": "raton de pc 2",
"venta": false,
"precio": 10,
"foto": "/images/motor.jpg",
"__v": 0
},


```

### Filtro tipo de anuncio
Se muestran anuncios de compra o de venta

```
url/api/anuncios?venta=false

{
"tags": [
"lifestyle",
"motor"
],
"_id": "5e6e93ba7b438a3c90da5bc4",
"nombre": "Pantalla",
"venta": false,
"precio": 50,
"foto": "/images/lifestyle.jpg",
"__v": 0
},

```
### Filtro por tags
Devuelve todos los anuncios que contengan el/los tags de busqueda

```
url/api/anuncios?tags=lifestyle

{
"tags": [
"lifestyle",
"motor"
],
"_id": "5e6e93ba7b438a3c90da5bc4",
"nombre": "Pantalla",
"venta": false,
"precio": 50,
"foto": "/images/lifestyle.jpg",
"__v": 0
},
{
"tags": [
"lifestyle"
],
"_id": "5e7fc49ed092a647d459279a",
"nombre": "raton de pc 5",
"venta": false,
"precio": 10,
"foto": "/images/motor.jpg",
"__v": 0
},
```

### Filtro por rango de precio
Se deben realizar dos parametros de precio separados por '-' y la api devolverá los registros entre ambos precios.
```
url/api/anuncios?precio=50-200 

{
"tags": [
"lifestyle",
"motor"
],
"_id": "5e6e93ba7b438a3c90da5bc4",
"nombre": "Pantalla",
"venta": false,
"precio": 50,
"foto": "/images/lifestyle.jpg",
"__v": 0
},
{
"tags": [
"sports"
],
"_id": "5e7a347f744a58738009d244",
"nombre": "bicicleta de montaña",
"venta": true,
"precio": 200,
"foto": "/images/motor.jpg",
"__v": 0
}

```

En caso de querer un precio cerrado se debera poner el mismo precio separado  de  '-' 

```
url/api/anuncios?precio=200-200 

```

para solo establecer precio maximo o precio minimo omitir valor a la izquierda o derecha de '-'

```
url/api/anuncios?precio=200-
url/api/anuncios?precio=-200

```
### Paginacion
Se ha tenido en cuenta la paginación con los filtros skip y limit.

Skip salta los registros iniciales que se le indiquen
```
url/api/anuncios?skip=1

```


Limit indica el maximo de registros mostrados por peticion

```
url/api/anuncios?limit=1

```

## Aplicación de varios filtros
Para la aplicacion de varios filtos a la vez se deben concatenar con '&' entre ellos.

```
http://localhost:3000/api/anuncios?limit=5&precio=-100&nombre=raton&skip=1&tags=lifestyle

{
"tags": [
"lifestyle",
"work"
],
"_id": "5e7fc4b3d092a647d459279b",
"nombre": "raton de pc 6",
"venta": false,
"precio": 10,
"foto": "/images/motor.jpg",
"__v": 0
},
```












