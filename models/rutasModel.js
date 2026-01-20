const db = require('../config/db');

const SQL = {
  list: `SELECT codigo, origen, destino, precio_base, is_deleted FROM RUTAS WHERE is_deleted='N' ORDER BY codigo`,
  get: `SELECT codigo, origen, destino, precio_base, is_deleted FROM RUTAS WHERE codigo = :codigo`,
  insert: `INSERT INTO RUTAS (codigo, origen, destino, precio_base) VALUES (:codigo, :origen, :destino, :precio_base)`,
  update: `UPDATE RUTAS SET origen = :origen, destino = :destino, precio_base = :precio_base WHERE codigo = :codigo`,
  softDelete: `UPDATE RUTAS SET is_deleted='S' WHERE codigo = :codigo`
};

async function list() {
  const res = await db.execute(SQL.list);
  return res.rows;
}

async function get(codigo) {
  const res = await db.execute(SQL.get, { codigo });
  return res.rows[0];
}

async function create(data) {
  await db.execute(SQL.insert, data, { autoCommit: true });
}

async function update(data) {
  await db.execute(SQL.update, data, { autoCommit: true });
}

async function remove(codigo) {
  await db.execute(SQL.softDelete, { codigo }, { autoCommit: true });
}

module.exports = { SQL, list, get, create, update, remove };
