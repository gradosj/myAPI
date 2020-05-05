'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const cote = require('cote');
const Anuncio = require('../../models/anuncios');
const { check, validationResult } = require('express-validator');
const rutaDestino = path.join(__dirname, '..', '..', 'public', 'images', 'uploads');
const imagesTypes = ['jpg', 'png', 'bmp', 'jpeg'];
const barra = "\\";

let nombreFichero = '';
let rutaTotal = ''; // Utilizamos esta ruta para enviar la peticion
let extension = '';



const storage = multer.diskStorage({ /* donde se guarda -- este es el que suele da problemas */
    destination: function (req, file, cb) {
        cb(null, rutaDestino);
    },
    filename: function (req, file, cb) { /*de donde se recupera */
        //cb(null, `${file.fieldname}-${Date.now()}`);
        console.log('aquuuuuuuuuuuuuuuuuuuuuiiiiiiiiiiiiiii', file.originalname);
        const originalName = file.originalname;
        const nameArr = originalName.split('.');
        console.log(nameArr);
        

        console.log(nameArr.length);
        if (nameArr.length > 1) {
            extension = nameArr[nameArr.length - 1];
        }

        nombreFichero = `${file.fieldname} - ${Date.now()}.${extension}`;
        rutaTotal = `${rutaDestino}${barra}${nombreFichero}`;
        console.log('La ruta es: --------------------------------------> ', nombreFichero);
        console.log(' La ruta completa es :', rutaTotal);

        // cb(null, file.fieldname + Date.now() + '.' + extension);
        cb(null, nombreFichero);
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
// Incluimos Multer
router.post('/', upload.single('foto'),
    check('nombre').isString(),
    check('venta').isBoolean(),
    check('precio').isNumeric(),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            const listaTags = ['motor', 'lifestyle', 'mobile', 'work'];
            let cont = 0;
            let encontrado = true;

            

            console.log('1', listaTags[cont], typeof (listaTags[cont]));
            console.log('2', req.body.tags, typeof (req.body.tags));
            console.log(Date.now());
/*
            if (listaTags[1] == req.body.tags) {
                console.log('entra');
            } else { console.log('los cojones') }

            while (cont < listaTags.length && encontrado === false) {
                if (listaTags[cont] == req.body.tags) {
                    console.log(listaTags[cont]);
                    console.log(req.body.tags);
                    encontrado === true;
                } else { encontrado === false; }

                cont++;

            }
*/
            if (encontrado === false) {
                const err = new Error('Error tags, use: motor, lifestyle, mobile, work');
                err.status = 422;
                return next(err); // Send error

            }


          if (extension != 'png'
          &&  extension != 'jpg'
          &&  extension != 'bmp'
          &&  extension != 'jpeg'
           ) {
               const err = new Error('Formato de archivo incorrecto');
               err.status = 422;
               return next(err);
           } else {
               req.body.foto = `mini${nombreFichero}`;
               console.log(req.body.foto);
           }

                       


            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() }); //Validations response
            } else {

                const requester = new cote.Requester({ name: 'currency client'});

                requester.send({
                    type: 'resize image',
                    name: nombreFichero,
                    
                }, resultado => {
                    console.log('respuesta: ', resultado, ' ', Date.now());
                });
    
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