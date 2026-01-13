const oracledb = require("oracledb");

// Configuración básica
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Configuración de conexión
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECTION_STRING,
    poolMin: 2,
    poolMax: 5,
};

// Crear conexión única
let connection;

async function initializeConnection() {
    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log("Conexión a la base de datos establecida exitosamente");
    } catch (err) {
        console.error("Error al conectar a la base de datos:", err);
        throw err;
    }
}

// Exportar la función para inicializar y la conexión
module.exports = {
    initializeConnection,
    getConnection: () => connection,
};
