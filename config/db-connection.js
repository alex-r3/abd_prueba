const oracledb = require("oracledb");

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECTION_STRING,
    // IMPORTANTE: Estos parámetros evitan que Render/Google cierren la conexión
    expireTime: 1,           // Envía un "latido" cada 1 min
    connectTimeout: 60000,   // 60 segundos de espera para conectar
};

let connection;

async function initializeConnection() {
    try {
        // Si ya existe una conexión, no creamos otra (evita duplicados)
        if (connection) return connection;

        connection = await oracledb.getConnection(dbConfig);
        console.log("Conexión establecida exitosamente (Modo Thin)");
        return connection;
    } catch (err) {
        console.error("Error al conectar a Oracle:", err);
        throw err;
    }
}

module.exports = {
    initializeConnection,
    getConnection: () => connection,
};