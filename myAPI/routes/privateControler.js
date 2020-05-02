'use strict';


class PrivateController {
    index(req, res, next){

        // verificar quien pìde la página
        res.render('private');
    }


}

module.exports = new PrivateController(); 
