const express = require("express");
const router = express.Router();
const pasajesController = require("../controllers/pasajesController");

router.get("/", pasajesController.listar);
router.get("/crear", pasajesController.crear);
router.post("/guardar", pasajesController.guardar);
router.get("/editar/:id", pasajesController.editar);
router.post("/actualizar/:id", pasajesController.actualizar);
router.get("/eliminar/:id", pasajesController.eliminar);
router.get("/filtro", pasajesController.filtrar);
router.get("/exportar", pasajesController.exportarCSV);

module.exports = router;
