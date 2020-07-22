"use strict";

const jwt = require("jsonwebtoken");

module.exports = function () {
  return (req, res, next) => {
    // console.log(req.get('Authorization'));
    //recoger el token de la petición
    const token =
      req.get("Authorization") || // asi lo sacamos de la cabecera
      req.query.token ||
      req.body.token;

    // si no nos da token no pueden pasar
    if (!token) {
      const error = new Error("Token obligatorio");
      error.status = 401;
      next(error);
      return;
    }

    //verificar si el token es valido

    try {
      const cifrado = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = cifrado.usuario;
      
      next();
    } catch (error) {
      res.status(401).json({ msg: "Token no valido" });
    }
    
  };
};
