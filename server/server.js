require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();





const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); //app.use es un Middleware son funciones que se dispara cada vez que se pase por aquí

// parse application/json
app.use(bodyParser.json());


//configuracion glorbal de rutas
app.use(require('./routes/index'));

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));






mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err, resp) => {

        if (err) throw err;

        console.log('Base de datos ONLINE');
        //   useNewUrlParser: true,
        //   useUnifiedTopology: true
    });




app.listen(process.env.PORT, () => {
    console.log(`Ecuchando el puerto ${process.env.PORT}`);
});