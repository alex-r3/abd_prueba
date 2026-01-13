const { getConnection } = require("../../config/db-connection");
const oracledb = require("oracledb");

exports.listar = async (req, res) => {
    try {
        const connection = getConnection();
        const result = await connection.execute(`
            SELECT 
                p.id_pasaje, 
                p.valor_final, 
                p.fecha_hora,
                r.nombre_ruta,
                u.placa,
                tp.descripcion
            FROM PASAJES p
            JOIN RUTAS r ON p.id_ruta = r.id_ruta
            JOIN UNIDADES u ON p.id_unidad = u.id_unidad
            JOIN TIPOS_PASAJE tp ON p.id_tipo = tp.id_tipo
            ORDER BY p.fecha_hora DESC
        `);
        res.render("pasajes/lista", { pasajes: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al listar pasajes");
    }
};

exports.crear = async (req, res) => {
    try {
        const connection = getConnection();
        const rutas = await connection.execute("SELECT * FROM RUTAS");
        const unidades = await connection.execute("SELECT * FROM UNIDADES");
        const tipos = await connection.execute("SELECT * FROM TIPOS_PASAJE");
        
        res.render("pasajes/crear", { 
            rutas: rutas.rows, 
            unidades: unidades.rows,
            tipos: tipos.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al cargar formulario");
    }
};

exports.guardar = async (req, res) => {
    try {
        const { id_ruta, id_unidad, id_tipo, valor_final } = req.body;
        const connection = getConnection();
        
        await connection.execute(
            "INSERT INTO PASAJES (id_ruta, id_unidad, id_tipo, valor_final) VALUES (:id_ruta, :id_unidad, :id_tipo, :valor_final)",
            [parseInt(id_ruta), parseInt(id_unidad), parseInt(id_tipo), parseFloat(valor_final)],
            { autoCommit: true }
        );
        
        res.redirect("/pasajes");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al guardar pasaje");
    }
};

exports.editar = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = getConnection();
        const pasaje = await connection.execute(
            "SELECT * FROM PASAJES WHERE id_pasaje = :id",
            [id]
        );
        
        if (pasaje.rows.length === 0) {
            return res.status(404).send("Pasaje no encontrado");
        }
        
        const rutas = await connection.execute("SELECT * FROM RUTAS");
        const unidades = await connection.execute("SELECT * FROM UNIDADES");
        const tipos = await connection.execute("SELECT * FROM TIPOS_PASAJE");
        
        res.render("pasajes/editar", { 
            pasaje: pasaje.rows[0],
            rutas: rutas.rows, 
            unidades: unidades.rows,
            tipos: tipos.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al editar pasaje");
    }
};

exports.actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_ruta, id_unidad, id_tipo, valor_final } = req.body;
        const connection = getConnection();
        
        await connection.execute(
            "UPDATE PASAJES SET id_ruta = :id_ruta, id_unidad = :id_unidad, id_tipo = :id_tipo, valor_final = :valor_final WHERE id_pasaje = :id",
            [parseInt(id_ruta), parseInt(id_unidad), parseInt(id_tipo), parseFloat(valor_final), id],
            { autoCommit: true }
        );
        
        res.redirect("/pasajes");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al actualizar pasaje");
    }
};

exports.eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = getConnection();
        
        await connection.execute(
            "DELETE FROM PASAJES WHERE id_pasaje = :id",
            [id],
            { autoCommit: true }
        );
        
        res.redirect("/pasajes");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al eliminar pasaje");
    }
};

exports.filtrar = async (req, res) => {
    try {
        const { id_ruta, fecha_inicio, fecha_fin } = req.query;
        const connection = getConnection();
        
        let query = `
            SELECT 
                p.id_pasaje, 
                p.valor_final, 
                p.fecha_hora,
                r.nombre_ruta,
                u.placa,
                tp.descripcion
            FROM PASAJES p
            JOIN RUTAS r ON p.id_ruta = r.id_ruta
            JOIN UNIDADES u ON p.id_unidad = u.id_unidad
            JOIN TIPOS_PASAJE tp ON p.id_tipo = tp.id_tipo
            WHERE 1=1
        `;
        
        const params = [];
        
        if (id_ruta) {
            query += " AND p.id_ruta = :id_ruta";
            params.push(id_ruta);
        }
        
        if (fecha_inicio) {
            query += " AND TRUNC(p.fecha_hora) >= TO_DATE(:fecha_inicio, 'YYYY-MM-DD')";
            params.push(fecha_inicio);
        }
        
        if (fecha_fin) {
            query += " AND TRUNC(p.fecha_hora) <= TO_DATE(:fecha_fin, 'YYYY-MM-DD')";
            params.push(fecha_fin);
        }
        
        query += " ORDER BY p.fecha_hora DESC";
        
        const result = await connection.execute(query, params);
        const rutas = await connection.execute("SELECT * FROM RUTAS");
        
        res.render("pasajes/filtro", { 
            pasajes: result.rows,
            rutas: rutas.rows,
            filtros: { id_ruta, fecha_inicio, fecha_fin }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al filtrar pasajes");
    }
};

// Función para exportar CSV usando cursor PL/SQL
exports.exportarCSV = async (req, res) => {
    try {
        const connection = getConnection();
        
        // Llamar al procedimiento almacenado PL/SQL que usa cursores
        const result = await connection.execute(
            `BEGIN
                EXPORTAR_PASAJES_CSV(:p_csv);
            END;`,
            { p_csv: { dir: oracledb.BIND_OUT, type: oracledb.CLOB } }
        );
        
        // Leer el contenido del CLOB
        const lob = result.outBinds.p_csv;
        let csvContent = '';
        
        if (lob) {
            csvContent = await lob.getData();
            await lob.close();
        }
        
        // Configurar headers para descarga
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="pasajes_' + new Date().getTime() + '.csv"');
        res.send(csvContent);
        
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al exportar CSV: " + err.message);
    }
};
