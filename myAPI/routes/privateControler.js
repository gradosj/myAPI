'use strict';


class PrivateController {
    index(req, res, next){

        // verificar quien pìde la página
        if (!req.session.authUser) { // la propiedad autuser se crea autoamitcamtente
            res.redirect('/login');         // si ha pasado por logincontroler y la validacion de
            return;                        // usuario y contraseña ha sido la correcta
        }

        res.render('private');
    }


}

module.exports = new PrivateController(); 
