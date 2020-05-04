'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const Anuncio = require('../../models/anuncios');
const { check, validationResult } = require('express-validator');

const storage = multer.diskStorage({ /* donde se guarda -- este es el que suele da problemas */
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', '..', 'uploads'));
    },
    filename: function (req, file, cb) { /*de donde se recupera */
        //cb(null, `${file.fieldname}-${Date.now()}`);
        console.log('aquuuuuuuuuuuuuuuuuuuuuiiiiiiiiiiiiiii', file.originalname);
        const originalName = file.originalname;
        const nameArr = originalName.split('.');
        console.log(nameArr);
        let extension = '';

        console.log(nameArr.length);
        if (nameArr.length > 1) {
            extension = nameArr[nameArr.length - 1];
        }
        console.log(extension);
        // cb(null, file.fieldname + Date.now() + '.' + extension);
        cb(null, `${file.fieldname} - ${Date.now()}.${extension}`);
    }

});

const upload = multer({ storage });


router.get('/', async (req, res, next) => {
    try {

        const venta = req.query.venta;
        const limit = parseInt(req.query.limit || 10); // limit result
        const skip = parseInt(req.query.skip);
        const sort = req.query.sort;
        const fields = req.query.fields;
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

        const docs = await Anuncio.lista(filtro, limit, skip, sort, fields);

        res.json(docs);
    } catch (err) {
        next(err);
    }
});


// realizamos peticiones por id
router.get('/:id', async (req, res, next) => {
    try {
        const _id = req.params.id;

        const anuncio = await Anuncio.findOne({ _id: _id });
        if (!anuncio) {
            const err = new Error('not found');
            err.status = 404;
            return next(err);
        }

        res.json({ result: anuncio });

    } catch (err) {
        next(err);

    }

});

// Crea un anuncio
router.post('/', upload.single('foto'),
    check('nombre').isString(),
    check('venta').isBoolean(),
    check('precio').isNumeric(),
    // check('foto').isString(),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            const listaTags = ['motor', 'lifestyle', 'mobile', 'work'];
            let cont = 0;
            let encontrado = true;

            console.log(req.body);

            while (cont < listaTags.length && encontrado === false) {

                if (listaTags[cont] == req.body.tags) {
                    console.log(listaTags[cont]);
                    console.log(req.body.tags);
                    encontrado === true;
                } else { encontrado === false; }

                cont++;

            }

            if (encontrado === false) {
                const err = new Error('Error tags, use: motor, lifestyle, mobile, work');
                err.status = 422;
                return next(err); // Send error

            }


            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() }); //Validations response
            }

            const anuncioData = req.body;
            const anuncio = new Anuncio(anuncioData);
            const anuncioGuardado = await anuncio.save();
            res.status(201).json({ result: anuncioGuardado })
        } catch (err) {
            next(err);
        }


    });

module.exports = router;