const express = require("express");
const router = express.Router();
const tiposPasajeController = require("../controllers/tiposPasajeController");

router.get("/", tiposPasajeController.listar);
router.get("/crear", tiposPasajeController.crear);
router.post("/guardar", tiposPasajeController.guardar);
router.get("/editar/:id", tiposPasajeController.editar);
router.post("/actualizar/:id", tiposPasajeController.actualizar);
router.get("/eliminar/:id", tiposPasajeController.eliminar);

module.exports = router;
