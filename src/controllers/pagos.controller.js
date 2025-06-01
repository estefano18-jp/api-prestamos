import { pool } from '../db.js'

// Listar todos los pagos
export const getPagos = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM pagos')
    res.send(results)
  } catch (error) {
    console.error('Error GET pagos', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

// Obtener pago por ID
export const getPagoById = async (req, res) => {
  try {
    const id = req.params.id
    const [results] = await pool.query('SELECT * FROM pagos WHERE idpago = ?', [id])
    if (results.length === 0) return res.status(404).json({ message: 'ID NO EXISTE' })
    res.send(results[0])
  } catch (error) {
    console.error('Error GET por ID pago', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

// Obtener pagos por contrato
export const getPagosByContrato = async (req, res) => {
  try {
    const idcontrato = req.params.idcontrato
    const [results] = await pool.query(
      'SELECT * FROM pagos WHERE idcontrato = ? ORDER BY numcuota',
      [idcontrato]
    )
    if (results.length === 0)
      return res.status(404).json({ message: "No se encontraron pagos para este contrato" })
    res.send(results)
  } catch (error) {
    console.error("Error GET pagos por contrato", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// Obtener pagos realizados por contrato
export const getPagosRealizadosByContrato = async (req, res) => {
  try {
    const idcontrato = req.params.idcontrato
    const [results] = await pool.query(
      'SELECT * FROM pagos WHERE idcontrato = ? AND fechapago IS NOT NULL ORDER BY numcuota',
      [idcontrato]
    )
    // Total pagado
    const [total] = await pool.query(
      "SELECT SUM(monto + penalidad) as total FROM pagos WHERE idcontrato = ? AND fechapago IS NOT NULL",
      [idcontrato]
    )
    res.json({
      pagos: results,
      total: total[0].total || 0
    })
  } catch (error) {
    console.error("Error GET pagos realizados", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// Obtener pagos pendientes por contrato
export const getPagosPendientesByContrato = async (req, res) => {
  try {
    const idcontrato = req.params.idcontrato
    const [results] = await pool.query(
      'SELECT * FROM pagos WHERE idcontrato = ? AND fechapago IS NULL ORDER BY numcuota',
      [idcontrato]
    )
    // Total pendiente
    const [total] = await pool.query(
      "SELECT SUM(monto) as total FROM pagos WHERE idcontrato = ? AND fechapago IS NULL",
      [idcontrato]
    )
    res.json({
      pagos: results,
      total: total[0].total || 0
    })
  } catch (error) {
    console.error("Error GET pagos pendientes", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// Obtener próximo pago por contrato
export const getProximoPagoByContrato = async (req, res) => {
  try {
    const idcontrato = req.params.idcontrato
    const [results] = await pool.query(
      'SELECT * FROM pagos WHERE idcontrato = ? AND fechapago IS NULL ORDER BY numcuota LIMIT 1',
      [idcontrato]
    )
    if (results.length === 0)
      return res.status(404).json({ message: "No hay pagos pendientes para este contrato" })
    res.send(results[0])
  } catch (error) {
    console.error("Error GET próximo pago", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// Registrar pago
export const registerPago = async (req, res) => {
  try {
    const { idcontrato, numcuota, medio } = req.body
    if (!idcontrato || !numcuota || !medio) {
      return res.status(400).json({ message: "Datos incompletos" })
    }
    // Solo registrar si está pendiente
    const [pagoCheck] = await pool.query(
      "SELECT * FROM pagos WHERE idcontrato = ? AND numcuota = ?",
      [idcontrato, numcuota]
    )
    if (pagoCheck.length === 0)
      return res.status(404).json({ message: "Cuota no encontrada" })
    if (pagoCheck[0].fechapago)
      return res.status(409).json({ message: "Esta cuota ya ha sido pagada" })

    // Registrar el pago (simplificado)
    const [results] = await pool.query(
      `UPDATE pagos SET fechapago = NOW(), medio = ? WHERE idcontrato = ? AND numcuota = ?`,
      [medio, idcontrato, numcuota]
    )
    if (results.affectedRows === 0)
      return res.status(500).json({ message: "No se pudo registrar el pago" })
    res.json({ message: "Pago registrado correctamente" })
  } catch (error) {
    console.error("Error registro pago", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// Anular pago (solo para administradores)
export const anularPago = async (req, res) => {
  try {
    const id = req.params.id
    // Verifica que el pago existe y ya está pagado
    const [pagoCheck] = await pool.query(
      "SELECT * FROM pagos WHERE idpago = ?",
      [id]
    )
    if (pagoCheck.length === 0)
      return res.status(404).json({ message: "Pago no encontrado" })
    if (!pagoCheck[0].fechapago)
      return res.status(409).json({ message: "Este pago aún no ha sido realizado" })
    // Anula el pago
    const [results] = await pool.query(
      "UPDATE pagos SET fechapago = NULL, penalidad = 0, medio = NULL WHERE idpago = ?",
      [id]
    )
    if (results.affectedRows === 0)
      return res.status(500).json({ message: "No se pudo anular el pago" })
    res.json({ message: "Pago anulado correctamente" })
  } catch (error) {
    console.error("Error anulación pago", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}
