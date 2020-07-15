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
		//res.json(docs);
		res.json({
			"success": true,
			"results": [
			  {
				"tags": [
				  "lifestyle"
				],
				"_id": "5d3a0a5f9bd7ed2ece463abc",
				"name": "Comba de Crossfit",
				"price": 8,
				"description": "Soy el de las calleras.",
				"type": "buy",
				"photo": "/images/anuncios/comba.jpg",
				"__v": 0,
				"createdAt": "2019-07-25T20:00:31.945Z",
				"updatedAt": "2019-07-25T20:00:31.945Z"
			  },
			  {
				"tags": [
				  "lifestyle",
				  "work",
				  "mobile"
				],
				"_id": "5d3a0a5f9bd7ed2ece463ab7",
				"name": "Teclado Gaming Razer Chroma",
				"price": 70,
				"description": "Busco teclado razer en buen estado.",
				"type": "buy",
				"photo": "/images/anuncios/tecladorazer.jpg",
				"__v": 0,
				"createdAt": "2019-07-25T20:00:31.945Z",
				"updatedAt": "2019-07-25T20:00:31.945Z"
			  },
			  {
				"tags": [
				  "lifestyle"
				],
				"_id": "5d3a0a5f9bd7ed2ece463abb",
				"name": "Calleras Crossfit",
				"price": 15,
				"description": "Dejate de romperte las manos en los WODs",
				"type": "buy",
				"photo": "/images/anuncios/calleras.jpg",
				"__v": 0,
				"createdAt": "2019-07-25T20:00:31.945Z",
				"updatedAt": "2019-07-25T20:00:31.945Z"
			  }
			]
		  })
		
		console.log('pasa por aqui 5');
	} catch (err) {
		next(err);
	}
});



module.exports = router;
