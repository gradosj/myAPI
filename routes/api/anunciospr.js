'use strict';
console.log ('pagina jose anuncios Privados');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const cote = require('cote');
const Anuncio = require('../../models/anuncios');

//obtiene todos los proyectos del usuario actual

router.get('/', async (req, res, next) => {
    try {

        const venta = req.query.venta;
        const limit = parseInt(req.query.limit || 10); // limit result
        const skip = parseInt(req.query.skip);
        const sort = req.query.sort;
        const fields = req.query.fields;
        const creador = req.query.creador;
        let tag = req.query.tags;
        let precio = req.query.precio;
        let nombre = req.query.nombre;

        const filtro = {};

        if (typeof nombre !== 'undefined') {
            filtro.nombre = new RegExp('^' + nombre, 'i');
        }


        if (venta) {
            filtro.venta = venta;
        }

        if (tag !== undefined) {

            tag = req.query.tags.split(',');
            filtro.tags = { $all: tag }, { name: 1, tags: 1 }

        }



        if (precio !== undefined) {

            let precioSplit = req.query.precio.split('-');


            if (precioSplit[0] == '') {


                filtro.precio = { $lte: parseInt(precioSplit[1]) }

            } else if (precioSplit[1] == '') {


                filtro.precio = { $gte: parseInt(precioSplit[0]) }


            } else {

                filtro.precio = { $gte: parseInt(precioSplit[0]), $lte: parseInt(precioSplit[1]) }

            }

        }

        console.log(req.usuario.id);

        filtro.creador = req.usuario.id;

        //const docs = await Anuncio.lista(filtro, limit, skip, sort, fields);
        const query = Anuncio.lista({creador: req.usuario.id}); 

        res.json(query);
        console.log('pasa por aqui 2');
        console.log(res.json(docs));
    } catch (err) {
        next(err);
    }
});




module.exports = router;