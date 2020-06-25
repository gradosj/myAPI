'use strict';


module.exports = function (rolesToValidate) {
    return function (req, res, next) {
        // verificar quien pìde la página
        if (!req.session.authUser) {    // la propiedad autuser se crea autoamitcamtente
            res.redirect('/login');     // si ha pasado por logincontroler y la validacion de
            return;                     // usuario y contraseña ha sido la correcta
        }

        // comprobar roles
        // buscar el usuario en la BD (si lo hemos guardado en la cookie no haria falta)
        // comprobar que tienes al menos los rolesTovalidate
        // no se enviaria a la pagina de login sino que se le mostraria mensaje que no tiene permisos. 
        next();
    }
}