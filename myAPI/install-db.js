'use strict';

const conn = require('./lib/connectMongoose');
const Anuncio = require('./models/anuncios');
const Usuario = require('./models/usuario');


conn.once('open', async () => {
    try {
        await initAnuncios();
        await initUsuarios();
        conn.close();
    } catch(err){
        console.error('hubo un error: ', err);
        process.exit(2);
    }
    
});



async function initAnuncios() {
    await Anuncio.deleteMany();
    await Anuncio.insertMany([
    {   
        nombre: 'bicicleta',
        venta: true,            
        precio: 200,
        foto: 'motor.jpg',
        tags: ['lifestyle', 'motor']
    },

    {   
        nombre: 'iphone',
        venta: true,            
        precio: 500,
        foto: 'mobile.jpg',
        tags: ['lifestyle', 'mobile']
    },
    {   
        nombre: 'pantalla',
        venta: false,            
        precio: 150,
        foto: 'work.jpg',
        tags: ['work']
    },
    {   
        nombre: 'mascarilla',
        venta: false,            
        precio: 0.50,
        foto: 'work.jpg',
        tags: ['lifestyle', 'mobile']
    },
    {   
        nombre: 'sudadera',
        venta: false,            
        precio: 10,
        foto: 'lifestyle.jpg',
        tags: ['lifestyle']
    },

    ]);

}


async function initUsuarios() {
    await Usuario.deleteMany();
    await Usuario.insertMany([
    {   
        email: 'user@example.com',
        password: await Usuario.hashPassword('1234'),
    },

    {   
        email: 'jose@example.com',
        password: await Usuario.hashPassword('1234'),
    }

    ]);

}