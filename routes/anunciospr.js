"use strict";

var express = require("express");
var router = express.Router();

const Anuncio = require("../models/anuncios");
const { check, validationResult } = require("express-validator");

/* GET home page. */
router.get("/", async (req, res, next) => {
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

    if (typeof nombre !== "undefined") {
      filtro.nombre = new RegExp("^" + nombre, "i");
    }

    if (venta) {
      filtro.venta = venta;
    }

    if (tag !== undefined) {
      tag = req.query.tags.split(",");

      (filtro.tags = { $all: tag }), { name: 1, tags: 1 };
    }

    if (precio !== undefined) {
      let precioSplit = req.query.precio.split("-");

      if (precioSplit[0] == "") {
        filtro.precio = { $lte: parseInt(precioSplit[1]) };
      } else if (precioSplit[1] == "") {
        filtro.precio = { $gte: parseInt(precioSplit[0]) };
      } else {
        filtro.precio = {
          $gte: parseInt(precioSplit[0]),
          $lte: parseInt(precioSplit[1]),
        };
      }
    }

    filtro.creador = req.usuario.id;

    const docs = await Anuncio.lista(filtro, limit, skip, sort, fields);

    res.locals.anuncios = docs;
    //console.log(res.json(docs));
    //res.render('index'); vamos a devolver el .json
    res.json(docs);

    console.log("pasa por aqui 299");
  } catch (err) {
    next(err);
  }
});

//Actualizar un anuncio

router.put("/:id", async (req, res, next) => {
  try {
    check("nombre").isString();
    check("venta").isBoolean();
    check("precio").isNumeric();

    const errores = validationResult(req);

    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    //extraer la informacion de los anuncios

    const { nombre, venta, precio, descripcion, foto } = req.body;

    console.log("Query ", req.query);
    console.log("Body ", req.body);

    const nuevoAnuncio = {};

    if (nombre) {
      nuevoAnuncio.nombre = nombre;
    }

    if (venta) {
      nuevoAnuncio.venta = venta;
    }

    if (precio) {
      nuevoAnuncio.precio = precio;
    }

    if (descripcion) {
      nuevoAnuncio.descripcion = descripcion;
    }

    if (foto) {
      nuevoAnuncio.foto = foto;
    }

    console.log("Lo que llega", nuevoAnuncio);

    try {
      //revisar el ID
      console.log(req.params.id);
      let anuncio = await Anuncio.findById(req.params.id);

      console.log(anuncio);

      //Si el proyecto existe

      if (!anuncio) {
        return res.status(404).json({ msg: "Proyecto no encontrado" });
      }

      //verificar el creador
      if (anuncio.creador.toString() !== req.usuario.id) {
        return res.status(401).json({ msg: "No autorizado" });
      }

      // actualizar
      anuncio = await Anuncio.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: nuevoAnuncio },
        { new: true }
      );

      console.log(anuncio);

      res.json({ anuncio });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error en el servidor");
    }
  } catch (err) {
    next(err);
  }
});

//eliminar proyecto por id
router.delete("/:id", async (req, res, next) => {
  try {
    //revisar el ID
    console.log(req.params.id);
    let anuncio = await Anuncio.findById(req.params.id);

    console.log(anuncio);

    //Si el proyecto existe

    if (!anuncio) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //verificar el creador
    if (anuncio.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    // eliminar
	await Anuncio.findOneAndRemove({ _id: req.params.id });
	res.json({msg:'Anuncio Eliminado'});
     

    
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
});

module.exports = router;
