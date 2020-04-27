const express = require('express');

// todos los usuarios pueden manipular los productos, lo que es que deben estar autenticados
const { verificaToken } = require('../middleware/autenticacion');

let app = express();
let Producto = require('../models/producto');



// =========================
//  Obtener todos los productos
// =========================
app.get('/productos', (req, res) => {
    // trae todos los productos
    // populate: usuario y categoria
    // paginado
})


// =========================
//  Obtener un productos por ID
// =========================
app.get('/productos/:id', (req, res) => {
    // trae el producto por el id
    // populate: usuario y categoria
    // paginado
})


// =========================
//  Crear un nuevo producto
// =========================
app.post('/productos', (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
})


// =========================
//  Actualizar un producto
// =========================
app.put('/productos/:id', (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
})

// =========================
//  Eliminar un producto
// =========================
app.delete('/productos/:id', (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    // cambiar el estado de disponible del modelo
})





module.exports = app;