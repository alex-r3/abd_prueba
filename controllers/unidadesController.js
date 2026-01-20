const unidadesModel = require('../models/unidadesModel');

async function index(req, res) {
  let unidades = [];
  let dbDown = false;
  try {
    unidades = await unidadesModel.list();
  } catch (err) {
    dbDown = true;
    unidades = [];
  }
  res.render('unidades/index', { unidades, dbDown });
}

async function newForm(req, res) {
  res.render('unidades/new');
}

async function store(req, res) {
  const { codigo, placa, capacidad } = req.body;
  await unidadesModel.create({ codigo, placa, capacidad });
  res.redirect('/unidades');
}

async function edit(req, res) {
  const codigo = req.params.codigo;
  try {
    const unidad = await unidadesModel.get(codigo);
    res.render('unidades/edit', { unidad });
  } catch (err) {
    res.render('unidades/edit', { unidad: null, error: 'No se pudo obtener la unidad (BD inaccesible).' });
  }
}

async function update(req, res) {
  const { codigo } = req.params;
  const { placa, capacidad } = req.body;
  await unidadesModel.update({ codigo, placa, capacidad });
  res.redirect('/unidades');
}

async function destroy(req, res) {
  const { codigo } = req.params;
  await unidadesModel.remove(codigo);
  res.redirect('/unidades');
}

module.exports = { index, newForm, store, edit, update, destroy };
