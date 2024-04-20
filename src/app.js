import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import 'dotenv/config'

import routes from './routes/index.js'

import AWSXRay from 'aws-xray-sdk'
import AWSSDK from 'aws-sdk'
import https from 'https'
import mysql from 'mysql'

const XRayExpress = AWSXRay.express
const AWS = AWSXRay.captureAWS(AWSSDK)

AWS.config.update({
    region: process.env.DEFAULT_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.SECRET_KEY_ID || '',
        secretAccessKey: process.env.SECRET_ACCESS_KEY || ''
    }
})

AWSXRay.captureHTTPsGlobal(https)
const mysqlXRay = AWSXRay.captureMySQL(mysql)

const PORT = process.env.PORT || 3000
export const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('short'))

app.use(XRayExpress.openSegment('SampleSite'))

app.get('/', (req, res) => {
    const segment = AWSXRay.getSegment()
    const subSegment = segment.addNewSubsegment('customSubSegment')
    subSegment.addAnnotation('key', 'value')
    subSegment.addMetadata('key_metadata', "{error: 'error 3000'}")
    setTimeout(() => {
        subSegment.close()
        res.sendFile(`${process.cwd()}/src/index.html`)
    }, 500)
})

app.get('/aws-sdk/', (req, res) => {
    const ddb = new AWS.DynamoDB()
    const ddbPromise = ddb.listTables().promise()

    ddbPromise
        .then(function (data) {
            res.send(`ListTables result:\n ${JSON.stringify(data)}`)
        })
        .catch(function (err) {
            res.send(`Encountered error while calling ListTables: ${err}`)
        })
})

app.get('/http-request', (req, res) => {
    const endpoint = 'https://amazon.com'
    https.get(endpoint, (response) => {
        response.on('data', () => {})

        response.on('error', (err) => {
            res.send(`Encountered error while making HTTPS request: ${err}`)
        })

        response.on('end', () => {
            res.send(`Successfully reached ${endpoint}.`)
        })
    })
})

import { config as mysqlConfig } from './config/mysql.config.js'

app.get('/mysql/', (req, res) => {
    const config = mysqlConfig.config
    const table = mysqlConfig.table

    if (!config.user || !config.database || !config.password || !config.host || !table) {
        res.send('Please correctly populate mysql-config.json')
        return
    }

    const connection = mysqlXRay.createConnection(config)
    connection.query(`SELECT * FROM ${table}`, (err, results, fields) => {
        if (err) {
            res.send(`Encountered error while querying ${table}: ${err}`)
            return
        }
        res.send(`Retrieved the following results from ${table}:\n${results}`)
    })

    connection.end()
})

//app.use(routes)

app.use(XRayExpress.closeSegment())

app.listen(PORT, () => {
    console.log(`Server online on port ${PORT}`)
})
