const express = require('express');

// todos los usuarios pueden manipular los productos, lo que es que deben estar autenticados
const { verificaToken } = require('../middleware/autenticacion');

let app = express();
let Producto = require('../models/producto');



// =========================
//  Obtener todos los productos
// =========================
app.get('/productos', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario y categoria
    // paginado

    // 1. controlar el paginado
    let desde = req.query.desde || 0;
    desde = Number(desde); // se tiene que transformar en número porque viene string

    // buscar los productos con la condición de que solo los que están dsponibles
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                productos
            });
        });




})


// =========================
//  Obtener un productos por ID
// =========================
app.get('/productos/:id', verificaToken, (req, res) => {
    // trae el producto por el id
    // populate: usuario y categoria
    // paginado

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID No existe'
                    }
                });
            }


            res.json({
                ok: true,
                producto: productoDB
            });
        });
})

// =========================
//  Buscar producto por termino
// =========================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    // se necesita mandar una expresión regular

    let regex = new RegExp(termino, 'i'); // la i es para se insensible a mayúsculas y minúsculas


    // buscar todo sin filtrar y de categoria solo el nombre
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })
        })


});


// =========================
//  Crear un nuevo producto
// =========================
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado

    // retornar el producto
    // como se obtiene el body o lo que viene en el post y aqui viene la descripcion
    let body = req.body;

    // se puede crear un anueva instancia de categorias 
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria

    });

    // rpocedemos a grabarla se obtiene un err o la categoriaDB (que viene de la base de datos)
    producto.save((err, productoDB) => {

        if (err) { // se usa erro 500 porque si sucede un error es un error grave de base de datos
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // if (!productoDB) {
        //     return res.status(400).json({
        //         ok: false,
        //         err
        //     });
        // }

        // si llega hasta aqui es que si grabó el producto y retorna productoDB
        // para poder usar este archivo de producto.js hay que importarla en algún lugar porque así está huerfana y es un simple archivo de javascript
        // y para eso en index.js se debe importar con  app.use(require('./producto'));
        res.status(201).json({
            ok: true,
            producto: productoDB
        })


    });
});



// =========================
//  Actualizar un producto
// =========================
app.put('/productos/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado

    let id = req.params.id;
    let body = req.body;

    // primer se debe verificar que el producto exista
    Producto.findById(id, (err, productoDB) => {

        // verificar si hay algun error en la base de datos
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // si el ID no existe verificar si hay algun error
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        //si todo está bien se actualiza
        // otra forma de hacerlo en lugar de crear un objeto es hacerlo uno por uno
        // se debe actualizar cada propiedad que tenga el esquema Producto que en este momento está contenido en productoDB
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        // ahora toca guardarlo en la base de datos
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });
        });



    });



});

// =========================
//  Eliminar un producto
// =========================
app.delete('/productos/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    // cambiar el estado de disponible del modelo


    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        // si se consigue el producto se le cambia el disponible
        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'producto borrado'
            })
        })



    });

})





module.exports = app;