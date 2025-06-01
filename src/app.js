import express from 'express'
import beneficiariosRoutes from './routers/beneficiarios.routes.js'
import contratosRoutes from './routers/contratos.routes.js'
import pagosRoutes from './routers/pagos.routes.js'

const app = express()

app.use(express.json())
app.use('/api/', beneficiariosRoutes)
app.use('/api/', contratosRoutes)
app.use('/api/', pagosRoutes)

export default app
