import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import 'dotenv/config'

import routes from './routes/index.js'

const PORT = process.env.PORT || 3000
export const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('short'))

app.use(routes)

app.listen(PORT, () => {
    console.log(`Server online on port ${PORT}`)
})
