'use strict';


class PrivateController {
    index(req, res, next){

       

        res.render('private');
    }


}

module.exports = new PrivateController(); 
