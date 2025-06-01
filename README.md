# Procedimientos para implementacion

1. Clonar repositorio
```
git clone https://github.com/estefano18-jp/api-prestamos.git
```
2. Recontruir node_modules
```
npm install
```

3. Construir el archivo .env
```
DB_HOST=localhost
DB_PORT=3306
DB_PASSWORD=
DB_USER=root
DB_DATABASE=prestamos
```

4. Restaure la BD (db > database.sql)
```sql
-- Crear base de datos
CREATE DATABASE prestamos;
USE prestamos;

-- Crear tabla beneficiarios
CREATE TABLE beneficiarios (
    idbeneficiario	INT AUTO_INCREMENT PRIMARY KEY,
    apellidos 		VARCHAR(50)			NOT NULL,
    nombres			VARCHAR(50)			NOT NULL,
    dni				CHAR(8)				NOT NULL,
    telefono		CHAR(9)				NOT NULL,
    direccion 		VARCHAR(90)			NULL,
    creado			DATETIME			NOT NULL DEFAULT NOW(),
    modificado		DATETIME			NULL,
    CONSTRAINT uk_dni_ben UNIQUE (dni)
) ENGINE=INNODB;

-- Crear tabla contratos
CREATE TABLE contratos (
    idcontrato		INT AUTO_INCREMENT PRIMARY KEY,
    idbeneficiario	INT 				NOT NULL,
    monto			DECIMAL(7,2)		NOT NULL,
    interes			DECIMAL(5,2)		NOT NULL,
    fechainicio		DATE 				NOT NULL,
    diapago			TINYINT				NOT NULL,
    numcuotas		TINYINT				NOT NULL COMMENT 'Expresando en meses',
    estado			ENUM('ACT','FIN')	NOT NULL DEFAULT 'ACT' COMMENT 'ACT = Activo, FIN = Finalizo',
    creado			DATETIME			NOT NULL DEFAULT NOW(),
    modificado		DATETIME			NULL,
    CONSTRAINT fk_idbeneficiario_con FOREIGN KEY(idbeneficiario) REFERENCES beneficiarios(idbeneficiario)
) ENGINE=INNODB;

-- Crear tabla pagos
CREATE TABLE pagos (
    idpago		INT AUTO_INCREMENT PRIMARY KEY,
    idcontrato	INT 		NOT NULL,
    numcuota	TINYINT		NOT NULL COMMENT 'Se debe cancelar la cuota en su totalidad sin AMORTIZACIONES',
    fechapago	DATETIME	NULL COMMENT 'Fecha efectiva de pago',
    monto		DECIMAL(7,2)NOT  NULL,
    penalidad	DECIMAL(7,2)NOT  NULL DEFAULT 0 COMMENT '10 % del valor de la cuota',
    medio		ENUM('EFC','DEP')NULL COMMENT 'EFC = Efectivo, DEP = Deposito',
    CONSTRAINT fk_idcontrato_pag FOREIGN KEY (idcontrato) REFERENCES contratos(idcontrato),
    CONSTRAINT uk_numcuota_pag UNIQUE (idcontrato, numcuota)
) ENGINE=INNODB;

-- Insertar beneficiario de prueba
INSERT INTO beneficiarios (apellidos, nombres, dni, telefono)
VALUES ('Olivos Marquez', 'edu estefano', '75891431', '977629675');

-- Insertar contrato de prueba
INSERT INTO contratos (idbeneficiario, monto, interes, fechainicio, diapago, numcuotas)
VALUES (1, 3000, 5, '2025-03-10', 15, 12);

-- Insertar pagos de prueba
INSERT INTO pagos (idcontrato, numcuota, fechapago, monto, penalidad, medio) VALUES
(1, 1, '2025-4-15', 338.48, 0, 'EFC'),
(1, 2, '2025-5-17', 338.48, 33.85, 'DEP'),
(1, 3, NULL, 338.48, 0, NULL),
(1, 4, NULL, 338.48, 0, NULL),
(1, 5, NULL, 338.48, 0, NULL),
(1, 6, NULL, 338.48, 0, NULL),
(1, 7, NULL, 338.48, 0, NULL),
(1, 8, NULL, 338.48, 0, NULL),
(1, 9, NULL, 338.48, 0, NULL),
(1, 10, NULL, 338.48, 0, NULL),
(1, 11, NULL, 338.48, 0, NULL),
(1, 12, NULL, 338.48, 0, NULL);

```

5. Ejecute el proyecto:
```
npm run dev
```