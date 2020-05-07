'use strict';
console.log('inicio anuncio.js')

const mongoose = require('mongoose');

// crear un esquema

const anuncioSchema = mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: [String]

});

anuncioSchema.statics.lista = function (filtro, limit, skip, sort, fields) {
   // console.log(Anuncio.find); 
    const query = Anuncio.find(filtro); 

    query.limit(limit);
    query.skip(skip);
    query.sort(sort);
    query.select(fields);
    return query.exec();

};

const Anuncio = mongoose.model('Anuncio', anuncioSchema);




//exportamos el modelo
module.exports = Anuncio;


