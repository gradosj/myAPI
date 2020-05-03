'use strict';

const express = require('express');
const router = express.Router();


router.get('/:locale', (req, res, next) => {
    // recuperar el locale que me nos pasan
    const locale = req.params.locale;


    // guardar la pagina que de la que viene para poder volver

    const returnTo = req.get('referer');


    //establecemos la cookie del nuevo idioma
    res.cookie('nodeapi-locale', locale, {maxAge: 1000 * 60 * 24 * 20}); //maxAge va en ms



    //redireccionamos a la página de la que venia

    res.redirect(returnTo);



});

module.exports = router;