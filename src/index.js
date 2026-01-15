require('dotenv').config();
const express = require("express");
const { initializeConnection } = require("../config/db-connection");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "./src/views");

// Importar rutas
const rutasRoutes = require("./routes/rutas");
const unidadesRoutes = require("./routes/unidades");
const tiposPasajeRoutes = require("./routes/tiposPasaje");
const pasajesRoutes = require("./routes/pasajes");

// Usar rutas
app.use("/rutas", rutasRoutes);
app.use("/unidades", unidadesRoutes);
app.use("/tipos-pasaje", tiposPasajeRoutes);
app.use("/pasajes", pasajesRoutes);

// Página de inicio
app.get("/", (req, res) => {
    res.render("index");
});

// Iniciar servidor
app.listen(port, async () => {
    try {
        await initializeConnection();
        console.log(`Servidor en http://localhost:${port}`);
    } catch (err) {
        console.error("Error al iniciar:", err);
        process.exit(1);
    }
});
