const db = require('../config/db');

const SQL = {
  list: `SELECT codigo, placa, capacidad, is_deleted FROM UNIDADES WHERE is_deleted='N' ORDER BY codigo`,
  get: `SELECT codigo, placa, capacidad, is_deleted FROM UNIDADES WHERE codigo = :codigo`,
  insert: `INSERT INTO UNIDADES (codigo, placa, capacidad) VALUES (:codigo, :placa, :capacidad)`,
  update: `UPDATE UNIDADES SET placa = :placa, capacidad = :capacidad WHERE codigo = :codigo`,
  softDelete: `UPDATE UNIDADES SET is_deleted='S' WHERE codigo = :codigo`
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
