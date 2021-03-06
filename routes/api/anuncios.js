'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const cote = require('cote');
const Anuncio = require('../../models/anuncios');



const { check, validationResult } = require('express-validator');
const rutaDestino = path.join(__dirname, '..', '..', 'public', 'images', 'uploads');
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
      
        const originalName = file.originalname;
        const nameArr = originalName.split('.');
       
       
        if (nameArr.length > 1) {
            extension = nameArr[nameArr.length - 1];
        }

        nombreFichero = `${file.fieldname} - ${Date.now()}.${extension}`;
        rutaTotal = `${rutaDestino}${barra}${nombreFichero}`;
       

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
router.post('/',
    //auth,
    upload.single('foto'),
    check('nombre').isString(),
    check('venta').isBoolean(),
    check('precio').isNumeric(),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            const listaTags = ['motor', 'lifestyle', 'mobile', 'work'];
            let cont = 0;
            let encontrado = false;

    
          

            while (cont < listaTags.length && encontrado === false) {
                if (listaTags[cont] == req.body.tags) {
                   
                    encontrado = true;
                  
                } else { encontrado === false; }

                cont++;

            }

         


            
                       

            const anuncioData = req.body;
    ;
            const anuncio = new Anuncio(anuncioData);
            anuncio.creador =  req.usuario.id;
            const anuncioGuardado = await anuncio.save();
            res.status(201).json({ result: anuncioGuardado })
        } catch (err) {
            next(err);
        }


    });

module.exports = router;