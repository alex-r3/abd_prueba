const db = require('../config/db');

const SQL = {
  list: `SELECT id, descripcion, descuento_decimal, is_deleted FROM TIPOS_PASAJE WHERE is_deleted='N' ORDER BY id`,
  get: `SELECT id, descripcion, descuento_decimal, is_deleted FROM TIPOS_PASAJE WHERE id = :id`,
  insert: `INSERT INTO TIPOS_PASAJE (descripcion, descuento_decimal) VALUES (:descripcion, :descuento_decimal)`,
  update: `UPDATE TIPOS_PASAJE SET descripcion = :descripcion, descuento_decimal = :descuento_decimal WHERE id = :id`,
  softDelete: `UPDATE TIPOS_PASAJE SET is_deleted='S' WHERE id = :id`
};

async function list() {
  const res = await db.execute(SQL.list);
  return res.rows;
}

async function get(id) {
  const res = await db.execute(SQL.get, { id });
  return res.rows[0];
}

async function create(data) {
  await db.execute(SQL.insert, data, { autoCommit: true });
}

async function update(data) {
  await db.execute(SQL.update, data, { autoCommit: true });
}

async function remove(id) {
  await db.execute(SQL.softDelete, { id }, { autoCommit: true });
}

module.exports = { SQL, list, get, create, update, remove };
