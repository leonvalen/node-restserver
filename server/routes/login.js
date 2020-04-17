const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const app = express();


app.post('/login', (req, res) => { // se recibe un callback

    // primero obtenemos el body (email & password)
    let body = req.body; // el bojeto req trae el body

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) { // se colocan retorn para que no siga ejecutando el código
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        // como evaluamos la contraseña. Anteriormente habiamos usado el bcrypt en el método post de usuario password: bcrypt.hashSync(body.password, 10)
        // tenemos que trata de hacer el proceso inverso pero no podemos porque está encripatado en una sola via 
        // en ese caso tomamos la contraseña la encriptamos y vemos is eso hace mach.
        // En este cas hay una función propia del bcrypt llamada bcrypt.compareSync el cual retorna true si la contraseña hace mach
        // comparamos la contraseña que viene en el body.password contra la contraseña de la base de datos contenida en UsuarioDb.password
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        // usuario: usuarioDB => payload , process.env.SEED, expiresIn: process.env.CADUCIDAD_TOKEN
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

});


module.exports = app; // es la función de express