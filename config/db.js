const oracledb = require('oracledb');
require('dotenv').config();

const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASS,
  connectString: process.env.ORACLE_CONN,
  poolMin: 2,        // Mínimo de conexiones abiertas
  poolMax: 10,       // Máximo de conexiones
  poolIncrement: 1,
  poolAlias: 'default',
  poolPingInterval: 60, // Revisa que la conexión siga viva cada 60 seg
  poolTimeout: 60,
};

// Variable para guardar el pool
let pool;

async function getPool() {
  if (!pool) {
    pool = await oracledb.createPool(dbConfig);
    console.log("Pool de conexiones creado");
  }
  return pool;
}

async function execute(query, binds = {}, options = {}) {
  let connection;
  options.outFormat = oracledb.OUT_FORMAT_OBJECT;

  try {
    // En lugar de getConnection(dbConfig), pedimos una al pool
    const currentPool = await getPool();
    connection = await currentPool.getConnection();
    
    const result = await connection.execute(query, binds, options);
    
    // Si usas autoCommit en el execute, no necesitas el commit manual aquí
    return result;
  } catch (err) {
    console.error('DB execute error:', err.message || err);
    throw err;
  } finally {
    if (connection) {
      // Importante: En un pool, .close() no cierra la conexión, 
      // sino que la devuelve al pool para que otro la use.
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
}

module.exports = { execute };