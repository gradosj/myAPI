'use strict';

const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');



class LoginController {


  /* Peticion get a /login */
  index(req, res, next) {
    res.locals.email = ''; /* con esto le estamos añadiendo la variable de la vista email */
    res.locals.error = '';
    res.render('login.html');

  }


  /**Peticion post a /login  */

  async post(req, res, next) {
    try {
      // recoger los parametros de entrada
      const email = req.body.email;
      const password = req.body.password;

      // buscar el usuario en la base de datos

      const usuario = await Usuario.findOne({ email: email });

      // si no existe el usuario o la password no coincide

     // if (!usuario || usuario.password !== password) { sin cifrar
     if (!usuario || !await bcrypt.compare(password, usuario.password) ) { //cifrada 
        console.log(email, password);
        res.locals.email = email; /* le devolvemos a la pagina el mail para no tener que ponerlo */
        res.locals.error = ('Invalid credentials');
        res.render('login');
        return;

      }

      // encuentro el usuario y la password es correcta


      //apuntar el id de usuario en la sesion del usuario. 
      // el req.session es donde se almancena la informacion del
      // express-session
      req.session.authUser = { /*llamamos al atributo como queramos */
        _id: usuario._id

      };
      console.log('pasa por aqui*********************', req.session.authUser);
      res.redirect('/private');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new LoginController();