const pasajesModel = require('../models/pasajesModel');
const rutasModel = require('../models/rutasModel');
const unidadesModel = require('../models/unidadesModel');
const tiposModel = require('../models/tiposModel');

function toCSV(rows) {
  if (!rows || rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const r of rows) {
    const vals = headers.map(h => (r[h] === null || r[h] === undefined) ? '' : String(r[h]).replace(/,/g, ''));
    lines.push(vals.join(','));
  }
  return lines.join('\n');
}

async function index(req, res) {
  const filters = { ruta: req.query.ruta || null, start: req.query.start || null, end: req.query.end || null };
  let pasajes = [];
  let rutas = [];
  let unidades = [];
  let tipos = [];
  let dbDown = false;
  try {
    pasajes = await pasajesModel.list(filters);
    rutas = await rutasModel.list();
    unidades = await unidadesModel.list();
    tipos = await tiposModel.list();
  } catch (err) {
    dbDown = true;
    pasajes = [];
    rutas = [];
    unidades = [];
    tipos = [];
  }
  res.render('pasajes/index', { pasajes, rutas, unidades, tipos, filters, dbDown });
}

async function newForm(req, res) {
  let rutas = [];
  let unidades = [];
  let tipos = [];
  let dbDown = false;
  try {
    rutas = await rutasModel.list();
    unidades = await unidadesModel.list();
    tipos = await tiposModel.list();
  } catch (err) {
    dbDown = true;
  }
  res.render('pasajes/new', { rutas, unidades, tipos, dbDown });
}

async function store(req, res) {
  const { unidad_id, ruta_id, tipo_pasaje_id } = req.body;
  await pasajesModel.create({ unidad_id, ruta_id, tipo_pasaje_id });
  res.redirect('/pasajes');
}

async function destroy(req, res) {
  const { id } = req.params;
  await pasajesModel.remove(id);
  res.redirect('/pasajes');
}

async function edit(req, res){
  const { id } = req.params;
  let rutas = [];
  let unidades = [];
  let tipos = [];
  let pasaje = null;
  let dbDown = false;
  try{
    pasaje = await pasajesModel.get(id);
    rutas = await rutasModel.list();
    unidades = await unidadesModel.list();
    tipos = await tiposModel.list();
  }catch(err){
    dbDown = true;
  }
  res.render('pasajes/edit', { pasaje, rutas, unidades, tipos, dbDown });
}

async function update(req, res){
  const { id } = req.params;
  const { unidad_id, ruta_id, tipo_pasaje_id } = req.body;
  await pasajesModel.update(id, { unidad_id, ruta_id, tipo_pasaje_id });
  res.redirect('/pasajes');
}

async function exportCsv(req, res) {
  const filters = { ruta: req.query.ruta || null, start: req.query.start || null, end: req.query.end || null };
  try {
    const rows = await pasajesModel.list(filters);
    const csv = toCSV(rows.map(r => ({
      ID: r.ID || r.id,
      FECHA: r.FECHA || r.fecha,
      PLACA: r.PLACA || r.placa,
      RUTA: r.RUTA || r.ruta,
      BASE: r.VALOR_BASE || r.valor_base,
      DESCUENTO: r.VALOR_DESCUENTO || r.valor_descuento,
      TIPO: r.TIPO || r.tipo,
      FINAL: r.VALOR_FINAL || r.valor_final
    })));

    // Generar nombre de archivo con fecha
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
    const filename = `pasajes_${dateStr}_${timeStr}.csv`;

    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-type', 'text/csv; charset=utf-8');
    res.send(csv);
  } catch (err) {
    res.status(503).send('No se pudo generar CSV: base de datos no disponible.');
  }
}

module.exports = { index, newForm, store, destroy, exportCsv, edit, update };
