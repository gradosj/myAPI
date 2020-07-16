var express = require('express');
var router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const {check} = require('express-validator');

//Crea un usuario
//api/usuarios

router.post('/',
[
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('email', 'Agrega un email valido').isEmail(),
  check('password', 'El password debe ser minimo de 6 caracteres').isLength({min:6})
],
  usuarioController.crearUsuario
);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
