const { Router } = require('express')
const Usuario = require("../models/Usuario");
const { validationResult, check } = require('express-validator');
const bycript = require('bcryptjs');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

// GET method router
router.get('/', [validarJWT, validarRolAdmin], async function (req, res) {

    try {
        const usuarios = await Usuario.find() // select * from
        res.send(usuarios);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error');
    }

});

//POST method router

router.post('/', [validarJWT, validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('email', 'invalid.email').isEmail(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
    check('password', 'invalid.password').not().isEmpty(),
    check('rol', 'invalid.rol').isIn(['Administrador', 'Docente']),
], async function (req, res) {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        const exixteUsuario = await Usuario.findOne({ email: req.body.email }) // select * from usuario where
        if (exixteUsuario) {
            return res.status(400).send('Email ya exixte ');
        }

        let usuario = Usuario();
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;

        const salt = bycript.genSaltSync();
        const password = bycript.hashSync(req.body.password, salt)
        usuario.password = password;


        usuario.rol = req.body.rol;
        usuario.fechaCreacion = new Date();
        usuario.fechaActualizacion = new Date();

        usuario = await usuario.save(); //insert into usuarios
        res.send(usuario);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error');
    }
});

// PUT method router
router.put('/:id', [validarJWT, validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('email', 'invalid.email').isEmail(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
    check('rol', 'invalid.rol').isIn(['Administrador', 'Docente']),
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).send('Usuario no encontrado');
        }

        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;

        if (req.body.password) {
            const salt = bycript.genSaltSync();
            const password = bycript.hashSync(req.body.password, salt);
            usuario.password = password;
        }

        usuario.rol = req.body.rol;
        usuario.fechaActualizacion = new Date();

        usuario = await usuario.save(); // update usuario
        res.send(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error');
    }
});

// DELETE method router
router.delete('/:id', [validarJWT, validarRolAdmin], async function (req, res) {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).send('Usuario no encontrado');
        }

        await usuario.remove(); // delete usuario
        res.send('Usuario eliminado');
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error');
    }
});


module.exports = router;
