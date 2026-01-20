const tiposModel = require('../models/tiposModel');

async function index(req, res) {
  let tipos = [];
  let dbDown = false;
  try {
    tipos = await tiposModel.list();
  } catch (err) {
    dbDown = true;
    tipos = [];
  }
  res.render('tipos/index', { tipos, dbDown });
}

async function newForm(req, res) {
  res.render('tipos/new');
}

async function store(req, res) {
  const { descripcion, descuento_decimal } = req.body;
  // Convertir porcentaje (0-100) a decimal (0-1)
  const descuentoDecimal = Number(descuento_decimal) / 100;
  await tiposModel.create({ descripcion, descuento_decimal: descuentoDecimal });
  res.redirect('/tipos');
}

async function edit(req, res) {
  const id = req.params.id;
  try {
    const tipo = await tiposModel.get(id);
    res.render('tipos/edit', { tipo });
  } catch (err) {
    res.render('tipos/edit', { tipo: null, error: 'No se pudo obtener el tipo (BD inaccesible).' });
  }
}

async function update(req, res) {
  const { id } = req.params;
  const { descripcion, descuento_decimal } = req.body;
  // Convertir porcentaje (0-100) a decimal (0-1)
  const descuentoDecimal = Number(descuento_decimal) / 100;
  await tiposModel.update({ id, descripcion, descuento_decimal: descuentoDecimal });
  res.redirect('/tipos');
}

async function destroy(req, res) {
  const { id } = req.params;
  await tiposModel.remove(id);
  res.redirect('/tipos');
}

module.exports = { index, newForm, store, edit, update, destroy };
