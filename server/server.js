require('./config/config');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); //app.use es un Middleware son funciones que se dispara cada vez que se pase por aquí

// parse application/json
app.use(bodyParser.json());



app.get('/usuario', function(req, res) {
    res.json('Get Usuario');
});
app.post('/usuario', function(req, res) {
    let body = req.body; // este bodyy aparece cuando el bodyParser se procese cualquier payload que reciban las peticiones 

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mesaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            Persona: body
        });
    }


});
app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    res.json({
        id
    });
});
app.delete('/usuario', function(req, res) {
    res.json('Delete Usuario');
});








app.listen(process.env.PORT, () => {
    console.log(`Ecuchando el puerto ${process.env.PORT}`);
});