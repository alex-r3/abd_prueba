const { getConnection } = require("../../config/db-connection");

exports.listar = async (req, res) => {
    try {
        const connection = getConnection();
        const result = await connection.execute("SELECT * FROM UNIDADES WHERE activo = 1 ORDER BY id_unidad");
        res.render("unidades/lista", { unidades: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al listar unidades");
    }
};

exports.crear = (req, res) => {
    res.render("unidades/crear");
};

exports.guardar = async (req, res) => {
    try {
        const { numero_disco, placa, capacidad } = req.body;
        const connection = getConnection();
        
        await connection.execute(
            "INSERT INTO UNIDADES (numero_disco, placa, capacidad, activo) VALUES (:numero_disco, :placa, :capacidad, 1)",
            [numero_disco, placa, parseInt(capacidad)],
            { autoCommit: true }
        );
        
        res.redirect("/unidades");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al guardar unidad");
    }
};

exports.editar = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = getConnection();
        const result = await connection.execute(
            "SELECT * FROM UNIDADES WHERE id_unidad = :id AND activo = 1",
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).send("Unidad no encontrada");
        }
        
        res.render("unidades/editar", { unidad: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al editar unidad");
    }
};

exports.actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { numero_disco, placa, capacidad } = req.body;
        const connection = getConnection();
        
        await connection.execute(
            "UPDATE UNIDADES SET numero_disco = :numero_disco, placa = :placa, capacidad = :capacidad WHERE id_unidad = :id",
            [numero_disco, placa, parseInt(capacidad), id],
            { autoCommit: true }
        );
        
        res.redirect("/unidades");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al actualizar unidad");
    }
};

exports.eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = getConnection();
        
        await connection.execute(
            "UPDATE UNIDADES SET activo = 0 WHERE id_unidad = :id",
            [id],
            { autoCommit: true }
        );
        
        res.redirect("/unidades");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al eliminar unidad");
    }
};
