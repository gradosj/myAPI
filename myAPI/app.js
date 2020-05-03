var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

var app = express();
// connect to database
const mongooseConecction = require('./lib/connectMongoose');

// view engine setup
app.set('views', path.join('views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.locals.title = 'NodeAPI'; // variables locales en todas las vistas

app.use((req, res, next) => {

  next();

});

const loginController = require('./routes/loginController');
const jwtAuth = require('./lib/jwtAuth'); // cargamos el generador de middlewares de jwt

console.log(jwtAuth);
/* rutas del api */ 


app.use('/api/anuncios', jwtAuth(), require('./routes/anuncios'));
app.use('/api/anuncios/post',jwtAuth(), require('./routes/api/anuncios'));

app.use('/api/authenticate', loginController.postJWT);




/** Inicializamos el sistema de sesiones */
// este middleware saltara en cada peticion
console.log(mongooseConecction);

app.use(session({
  name: 'nodeapi-session', /*nombre de la cookie que vamos a utilizar para la sesion */
  secret: '1earfgqpoeitunm12asdf421hepoi', /* evita utilizar patrones de numeracion */
  saveUninitialized: true, /* cuando no hemos metido nada en la "caja" se crea auto */
  cookie: {
      secure: false, /* el browser solo la envcia al servidor solo si usa https */
      maxAge: 1000 * 60 * 60 * 24 * 2, // (2 dias )cuando caduca la sesion por inactividad
    },
  //store: new MongoStore({   CONSULTAR CON JAVIER
  //  //le pasamos la conexion a la base de datos
  //  mongooseConecction: mongooseConecction 
  //})
}));


/**
 * Routes del website
 */
const sesisionAuth    = require('./lib/sessionAuth');

const privateController = require('./routes/privateControler');

//hacer disponible el objeto de session en las vistas
app.use((req, res, next) =>{

  res.locals.session = req.session; // con esto tendremos en las variables de vista la sesion de cada usuario disponible
  next();

});

app.use('/', require('./routes/index'));





//aqui usamos metodos directamente
app.get('/login', loginController.index);
app.post('/login', loginController.post); // --> Para el post
app.get('/logout', loginController.logout);
// devuelve un middleware que valida que el usuario está logado y tiene rol necesario-
app.get('/private', sesisionAuth(['admin']), privateController.index); // el sessionauut se ha creado pora que se llame antes
                                                            // de cualquier pogina que requiera un control de el inicio
                                                            // de sesion





// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  if (err.array) { // error de validación
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = isAPIRequest(req) ?
      { message: 'Not valid', errors: err.mapped() }
      : `El parámetro ${errInfo.param} ${errInfo.msg}`;
  }

  res.status(err.status || 500);

  if (isAPIRequest(req)) {
    res.json({ error: err.message });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

function isAPIRequest(req) {
  return req.originalUrl.startsWith('/api/');
}

module.exports = app;
