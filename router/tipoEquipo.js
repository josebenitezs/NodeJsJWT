const { Router } = require('express')
const TipoEquipo = require("../models/TipoEquipo");
const { validationResult, check } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');



const router = Router();

// GET method router
router.get('/', [validarJWT, validarRolAdmin], async function (req, res) {

    try {
        const tipoEquipos = await TipoEquipo.find() // select * from
        res.send(tipoEquipos);

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



        let tipoEquipo = TipoEquipo();
        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaCreacion = new Date();
        tipoEquipo.fechaActualizacion = new Date();

        tipoEquipo = await tipoEquipo.save(); //insert into tipoEquipos
        res.send(tipoEquipo);

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

        let tipoEquipo = await TipoEquipo.findById(req.params.id);
        if (!tipoEquipo) {
            return res.status(404).send('TipoEquipo no encontrado');
        }

        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaActualizacion = new Date();

        tipoEquipo = await tipoEquipo.save(); // update tipoEquipo
        res.send(tipoEquipo);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error');
    }
});

module.exports = router;
