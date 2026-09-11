const express = require('express');
const app = express();
const PORT = 3000;
const productos = [
    {
        id:1,
        nombre:"Laptop Toshiba",
        precio:10000
    },
    {
        id:2,
        nombre:"Monitor",
        precio:2500
    }
];
app.get("/", (req,res)=>{
    res.send("API PROGRA WEBII");
});
app.get("/api/productos", (req, res) => {
    res.json(productos);
});
app.get("/api/productos/:id", (req, res) => {
    const id = Number(req.params.id);
    const producto = productos.find(
        producto => producto.id === id
    );
    if (!producto) {
        return res.status(404).json({
            mensaje: "Producto no encontrado"
        });
    }
    res.json(producto);
});
app.post("/api/productos", (req, res) => {
    const nuevoProducto = {
        id: productos.leght +1,
        nombre: req.body.nombre,
        precio: req.body.precio
    };
    productos.push(nuevoProducto);
    res.status(201).json(nuevoProducto);
})
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});