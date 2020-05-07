'use strict';

var express = require('express');
var router = express.Router();
//modelo
const Tag = require('../../models/tags');


//Petición GET:
router.get('/', async (req, res, next) => {
    try {
        const filtro = {};
        const sort = 'tag';
        const skip = 0;
        const limit = 10000;
        const fields = 'tag';
        // Respuesta:
        const response = await Tag.lista(filtro, sort, skip, limit, fields);
        const docs = response;
        res.json(docs);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;