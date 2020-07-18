'use strict';
console.log('inicio anuncio.js')

const mongoose = require('mongoose');

// crear un esquema

const anuncioSchema = mongoose.Schema({
    nombre: {
            type: String,
            required: true,
            trim: true
            },

    venta: {
            type: Boolean,
            required: true,
            },   
    precio: {
            type: Number,
            require: true,
            },

    foto:   {
            type: String,
            
            },
    descripcion:
        {
            type: String,
        },
    tags: {
            type: [String],
            require: true,
            }, 

    creador: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario'
            }, 
    creado: {
            type: Date,
            default : Date.now
        }

});


//FALTA AÑADIR EL RESTO DE LOS FILTROSSS
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


