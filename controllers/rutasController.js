const rutasModel = require('../models/rutasModel');

async function index(req, res) {
  let rutas = [];
  let dbDown = false;
  try {
    rutas = await rutasModel.list();
  } catch (err) {
    dbDown = true;
    rutas = [];
  }
  res.render('rutas/index', { rutas, dbDown });
}

async function newForm(req, res) {
  res.render('rutas/new');
}

async function store(req, res) {
  const { codigo, origen, destino, precio_base } = req.body;
  await rutasModel.create({ codigo, origen, destino, precio_base });
  res.redirect('/rutas');
}

async function edit(req, res) {
  const codigo = req.params.codigo;
  try {
    const ruta = await rutasModel.get(codigo);
    res.render('rutas/edit', { ruta });
  } catch (err) {
    res.render('rutas/edit', { ruta: null, error: 'No se pudo obtener la ruta (BD inaccesible).' });
  }
}

async function update(req, res) {
  const { codigo } = req.params;
  const { origen, destino, precio_base } = req.body;
  await rutasModel.update({ codigo, origen, destino, precio_base });
  res.redirect('/rutas');
}

async function destroy(req, res) {
  const { codigo } = req.params;
  await rutasModel.remove(codigo);
  res.redirect('/rutas');
}

module.exports = { index, newForm, store, edit, update, destroy };
