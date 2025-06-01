import { Router } from 'express'
import {
  getBeneficiarios,
  getBeneficiarioById,
  getBeneficiarioByDNI,
  getBeneficiarioByTelefono,
  createBeneficiario,
  updateBeneficiario,
  deleteBeneficiario
} from '../controllers/beneficiarios.controller.js'

const router = Router()

// IMPORTANTE: El de DNI antes que :id
router.get('/beneficiarios/dni/:dni', getBeneficiarioByDNI)
router.get('/beneficiarios', getBeneficiarios)
router.get('/beneficiarios/:id', getBeneficiarioById)
router.get('/beneficiarios/telefono/:telefono', getBeneficiarioByTelefono)
router.post('/beneficiarios', createBeneficiario)
router.put('/beneficiarios/:id', updateBeneficiario)
router.delete('/beneficiarios/:id', deleteBeneficiario)

export default router
