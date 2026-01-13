const express = require("express");
const router = express.Router();
const unidadesController = require("../controllers/unidadesController");

router.get("/", unidadesController.listar);
router.get("/crear", unidadesController.crear);
router.post("/guardar", unidadesController.guardar);
router.get("/editar/:id", unidadesController.editar);
router.post("/actualizar/:id", unidadesController.actualizar);
router.get("/eliminar/:id", unidadesController.eliminar);

module.exports = router;
