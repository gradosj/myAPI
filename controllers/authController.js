const Usuario = require("../models/Usuario.js");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.autenticarUsuario = async (req, res) => {
  //revisar si hay errores

  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //extreamos mail y password
  const { email, password } = req.body;

  //console.log(email);

  try {
    //revisar que sea un usuario registrado
    let usuario = await Usuario.findOne({ email });
    console.log(usuario);
    if (!usuario) {
      return res.status(400).json({ msg: "El usuario no existe" });
    }

    const passCorrecto = await bcrypt.compare(password, usuario.password);

    if (!passCorrecto) {
      return res.status(400).json({ msg: "Password Incorrecto" });
    }

    //Si todo es correcto     //Crear y firmar JWT
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };

    // firmar el token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: 3600000,
      },
      (error, token) => {
        if (error) throw error;

        //mensaje de confirmacion
        res.status(200).json({ token });
      }
    );
  } catch (error) {
    console.log(error);
  }
};


//Obtiene que usuario esta autenticado

exports.usuarioAutenticado = async (req,res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    
    res.json({usuario});
    
  } catch (error) {
    
    res.status(500).json({msg: 'Hubo un error'});
    
  }
}