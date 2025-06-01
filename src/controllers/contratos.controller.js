import { pool } from '../db.js'

// Listar todos los contratos
export const getContratos = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM contratos')
    res.send(results)
  } catch (error) {
    console.error('Error GET contratos', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

// Obtener contrato por ID
export const getContratoById = async (req, res) => {
  try {
    const id = req.params.id
    const [results] = await pool.query('SELECT * FROM contratos WHERE idcontrato = ?', [id])
    if (results.length === 0) return res.status(404).json({ message: 'ID NO EXISTE' })
    res.send(results[0])
  } catch (error) {
    console.error('Error GET por ID contrato', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

// Crear contrato
export const createContrato = async (req, res) => {
  try {
    const { idbeneficiario, monto, interes, fechainicio, diapago, numcuotas, estado } = req.body
    const [results] = await pool.query(
      `INSERT INTO contratos (idbeneficiario, monto, interes, fechainicio, diapago, numcuotas, estado) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [idbeneficiario, monto, interes, fechainicio, diapago, numcuotas, estado || 'ACT']
    )
    res.send({
      status: true,
      message: 'Contrato registrado',
      id: results.insertId
    })
  } catch (error) {
    console.error('Error POST contrato', error)
    res.status(500).json({ status: false, message: 'Error en el servidor' })
  }
}

// Actualizar contrato
export const updateContrato = async (req, res) => {
  try {
    const id = req.params.id
    const { idbeneficiario, monto, interes, fechainicio, diapago, numcuotas, estado } = req.body
    const [results] = await pool.query(
      `UPDATE contratos SET idbeneficiario=?, monto=?, interes=?, fechainicio=?, diapago=?, numcuotas=?, estado=?, modificado=NOW()
      WHERE idcontrato=?`,
      [idbeneficiario, monto, interes, fechainicio, diapago, numcuotas, estado, id]
    )
    if (results.affectedRows === 0) {
      return res.status(404).json({ status: false, message: 'El ID no existe' })
    }
    res.send({ status: true, message: 'Contrato actualizado' })
  } catch (error) {
    console.error('Error PUT contrato', error)
    res.status(500).json({ status: false, message: 'Error en el servidor' })
  }
}

// Obtener contratos por beneficiario
export const getContratosByBeneficiario = async (req, res) => {
  try {
    const idbeneficiario = req.params.idbeneficiario
    const [results] = await pool.query('SELECT * FROM contratos WHERE idbeneficiario = ?', [idbeneficiario])
    if (results.length === 0) {
      return res.status(404).json({ message: "No se encontraron contratos para este beneficiario" })
    }
    res.send(results)
  } catch (error) {
    console.error("No se pudo concretar GET de contratos por beneficiario", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}
  

// Eliminar contrato
export const deleteContrato = async (req, res) => {
  try {
    const id = req.params.id
    const [results] = await pool.query('DELETE FROM contratos WHERE idcontrato = ?', [id])
    if (results.affectedRows === 0) {
      return res.status(404).json({ status: false, message: 'El ID no existe' })
    }
    res.send({ status: true, message: 'Eliminado correctamente' })
  } catch (error) {
    console.error('Error DELETE contrato', error)
    res.status(500).json({ status: false, message: 'Error en el servidor' })
  }
}
