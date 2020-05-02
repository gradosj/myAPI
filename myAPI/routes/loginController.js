'use strict';


class LoginController {


  /* Peticion get a /login */
  index(req, res, next) {
    res.locals.email = ''; /* con esto le estamos añadiendo la variable de la vista email */
    res.render('login.html');

  }


  /**Peticion post a /login  */

  post(req,res,next){
    // recoger los parametros de entrada
    const email = req.body.email; 
    const password = req.body.password;-


    console.log(email, password);
    res.locals.email = email; /* le devolvemos a la pagina el mail para no tener que ponerlo */
    res.render('login');

  }
}

module.exports = new LoginController();