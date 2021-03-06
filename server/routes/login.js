const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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

// configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();


    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };

}
// verify().catch(console.error);

app.post('/google', async(req, res) => {

    let token = req.body.idtoken; // recibimos el token

    let googleUser = await verify(token) // verificamos el token
        .catch(e => { // si se verifica correctamente se tendrá un objeto "googleUser" con cierta información del usuario
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    // se llama a Usuario.findOne para verificar si en la base de datos existe ese un usuario con ese correo
    // porque si existe y no se ha autenticado por google quiere decir que el usuario uso su correo en el método de autenticación normal

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuarioDB) { // si existe el usuario

            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });
            } else { // si se autentificó por google se renueva el token personalizado y se regresa con los datos del usuario
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });


                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });

            }

        } else { // si es la primera vez que el usario se autentica
            // Si el usuario no existe en nuestra base de datos
            let usuario = new Usuario(); // se crea un objeto del esquema usuario

            usuario.nombre = googleUser.nombre; // todas las propiedades
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => { // grabar en la base de datos

                if (err) { // pr si ocurre un error se dispara
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                // si no hay errore se genera un nuevo token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                // se envian datos con el nuevo token
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });

            });

        }


    });

});


module.exports = app; // es la función de express