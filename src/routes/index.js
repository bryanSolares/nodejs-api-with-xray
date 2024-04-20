import { Router } from 'express'

const routes = Router()

routes.get('/', (_, res) => {
    res.status(200).json({ message: ':smile: everything ok' })
})

export default routes
