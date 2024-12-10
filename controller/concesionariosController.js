const { concesionarios } = require("../concesionarios");

// Obtener todos los concesionarios
const getConcesionarios = (req, res) => {
  res.json(concesionarios);
};

// Crear un nuevo concesionario
const createConcesionario = (req, res) => {
  const { nombre, direccion } = req.body;
  const nuevoConcesionario = {
    id: concesionarios.length + 1,
    nombre,
    direccion,
    coches: [],
  };
  concesionarios.push(nuevoConcesionario);
  res.status(201).json(nuevoConcesionario);
};

// Obtener un concesionario por ID
const getConcesionarioById = (req, res) => {
  const id = parseInt(req.params.id);
  const concesionario = concesionarios.find((c) => c.id === id);
  if (!concesionario) {
    return res.status(404).json({ message: "Concesionario no encontrado" });
  }
  res.json(concesionario);
};

// Actualizar un concesionario por ID
const updateConcesionario = (req, res) => {
  const id = parseInt(req.params.id);
  const concesionario = concesionarios.find((c) => c.id === id);
  if (!concesionario) {
    return res.status(404).json({ message: "Concesionario no encontrado" });
  }
  Object.assign(concesionario, req.body);
  res.json({ message: "Concesionario actualizado", concesionario });
};

// Eliminar un concesionario por ID
const deleteConcesionario = (req, res) => {
  const id = parseInt(req.params.id);
  const index = concesionarios.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Concesionario no encontrado" });
  }
  concesionarios.splice(index, 1);
  res.json({ message: "Concesionario eliminado" });
};

// Obtener todos los coches de un concesionario
const getCoches = (req, res) => {
  const id = parseInt(req.params.id);
  const concesionario = concesionarios.find((c) => c.id === id);
  if (!concesionario) {
    return res.status(404).json({ message: "Concesionario no encontrado" });
  }
  res.json(concesionario.coches);
};

// Añadir un coche a un concesionario
const addCoche = (req, res) => {
  const id = parseInt(req.params.id);
  const concesionario = concesionarios.find((c) => c.id === id);
  if (!concesionario) {
    return res.status(404).json({ message: "Concesionario no encontrado" });
  }
  const nuevoCoche = { id: concesionario.coches.length + 1, ...req.body };
  concesionario.coches.push(nuevoCoche);
  res.status(201).json(nuevoCoche);
};

module.exports = {
  getConcesionarios,
  createConcesionario,
  getConcesionarioById,
  updateConcesionario,
  deleteConcesionario,
  getCoches,
  addCoche,
};
