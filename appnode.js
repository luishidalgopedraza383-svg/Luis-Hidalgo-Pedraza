const http = require('http');
const url = require('url');

const PORT = 3000;

let clientes = [
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

function responderJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify(data));
}

function leerBody(req, callback) {
    let body = "";
    req.on("data", chunk => {
        body += chunk.toString();
    });
    req.on("end", () => {
        try {
            const data = body ? JSON.parse(body) : {};
            callback(null, data);
        } catch (error) {
            callback(error, null);
        }
    });
}

const servidor = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const metodo = req.method;

    // Ruta principal
    if (path === "/" && metodo === "GET") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        return res.end("HOLAAAAAAA");
    }

    // GET /api/clientes -> lista todos los clientes
    if (path === "/api/clientes" && metodo === "GET") {
        return responderJSON(res, 200, clientes);
    }

    // GET /api/clientes/:id -> obtiene un cliente por id
    if (path.match(/^\/api\/clientes\/\d+$/) && metodo === "GET") {
        const id = Number(path.split("/")[3]);
        const cliente = clientes.find(cliente => cliente.id === id);

        if (!cliente) {
            return responderJSON(res, 404, { mensaje: "Cliente no encontrado" });
        }
        return responderJSON(res, 200, cliente);
    }

    // POST /api/clientes -> crea un nuevo cliente
    if (path === "/api/clientes" && metodo === "POST") {
        return leerBody(req, (error, data) => {
            if (error) {
                return responderJSON(res, 400, { mensaje: "JSON inválido" });
            }

            const { nombre, correo, telefono, direccion } = data;

            if (!nombre || !correo || !telefono || !direccion) {
                return responderJSON(res, 400, {
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
            return responderJSON(res, 201, nuevoCliente);
        });
    }

    // PUT /api/clientes/:id -> actualiza un cliente existente
    if (path.match(/^\/api\/clientes\/\d+$/) && metodo === "PUT") {
        const id = Number(path.split("/")[3]);
        const cliente = clientes.find(cliente => cliente.id === id);

        if (!cliente) {
            return responderJSON(res, 404, { mensaje: "Cliente no encontrado" });
        }

        return leerBody(req, (error, data) => {
            if (error) {
                return responderJSON(res, 400, { mensaje: "JSON inválido" });
            }

            const { nombre, correo, telefono, direccion } = data;

            if (nombre) cliente.nombre = nombre;
            if (correo) cliente.correo = correo;
            if (telefono) cliente.telefono = telefono;
            if (direccion) cliente.direccion = direccion;

            return responderJSON(res, 200, cliente);
        });
    }

    // DELETE /api/clientes/:id -> elimina un cliente
    if (path.match(/^\/api\/clientes\/\d+$/) && metodo === "DELETE") {
        const id = Number(path.split("/")[3]);
        const index = clientes.findIndex(cliente => cliente.id === id);

        if (index === -1) {
            return responderJSON(res, 404, { mensaje: "Cliente no encontrado" });
        }

        clientes.splice(index, 1);
        return responderJSON(res, 200, { mensaje: "Cliente eliminado correctamente" });
    }

    // Si ninguna ruta coincide
    responderJSON(res, 404, { mensaje: "Ruta no encontrada" });
});

servidor.listen(PORT, () => {
    console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
});
