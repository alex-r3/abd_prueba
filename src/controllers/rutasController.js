const { getConnection } = require("../../config/db-connection");

exports.listar = async (req, res) => {
    try {
        const connection = getConnection();
        const result = await connection.execute("SELECT * FROM RUTAS WHERE activo = 1 ORDER BY id_ruta");
        res.render("rutas/lista", { rutas: result.rows || [] });
    } catch (err) {
        console.error(err);
        res.render("rutas/lista", { rutas: [] });
    }
};

exports.crear = async (req, res) => {
    try {
        res.render("rutas/crear");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al cargar formulario");
    }
};

exports.guardar = async (req, res) => {
    try {
        const { nombre_ruta, origen, destino } = req.body;
        const connection = getConnection();
        
        await connection.execute(
            "INSERT INTO RUTAS (nombre_ruta, origen, destino, activo) VALUES (:nombre_ruta, :origen, :destino, 1)",
            [nombre_ruta, origen, destino],
            { autoCommit: true }
        );
        
        res.redirect("/rutas");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al guardar ruta");
    }
};

exports.editar = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = getConnection();
        const result = await connection.execute(
            "SELECT * FROM RUTAS WHERE id_ruta = :id AND activo = 1",
            [id]
        );
        
        if (!result.rows || result.rows.length === 0) {
            return res.status(404).send("Ruta no encontrada");
        }
        
        res.render("rutas/editar", { ruta: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al editar ruta");
    }
};

exports.actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_ruta, origen, destino } = req.body;
        const connection = getConnection();
        
        await connection.execute(
            "UPDATE RUTAS SET nombre_ruta = :nombre_ruta, origen = :origen, destino = :destino WHERE id_ruta = :id",
            [nombre_ruta, origen, destino, id],
            { autoCommit: true }
        );
        
        res.redirect("/rutas");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al actualizar ruta");
    }
};

exports.eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = getConnection();
        
        await connection.execute(
            "UPDATE RUTAS SET activo = 0 WHERE id_ruta = :id",
            [id],
            { autoCommit: true }
        );
        
        res.redirect("/rutas");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al eliminar ruta");
    }
};
