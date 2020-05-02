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

		//console.log('filtro total: ', filtro);
		//console.log(JSON.stringify(filtro))

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
		res.render('index');
	} catch (err) {
		next(err);
	}
});



module.exports = router;
