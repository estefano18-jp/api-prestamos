import { Router } from 'express'
import {
  getPagos,
  getPagoById,
  getPagosByContrato,
  getPagosRealizadosByContrato,
  getPagosPendientesByContrato,
  getProximoPagoByContrato,
  registerPago,
  anularPago
} from '../controllers/pagos.controller.js'

const router = Router()

router.get('/pagos', getPagos)
router.get('/pagos/:id', getPagoById)
router.get('/pagos/contrato/:idcontrato', getPagosByContrato)
router.get('/pagos/realizados/:idcontrato', getPagosRealizadosByContrato)
router.get('/pagos/pendientes/:idcontrato', getPagosPendientesByContrato)
router.get('/pagos/proximo/:idcontrato', getProximoPagoByContrato)
router.post('/pagos', registerPago)
router.put('/pagos/anular/:id', anularPago)

export default router
