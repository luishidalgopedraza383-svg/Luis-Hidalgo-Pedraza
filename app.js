//PRIMER SERVIDOR EN NODE.JS
const http = require('http');
const servidor = http.createServer((req, res) => {
    res.writeHead(200,{
        "Content-Type": "application/json"
    });
    const estudiante ={
        nombre: "Juan",
        carrera: "Ingenieria en Sistemas",
        materia: "Programacion WebII"
    };
    res.end(JSON.stringify(estudiante));
});
servidor.listen(3000, () => {
    console.log("Servidor ejecutandose en http://localhost:3000");
});