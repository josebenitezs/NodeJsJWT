const { Router } = require('express')
const Marca = require("../models/Marca");
const { validationResult, check } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');



const router = Router();

// GET method router
router.get('/', [validarJWT, validarRolAdmin], async function (req, res) {

    try {
        const marcas = await Marca.find() // select * from
        res.send(marcas);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error');
    }

});

//POST method router

router.post('/', [validarJWT, validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),


], async function (req, res) {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }



        let marca = Marca();
        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaCreacion = new Date();
        marca.fechaActualizacion = new Date();

        marca = await marca.save(); //insert into marcas
        res.send(marca);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error');
    }
});

// PUT method router
router.put('/:id', [validarJWT, validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let marca = await Marca.findById(req.params.id);
        if (!marca) {
            return res.status(404).send('Marca no encontrado');
        }

        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaActualizacion = new Date();

        marca = await marca.save(); // update marca
        res.send(marca);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error');
    }
});


module.exports = router;
