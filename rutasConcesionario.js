const express = require("express");
const router = express.Router();
const {
  getConcesionarios,
  createConcesionario,
  getConcesionarioById,
  updateConcesionario,
  deleteConcesionario,
  getCoches,
  addCoche,
} = require("../concesionariosController");

router.get("/", getConcesionarios);
router.post("/", createConcesionario);
router.get("/:id", getConcesionarioById);
router.put("/:id", updateConcesionario);
router.delete("/:id", deleteConcesionario);

router.get("/:id/coches", getCoches);
router.post("/:id/coches", addCoche);

module.exports = router;
