'use strict';

var express = require('express');
var router = express.Router();

const Anuncio = require('../models/anuncios');

/* GET home page. */
router.get('/', async (req, res, next) => {
	try {
		const limit = parseInt(req.query.limit || 10);
		const skip = parseInt(req.query.skip);
		const sort = req.query.sort;
		const fields = req.query.fields;
		const venta = req.query.venta;
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

			(filtro.tags = { $all: tag }), { name: 1, tags: 1 };
		}

	
		if (precio !== undefined) {
		

			let precioSplit = req.query.precio.split('-');

			if (precioSplit[0] == '') {
				filtro.precio = { $lte: parseInt(precioSplit[1]) };
			} else if (precioSplit[1] == '') {
				filtro.precio = { $gte: parseInt(precioSplit[0]) };
			} else {
				filtro.precio = { $gte: parseInt(precioSplit[0]), $lte: parseInt(precioSplit[1]) };
			}
		}

		const docs = await Anuncio.lista(filtro, limit, skip, sort, fields);

		res.locals.anuncios = docs;
		//console.log(res.json(docs));
		//res.render('index'); vamos a devolver el .json
		res.json(docs);
		
		
		console.log('pasa por aqui 5');
	} catch (err) {
		next(err);
	}
});


// realizamos peticiones por id
router.get('/:id', async (req, res, next) => {
    try {
        console.log('entra por el get id');
        const _id = req.params.id;

        console.log(_id);

        const anuncio = await Anuncio.findOne({ _id: _id });
        if (!anuncio) {
            const err = new Error('not found');
            err.status = 404;
            return next(err);
        }
        console.log('pasa por aqui 3');
        res.json({ result: anuncio });

    } catch (err) {
        next(err);

    }

});



module.exports = router;
