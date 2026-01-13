const { getConnection } = require("../../config/db-connection");

exports.listar = async (req, res) => {
    try {
        const connection = getConnection();
        const result = await connection.execute("SELECT * FROM RUTAS ORDER BY id_ruta");
        res.render("rutas/lista", { rutas: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al listar rutas");
    }
};

exports.crear = (req, res) => {
    res.render("rutas/crear");
};

exports.guardar = async (req, res) => {
    try {
        const { nombre_ruta, origen, destino } = req.body;
        const connection = getConnection();
        
        await connection.execute(
            "INSERT INTO RUTAS (nombre_ruta, origen, destino) VALUES (:nombre_ruta, :origen, :destino)",
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
            "SELECT * FROM RUTAS WHERE id_ruta = :id",
            [id]
        );
        
        if (result.rows.length === 0) {
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
            "DELETE FROM RUTAS WHERE id_ruta = :id",
            [id],
            { autoCommit: true }
        );
        
        res.redirect("/rutas");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al eliminar ruta");
    }
};
