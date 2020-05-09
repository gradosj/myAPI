'use strict';

const cote = require('cote');
const Jimp = require('jimp');
const path = require('path');


// declarar el microservicio
const responder = new cote.Responder({ name: 'currency responder' });


responder.on(
    'resize image', (req, done) => {

        async function resize(rute) {
            // Read the image.
           
            const image = await Jimp.read(path.join(__dirname, '..', '..', 'public', 'images', 'uploads', req.name));
            // Resize the image to width 150 and heigth 150. 
           // Resize the image to width 150 and heigth 150.
            await image.resize(100, 100);
            // Save and overwrite the image
         //   await image.writeAsync(`test/Mini_${req.name}`);
            await image.writeAsync(path.join(__dirname, '..', '..', 'public', 'images', 'uploads', `mini${req.name}`));
        }


        resize(req.name);

        done('OK', 'NOK');

    }

)
