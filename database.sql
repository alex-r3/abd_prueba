DROP TABLE PASAJES CASCADE CONSTRAINTS;
DROP TABLE TIPOS_PASAJE CASCADE CONSTRAINTS;
DROP TABLE UNIDADES CASCADE CONSTRAINTS;
DROP TABLE RUTAS CASCADE CONSTRAINTS;

-- 1. RUTAS
-- Nota: Quitamos el UNIQUE de nombre_ruta para manejarlo por lógica o índice condicional
CREATE TABLE RUTAS (
    id_ruta NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_ruta VARCHAR2(100) NOT NULL,
    origen VARCHAR2(100) NOT NULL,
    destino VARCHAR2(100) NOT NULL,
    activo NUMBER(1) DEFAULT 1 NOT NULL CHECK (activo IN (0,1))
);

-- 2. UNIDADES
CREATE TABLE UNIDADES (
    id_unidad NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    numero_disco VARCHAR2(10) NOT NULL,
    placa VARCHAR2(15) NOT NULL,
    capacidad NUMBER(3) CHECK (capacidad > 0),
    activo NUMBER(1) DEFAULT 1 NOT NULL CHECK (activo IN (0,1))
);

-- 3. TIPOS DE PASAJE
CREATE TABLE TIPOS_PASAJE (
    id_tipo NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR2(50) NOT NULL,
    precio_base NUMBER(5,2) NOT NULL CHECK (precio_base >= 0),
    activo NUMBER(1) DEFAULT 1 NOT NULL CHECK (activo IN (0,1))
);

-- 4. PASAJES
CREATE TABLE PASAJES (
    id_pasaje NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_ruta NUMBER NOT NULL,
    id_unidad NUMBER NOT NULL,
    id_tipo NUMBER NOT NULL,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    valor_final NUMBER(5,2) NOT NULL,
    activo NUMBER(1) DEFAULT 1 NOT NULL CHECK (activo IN (0,1)),
    CONSTRAINT fk_pasaje_ruta FOREIGN KEY (id_ruta) REFERENCES RUTAS(id_ruta),
    CONSTRAINT fk_pasaje_unidad FOREIGN KEY (id_unidad) REFERENCES UNIDADES(id_unidad),
    CONSTRAINT fk_pasaje_tipo FOREIGN KEY (id_tipo) REFERENCES TIPOS_PASAJE(id_tipo)
);

-- IMBORTANTE: Índices únicos que ignoran los registros borrados
-- Esto permite volver a usar una placa o nombre de ruta si el anterior fue "eliminado"
CREATE UNIQUE INDEX idx_unique_placa_activa ON UNIDADES (CASE WHEN activo = 1 THEN placa ELSE NULL END);
CREATE UNIQUE INDEX idx_unique_disco_activo ON UNIDADES (CASE WHEN activo = 1 THEN numero_disco ELSE NULL END);
CREATE UNIQUE INDEX idx_unique_ruta_activa ON RUTAS (CASE WHEN activo = 1 THEN nombre_ruta ELSE NULL END);

COMMIT;


-- ==========================================================
-- REGISTROS DE PRUEBA (DATA SEED)
-- ==========================================================

-- 1. Inserción de RUTAS
INSERT INTO RUTAS (nombre_ruta, origen, destino, activo) VALUES ('Ruta Norte (Ibarra - Quito)', 'Ibarra', 'Quito', 1);
INSERT INTO RUTAS (nombre_ruta, origen, destino, activo) VALUES ('Ruta Sur (Quito - Latacunga)', 'Quito', 'Latacunga', 1);
INSERT INTO RUTAS (nombre_ruta, origen, destino, activo) VALUES ('Ruta Costa (Quito - Manta)', 'Quito', 'Manta', 1);
INSERT INTO RUTAS (nombre_ruta, origen, destino, activo) VALUES ('Ruta Inactiva Antigua', 'Quito', 'Guayaquil', 0); -- Borrada lógicamente

-- 2. Inserción de UNIDADES
INSERT INTO UNIDADES (numero_disco, placa, capacidad, activo) VALUES ('D-101', 'PBA-1234', 40, 1);
INSERT INTO UNIDADES (numero_disco, placa, capacidad, activo) VALUES ('D-102', 'PBB-5678', 35, 1);
INSERT INTO UNIDADES (numero_disco, placa, capacidad, activo) VALUES ('D-105', 'PBC-9012', 45, 1);
INSERT INTO UNIDADES (numero_disco, placa, capacidad, activo) VALUES ('D-999', 'EXP-0000', 20, 0); -- Borrada lógicamente

-- 3. Inserción de TIPOS_PASAJE
INSERT INTO TIPOS_PASAJE (descripcion, precio_base, activo) VALUES ('Normal', 2.50, 1);
INSERT INTO TIPOS_PASAJE (descripcion, precio_base, activo) VALUES ('Estudiantil', 1.25, 1);
INSERT INTO TIPOS_PASAJE (descripcion, precio_base, activo) VALUES ('Adulto Mayor', 1.00, 1);
INSERT INTO TIPOS_PASAJE (descripcion, precio_base, activo) VALUES ('Promocional Expirado', 0.50, 0); -- Borrada lógicamente

-- 4. Inserción de PASAJES
-- Pasajes activos
INSERT INTO PASAJES (id_ruta, id_unidad, id_tipo, valor_final, activo) VALUES (1, 1, 1, 2.50, 1);
INSERT INTO PASAJES (id_ruta, id_unidad, id_tipo, valor_final, activo) VALUES (1, 2, 2, 1.25, 1);
INSERT INTO PASAJES (id_ruta, id_unidad, id_tipo, valor_final, activo) VALUES (2, 3, 1, 3.00, 1);
INSERT INTO PASAJES (id_ruta, id_unidad, id_tipo, valor_final, activo) VALUES (3, 1, 3, 5.00, 1);

-- Pasaje borrado lógicamente
INSERT INTO PASAJES (id_ruta, id_unidad, id_tipo, valor_final, activo) VALUES (1, 1, 1, 2.50, 0);

COMMIT;
