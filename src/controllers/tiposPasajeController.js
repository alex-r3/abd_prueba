const { getConnection } = require("../../config/db-connection");

exports.listar = async (req, res) => {
    try {
        const connection = getConnection();
        const result = await connection.execute("SELECT * FROM TIPOS_PASAJE ORDER BY id_tipo");
        res.render("tiposPasaje/lista", { tipos: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al listar tipos de pasaje");
    }
};

exports.crear = (req, res) => {
    res.render("tiposPasaje/crear");
};

exports.guardar = async (req, res) => {
    try {
        const { descripcion, precio_base } = req.body;
        const connection = getConnection();
        
        await connection.execute(
            "INSERT INTO TIPOS_PASAJE (descripcion, precio_base) VALUES (:descripcion, :precio_base)",
            [descripcion, parseFloat(precio_base)],
            { autoCommit: true }
        );
        
        res.redirect("/tipos-pasaje");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al guardar tipo de pasaje");
    }
};

exports.editar = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = getConnection();
        const result = await connection.execute(
            "SELECT * FROM TIPOS_PASAJE WHERE id_tipo = :id",
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).send("Tipo de pasaje no encontrado");
        }
        
        res.render("tiposPasaje/editar", { tipo: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al editar tipo de pasaje");
    }
};

exports.actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion, precio_base } = req.body;
        const connection = getConnection();
        
        await connection.execute(
            "UPDATE TIPOS_PASAJE SET descripcion = :descripcion, precio_base = :precio_base WHERE id_tipo = :id",
            [descripcion, parseFloat(precio_base), id],
            { autoCommit: true }
        );
        
        res.redirect("/tipos-pasaje");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al actualizar tipo de pasaje");
    }
};

exports.eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = getConnection();
        
        await connection.execute(
            "DELETE FROM TIPOS_PASAJE WHERE id_tipo = :id",
            [id],
            { autoCommit: true }
        );
        
        res.redirect("/tipos-pasaje");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al eliminar tipo de pasaje");
    }
};
