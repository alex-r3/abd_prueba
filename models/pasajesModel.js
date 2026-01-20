const db = require('../config/db');

const SQL = {
  listBase: `
    SELECT 
      p.id,
      TO_CHAR(p.fecha_hora, 'YYYY-MM-DD HH24:MI:SS') fecha,
      u.placa,
      ru.codigo ruta_codigo,
      ru.origen || '-' || ru.destino ruta,
      p.valor_base,
      p.valor_descuento,
      tp.descripcion tipo,
      p.valor_final
    FROM PASAJES p
    JOIN UNIDADES u ON p.unidad_id = u.codigo AND u.is_deleted = 'N'
    JOIN RUTAS ru ON p.ruta_id = ru.codigo AND ru.is_deleted = 'N'
    JOIN TIPOS_PASAJE tp ON p.tipo_pasaje_id = tp.id AND tp.is_deleted = 'N'
    WHERE p.is_deleted = 'N'
  `,
  insert: `INSERT INTO PASAJES (unidad_id, ruta_id, tipo_pasaje_id) VALUES (:unidad_id, :ruta_id, :tipo_pasaje_id)`,
  get: `SELECT * FROM PASAJES WHERE id = :id`,
  update: `UPDATE PASAJES SET unidad_id = :unidad_id, ruta_id = :ruta_id, tipo_pasaje_id = :tipo_pasaje_id WHERE id = :id`,
  softDelete: `UPDATE PASAJES SET is_deleted='S' WHERE id = :id`
};

async function list(filters = {}) {
  let where = '';
  const binds = {};

  if (filters.ruta) {
    where += ` AND ru.codigo = :ruta`;
    binds.ruta = filters.ruta;
  }
  if (filters.start) {
    where += ` AND p.fecha_hora >= TO_DATE(:start, 'YYYY-MM-DD')`;
    binds.start = filters.start;
  }
  if (filters.end) {
    where += ` AND p.fecha_hora <= TO_DATE(:end, 'YYYY-MM-DD') + 1 - 1/86400`;
    binds.end = filters.end;
  }

  const query = SQL.listBase + where + ' ORDER BY p.fecha_hora';
  const res = await db.execute(query, binds);
  return res.rows;
}

async function create(data) {
  await db.execute(SQL.insert, data, { autoCommit: true });
}

async function update(id, data) {
  const binds = Object.assign({}, data, { id });
  await db.execute(SQL.update, binds, { autoCommit: true });
}

async function get(id) {
  const res = await db.execute(SQL.get, { id });
  return res.rows[0];
}

async function remove(id) {
  await db.execute(SQL.softDelete, { id }, { autoCommit: true });
}

module.exports = { SQL, list, create, get, update, remove };
