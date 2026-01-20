const express = require('express');
const router = express.Router();

const rutasController = require('../controllers/rutasController');
const unidadesController = require('../controllers/unidadesController');
const tiposController = require('../controllers/tiposController');
const pasajesController = require('../controllers/pasajesController');

router.get('/', (req, res) => res.render('index'));

// Rutas
router.get('/rutas', rutasController.index);
router.get('/rutas/new', rutasController.newForm);
router.post('/rutas', rutasController.store);
router.get('/rutas/:codigo/edit', rutasController.edit);
router.put('/rutas/:codigo', rutasController.update);
router.delete('/rutas/:codigo', rutasController.destroy);

// Unidades
router.get('/unidades', unidadesController.index);
router.get('/unidades/new', unidadesController.newForm);
router.post('/unidades', unidadesController.store);
router.get('/unidades/:codigo/edit', unidadesController.edit);
router.put('/unidades/:codigo', unidadesController.update);
router.delete('/unidades/:codigo', unidadesController.destroy);

// Tipos
router.get('/tipos', tiposController.index);
router.get('/tipos/new', tiposController.newForm);
router.post('/tipos', tiposController.store);
router.get('/tipos/:id/edit', tiposController.edit);
router.put('/tipos/:id', tiposController.update);
router.delete('/tipos/:id', tiposController.destroy);

// Pasajes
router.get('/pasajes', pasajesController.index);
router.get('/pasajes/new', pasajesController.newForm);
router.post('/pasajes', pasajesController.store);
router.get('/pasajes/:id/edit', pasajesController.edit);
router.put('/pasajes/:id', pasajesController.update);
router.post('/pasajes/:id', pasajesController.update);
router.delete('/pasajes/:id', pasajesController.destroy);
router.get('/pasajes/export', pasajesController.exportCsv);

module.exports = router;
