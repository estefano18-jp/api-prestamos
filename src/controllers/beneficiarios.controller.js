import { pool } from '../db.js'

// Obtener todos los beneficiarios
export const getBeneficiarios = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM beneficiarios')
    res.send(results)
  } catch (error) {
    console.error('No se pudo concretar GET de beneficiarios', error)
    res.status(500).json({ message: 'Error en el servidor' })
  }
}

// Obtener beneficiario por ID
export const getBeneficiarioById = async (req, res) => {
  try {
    const id = req.params.id
    const [results] = await pool.query('SELECT * FROM beneficiarios WHERE idbeneficiario = ?', [id])
    if (results.length === 0)
      return res.status(404).json({ message: 'Beneficiario no encontrado' })
    res.send(results[0])
  } catch (error) {
    console.error('No se pudo concretar GET por ID de beneficiario', error)
    res.status(500).json({ message: 'Error en el servidor' })
  }
}

// Obtener beneficiario por DNI
export const getBeneficiarioByDNI = async (req, res) => {
  try {
    const dni = req.params.dni
    const [results] = await pool.query('SELECT * FROM beneficiarios WHERE dni = ?', [dni])
    if (results.length === 0)
      return res.status(404).json({ message: 'Beneficiario no encontrado' })
    res.send(results[0])
  } catch (error) {
    console.error('No se pudo concretar GET por DNI de beneficiario', error)
    res.status(500).json({ message: 'Error en el servidor' })
  }
}

// Obtener beneficiario por teléfono
export const getBeneficiarioByTelefono = async (req, res) => {
  try {
    const telefono = req.params.telefono
    const [results] = await pool.query('SELECT * FROM beneficiarios WHERE telefono = ?', [telefono])
    if (results.length === 0)
      return res.status(404).json({ message: 'Beneficiario no encontrado' })
    res.send(results[0])
  } catch (error) {
    console.error('No se pudo concretar GET por teléfono de beneficiario', error)
    res.status(500).json({ message: 'Error en el servidor' })
  }
}

// Crear beneficiario
export const createBeneficiario = async (req, res) => {
  try {
    const { apellidos, nombres, dni, telefono, direccion } = req.body
    if (!apellidos || !nombres || !dni || !telefono) {
      return res.status(400).json({
        message: 'Datos incompletos. Apellidos, nombres, DNI y teléfono son obligatorios'
      })
    }
    const [results] = await pool.query(
      'INSERT INTO beneficiarios (apellidos, nombres, dni, telefono, direccion) VALUES (?, ?, ?, ?, ?)',
      [apellidos, nombres, dni, telefono, direccion]
    )
    if (results.affectedRows === 0) {
      return res.status(500).json({
        status: false,
        message: 'No se pudo completar el registro',
        id: null
      })
    }
    res.status(201).json({
      status: true,
      message: 'Beneficiario registrado correctamente',
      id: results.insertId
    })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe un beneficiario con ese DNI' })
    }
    console.error('No se pudo concretar POST de beneficiario', error)
    res.status(500).json({ message: 'Error en el servidor' })
  }
}

// Actualizar beneficiario
export const updateBeneficiario = async (req, res) => {
  try {
    const id = req.params.id
    const { apellidos, nombres, dni, telefono, direccion } = req.body
    if (!apellidos || !nombres || !dni || !telefono) {
      return res.status(400).json({
        message: 'Datos incompletos. Apellidos, nombres, DNI y teléfono son obligatorios'
      })
    }
    const [results] = await pool.query(
      `UPDATE beneficiarios SET apellidos=?, nombres=?, dni=?, telefono=?, direccion=?, modificado=NOW()
       WHERE idbeneficiario=?`,
      [apellidos, nombres, dni, telefono, direccion, id]
    )
    if (results.affectedRows === 0)
      return res.status(404).json({ message: 'Beneficiario no encontrado' })
    res.status(200).json({ message: 'Beneficiario actualizado correctamente' })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe otro beneficiario con ese DNI' })
    }
    console.error('No se pudo concretar PUT de beneficiario', error)
    res.status(500).json({ message: 'Error en el servidor' })
  }
}

// Eliminar beneficiario
export const deleteBeneficiario = async (req, res) => {
  try {
    const id = req.params.id
    // Verifica contratos asociados
    const [contratosResults] = await pool.query(
      'SELECT COUNT(*) as count FROM contratos WHERE idbeneficiario = ?',
      [id]
    )
    if (contratosResults[0].count > 0) {
      return res.status(409).json({
        message: 'No se puede eliminar el beneficiario porque tiene contratos asociados'
      })
    }
    const [results] = await pool.query('DELETE FROM beneficiarios WHERE idbeneficiario = ?', [id])
    if (results.affectedRows === 0)
      return res.status(404).json({ message: 'Beneficiario no encontrado' })
    res.json({ message: 'Beneficiario eliminado correctamente' })
  } catch (error) {
    console.error('No se pudo concretar DELETE de beneficiario', error)
    res.status(500).json({ message: 'Error en el servidor' })
  }
}
