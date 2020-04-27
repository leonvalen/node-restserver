const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middleware/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ============================
// Mostrar todas las categorias
// ============================
app.get('/categoria', (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email') // se hace un populate para que no salga el id en usuario y luego se colocan los campos que se quieren mostrar
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        });
});


// ============================
// Mostrar categoria por ID
// ============================
app.get('/categoria/:id', (req, res) => {
    // Categoria.findById(...);
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) { // se usa erro 500 porque si sucede un error es un error grave de base de datos
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });



    });
});


// ============================
// crear nueva categoria
// ============================
app.post('/categoria', verificaToken, (req, res) => {
    // Regresa la nueva categoria y la categoraia está en verificaToken
    // req.usuario._id -> para que funcione se debe mandar el verificaToken

    // como se obtiene el body o lo que viene en el post y aqui viene la descripcion
    let body = req.body;

    // se puede crear un anueva instancia de categorias 
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id // para que funcione se debe mandar el verificaToken si no no se tiene en el request
    });

    // rpocedemos a grabarla se obtiene un err o la categoriaDB (que viene de la base de datos)
    categoria.save((err, categoriaDB) => {

        if (err) { // se usa erro 500 porque si sucede un error es un error grave de base de datos
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // si llega hasta aqui es que si grabó la categoría y retorno categoriaDB
        // para poder usar este archivo de categoria.js hay que importarla en algún lugar porque así está huerfana y es un simple archivo de javascript
        // y para eso en index.js se debe importar con  app.use(require('./categoria'));
        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

});


// ============================
// actualizar una categoria
// ============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    //Regresa la nueva categoria
    // req.usuario._id

    let id = req.params.id;
    let body = req.body;

    // creamos un objeto desCategoria
    let desCategoria = {
        descripcion: body.descripcion
    };

    // creamos una funcion Categoria.findByIdAndUpdate
    // enviamos el id y lo que vamos a actualizar un objeto desCategoria
    // se usa { new: true, runValidators: true } tiene que se nueva la descripción y se ejecutan los runValidators definidos en el 
    // modelos categoria type: String, unique: true, required: [true, 'La descripción es obligatoria']
    // y obtenemos un err o categoriaDB 
    Categoria.findByIdAndUpdate(id, desCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        // las validaciones de error del post
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });



});



// ============================
// Borrar una categoria
// ============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // solo un administrador puede borrar categorias
    // Categoria.findByIdAndRemove(...);

    //ocupamos el id
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        // las mismas validaciones de error del post
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoría Eliminada'
        })
    });
});




module.exports = app;