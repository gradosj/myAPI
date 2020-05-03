'use strict';

const jwt = require('jsonwebtoken');





module.exports = function() {
    return (req, res, next) => {

        console.log(req.get('Authorization'));
        //recoger el token de la petición
        const token = req.get('Authorization') || // asi lo sacamos de la cabecera
                      req.query.token          ||
                      req.body.token;

        console.log(token);


        // si no nos da token no pueden pasar
        if (!token) {
            const error = new Error('no token provided');
            error.status = 401;
            next(error);
            return;
        }

        //verificar si el token es valido 

        jwt.verify(token,
                  '+oHZ-&}j7y^zd0d{]D9t%j!FL~Y3n]:&va§7Rnygl]vCt|O{^w5<§<&)5fNo@MPi',
                  (err, payload) => {
                      if (err) {
                          const error = new Error('invalid token');
                          err.status = 401;
                          next(err);
                          return;
                      }
                      req.apiAuthUserId = payload._id; // nos estamos creando el apiaut... con el id del usuario
                      next();
                  });

         //sino es v
    };
}

//midleware de validación de JWT