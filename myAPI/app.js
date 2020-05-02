var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

// connect to database
require('./lib/connectMongoose');

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

/**
 * Routes
 */

app.use('/api/anuncios', require('./routes/anuncios'));
app.use('/api/anuncios/post', require('./routes/api/anuncios'));

console.log(app.use);

/**
 * Rutas del website
 */
app.use('/',      require('./routes/index'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  if (err.array) { // error de validación
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = isAPIRequest(req) ?
      { message: 'Not valid', errors: err.mapped()}
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

function isAPIRequest(req) {
  return req.originalUrl.startsWith('/api/');
}

module.exports = app;
