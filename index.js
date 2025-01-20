const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri =
  "mongodb+srv://pintomoraless57:b8HN5FjksrxrxrRY@cluster0.ekzn4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
app.use(express.json());
const port = process.env.PORT || 8080;

let db, concesionariosCollection;

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(uri, {
      serverApi: ServerApiVersion.v1,
    });
    console.log("Connected to Database");
    db = client.db("Cluster0");
    concesionariosCollection = db.collection("concesionarios");

    app.listen(port, () => {
      console.log(`Servidor desplegado en puerto: ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

connectToDatabase();

app.get("/", (request, response) => {
  response.send("API de concesionarios y coches");
});

// Lista todos los concesionarios
app.get("/concesionarios", async (request, response) => {
  try {
    const concesionarios = await concesionariosCollection.find().toArray();
    response.json(concesionarios);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Añadir un nuevo concesionario
app.post("/concesionarios", async (request, response) => {
  try {
    const result = await concesionariosCollection.insertOne(request.body);
    response.json({ message: "ok", result });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Obtener un solo concesionario
app.get("/concesionarios/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const result = await concesionariosCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!result) {
      return response
        .status(404)
        .json({ error: "Concesionario no encontrado" });
    }
    response.json(result);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Actualizar un solo concesionario
app.put("/concesionarios/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const result = await concesionariosCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: request.body }
    );
    response.json({ message: "ok", result });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Borrar un concesionario
app.delete("/concesionarios/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const result = await concesionariosCollection.deleteOne({
      _id: new ObjectId(id),
    });
    response.json({ message: "ok", result });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Devuelve todos los coches del concesionario pasado por id
app.get("/concesionarios/:id/coches", async (request, response) => {
  try {
    const id = request.params.id;
    const concesionario = await concesionariosCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!concesionario) {
      return response
        .status(404)
        .json({ error: "Concesionario no encontrado" });
    }
    response.json(concesionario.coches || []);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Añade un nuevo coche al concesionario pasado por id
app.post("/concesionarios/:id/coches", async (request, response) => {
  try {
    const id = request.params.id;
    const coche = request.body;
    coche._id = new ObjectId().toString(); // Ensure each car has a unique identifier
    const result = await concesionariosCollection.updateOne(
      { _id: new ObjectId(id) },
      { $push: { coches: coche } }
    );
    response.json({ message: "ok", result });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Obtiene el coche cuyo id sea cocheId, del concesionario pasado por id
app.get("/concesionarios/:id/coches/:cocheId", async (request, response) => {
  try {
    const { id, cocheId } = request.params;
    const concesionario = await concesionariosCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!concesionario) {
      return response
        .status(404)
        .json({ error: "Concesionario no encontrado" });
    }
    const coche = concesionario.coches.find((c) => c._id === cocheId);
    if (!coche) {
      return response.status(404).json({ error: "Coche no encontrado" });
    }
    response.json(coche);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Actualiza el coche cuyo id sea cocheId, del concesionario pasado por id
app.put("/concesionarios/:id/coches/:cocheId", async (request, response) => {
  try {
    const { id, cocheId } = request.params;
    const coche = request.body;
    const result = await concesionariosCollection.updateOne(
      { _id: new ObjectId(id), "coches._id": cocheId },
      { $set: { "coches.$": coche } }
    );
    response.json({ message: "ok", result });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Borra el coche cuyo id sea cocheId, del concesionario pasado por id
app.delete("/concesionarios/:id/coches/:cocheId", async (request, response) => {
  try {
    const { id, cocheId } = request.params;
    const result = await concesionariosCollection.updateOne(
      { _id: new ObjectId(id) },
      { $pull: { coches: { _id: cocheId } } }
    );
    response.json({ message: "ok", result });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});
