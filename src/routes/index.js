import { Router } from 'express'

import instrumentRoutes from './instrument.js'

const routes = Router()

routes.get('/', (_, res) => {
    res.status(200).json({ message: ':smile: everything ok' })
})

routes.use('/aws/', instrumentRoutes)

export default routes
