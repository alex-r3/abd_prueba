const express = require("express");
const router = express.Router();
const rutasController = require("../controllers/rutasController");

router.get("/", rutasController.listar);
router.get("/crear", rutasController.crear);
router.post("/guardar", rutasController.guardar);
router.get("/editar/:id", rutasController.editar);
router.post("/actualizar/:id", rutasController.actualizar);
router.get("/eliminar/:id", rutasController.eliminar);

module.exports = router;
