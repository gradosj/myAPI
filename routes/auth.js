var express = require("express");
var router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");

//Crea un usuario
//api/auth

router.post(
  "/",
  [
    check("email", "Agrega un email valido").isEmail(),
    check("password", "El password debe ser minimo de 6 caracteres").isLength({
      min: 6,
    }),
  ],
  authController.autenticarUsuario
);

//Obtiene el usuario autenticado
router.get("/", authController.usuarioAutenticado);

module.exports = router;
