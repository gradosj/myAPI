'use strict';

const Usuario = require('../models/Usuario.js')
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


exports.crearUsuario = async (req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);

    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    //extraer mail y password
    const {email, password} = req.body;

    try{
        // revisar  que el usuario sea unico
        let usuario = await Usuario.findOne ({email});

        if (usuario) {
            return res.status(400).json({msg: 'El usuario ya existe'});
        }
        // Crear el nuevo usuario
        usuario = new Usuario(req.body);

        //hashear password
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);

        //guardar usuario
        await usuario.save()
        

        //Crear y firmar JWT
        const payload = {
            usuario: {
                id: usuario.id
            }


        };

        
        // firmar el token
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 3600000
        }, (error, token) => {
            if(error) throw error;

            //mensaje de confirmacion
            res.status(200).json({token});
        })

               

    } catch (error){
        
        res.status(400).send('Hubo un error');

    }

}