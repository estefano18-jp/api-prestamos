import { Router } from 'express'
import {
  getContratos,
  getContratoById,
  getContratosByBeneficiario,
  createContrato,
  updateContrato,
  deleteContrato
} from '../controllers/contratos.controller.js'

const router = Router()

router.get('/contratos', getContratos)
router.get('/contratos/:id', getContratoById)
router.get('/contratos/beneficiario/:idbeneficiario', getContratosByBeneficiario)
router.post('/contratos', createContrato)
router.put('/contratos/:id', updateContrato)
router.delete('/contratos/:id', deleteContrato)

export default router
