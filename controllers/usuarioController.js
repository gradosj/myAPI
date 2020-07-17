'use strict';

const Usuario = require('../models/Usuario.js')
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

console.log('entra por aqui');
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

        //guardar usuario
        await usuario.save()
        //mensaje de confirmacion
        res.json('Usuario OK');

    } catch (error){
        console.log(error);
        res.status(400).send('Hubo un error');

    }

}