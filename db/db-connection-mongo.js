const mongoose = require('mongoose');

const getConnection = async () => {
    try {

        const url = 'mongodb://usuario-prueba:D5BaxhDT1J1Q0Fve@ac-ufp38l6-shard-00-00.zc91sc2.mongodb.net:27017,ac-ufp38l6-shard-00-01.zc91sc2.mongodb.net:27017,ac-ufp38l6-shard-00-02.zc91sc2.mongodb.net:27017/inventario-2024-28?ssl=true&replicaSet=atlas-yobvy1-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0'

        await mongoose.connect(url);

        console.log('conexion exitosa');

    } catch (error) {
        console.log(error)
    }

}

module.exports = {
    getConnection
}