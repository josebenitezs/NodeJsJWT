const { Schema, model } = require('mongoose');

const InventarioSchema = Schema({



    serial: { type: String, required: true, unique: true },
    modelo: { type: String, required: true },
    descripcion: { type: String, required: true },
    fotoEquipo: { type: String, required: true },
    color: { type: String, required: true },
    fechaCompra: { type: String, required: true },
    precio: { type: Number, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    marca: { type: Schema.Types.ObjectId, ref: 'Marca', required: true },
    estadoEquipo: { type: Schema.Types.ObjectId, ref: 'EstadoEquipo', required: true },
    tipoEquipo: { type: Schema.Types.ObjectId, ref: 'TipoEquipo', required: true },
    fechaCreacion: { type: Date, required: true },
    fechaActualizacion: { type: Date, required: true }
});

module.exports = model('Inventario', InventarioSchema);