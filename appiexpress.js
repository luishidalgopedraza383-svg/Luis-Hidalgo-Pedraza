const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const clientes = [
    {
        id: 1,
        nombre: "Jose Luis",
        correo: "josejose799@gmail.com",
        telefono: "48345202",
        direccion: "Av 2 de agosto, La Paz"
    },
    {
        id: 2,
        nombre: "Sara Lopez",
        correo: "SLopes577@gmail.com",
        telefono: "5454395",
        direccion: "av 2 de agosto, La Paz"
    }
];

app.get("/", (req, res) => {
    res.send("ALOJAAAAA");
});

app.get("/api/clientes", (req, res) => {
    res.json(clientes);
});

app.get("/api/clientes/:id", (req, res) => {
    const id = Number(req.params.id);
    const cliente = clientes.find(
        cliente => cliente.id === id
    );

    if (!cliente) {
        return res.status(404).json({
            mensaje: "Cliente no encontrado"
        });
    }

    res.json(cliente);
});

app.post("/api/clientes", (req, res) => {
    const { nombre, correo, telefono, direccion } = req.body;

    if (!nombre || !correo || !telefono || !direccion) {
        return res.status(400).json({
            mensaje: "Faltan datos del cliente (nombre, correo, telefono, direccion)"
        });
    }

    const nuevoCliente = {
        id: clientes.length + 1, // generamos el id tomando el ultimo y sumando 1
        nombre,
        correo,
        telefono,
        direccion
    };

    clientes.push(nuevoCliente);
    res.status(201).json(nuevoCliente);
});

app.put("/api/clientes/:id", (req, res) => {
    const id = Number(req.params.id);
    const cliente = clientes.find(cliente => cliente.id === id);

    if (!cliente) {
        return res.status(404).json({
            mensaje: "Cliente no encontrado"
        });
    }

    const { nombre, correo, telefono, direccion } = req.body;

    if (nombre) cliente.nombre = nombre;
    if (correo) cliente.correo = correo;
    if (telefono) cliente.telefono = telefono;
    if (direccion) cliente.direccion = direccion;

    res.status(200).json(cliente);
});

app.delete("/api/clientes/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = clientes.findIndex(cliente => cliente.id === id);

    if (index === -1) {
        return res.status(404).json({
            mensaje: "Cliente no encontrado"
        });
    }

    clientes.splice(index, 1);
    res.status(200).json({
        mensaje: "Cliente eliminado correctamente"
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});