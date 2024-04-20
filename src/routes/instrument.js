import https from 'https'
import { Router } from 'express'

import { AWS } from '../config/aws.config.js'
import { XRayExpress } from '../config/aws.config.js'
import { mysqlXRay } from '../config/aws.config.js'
import { AWSXRay } from '../config/aws.config.js'

import { config as mysqlConfig } from '../config/mysql.config.js'

const routes = Router()

routes.use(XRayExpress.openSegment('SampleSite'))

routes.get('/', (_, res) => {
    const segment = AWSXRay.getSegment()
    const subSegment = segment.addNewSubsegment('customSubSegment')
    subSegment.addAnnotation('key', 'value')
    subSegment.addMetadata('key_metadata', "{error: 'error 3000'}")
    setTimeout(() => {
        subSegment.close()
        res.status(200).sendFile(`${process.cwd()}/src/public/index.html`)
    }, 500)
})

routes.get('/aws-sdk/', (_, res) => {
    const ddb = new AWS.DynamoDB()
    const ddbPromise = ddb.listTables().promise()

    ddbPromise
        .then(function (data) {
            res.status(200).json({ message: 'ListTables result', result: data })
        })
        .catch(function (err) {
            res.status(500).json({ message: 'Encountered error while calling ListTables', error: err })
        })
})

routes.get('/http-request', (_, res) => {
    const endpoint = 'https://amazon.com'
    https.get(endpoint, (response) => {
        response.on('data', () => {})

        response.on('error', (err) => {
            res.status(500).json({ message: 'Encountered error while making HTTPS request:', error: err })
        })

        response.on('end', () => {
            res.status(200).json({ message: `Successfully reached ${endpoint}.` })
        })
    })
})

routes.get('/mysql', (_, res) => {
    const { config, table } = mysqlConfig

    const subSegment = AWSXRay.getSegment().addNewSubsegment('Connection Database')

    if (!config.user || !config.database || !config.password || !config.host || !table) {
        res.status(400).json({ message: 'Please correctly populate mysql-config.json' })
        subSegment.addAnnotation('connection', 'Error on data to connect')
        subSegment.addError('Error to credentials')
        return
    }

    const connection = mysqlXRay.createConnection(config)
    connection.query(`SELECT * FROM ${table}`, (err, results, fields) => {
        if (err) {
            res.status(200).json({ message: `Encountered error while querying ${table}`, error: err })
            subSegment.addError(err)
            return
        }

        res.json({ message: `Retrieved the following results from ${table}`, data: results })
    })

    subSegment.close()
    connection.end()
})

routes.get('/error', (_, res) => {
    const segment = AWSXRay.getSegment()
    try {
        throw new Error('Default error')
    } catch (err) {
        console.log('Error')
        const subSegmente = segment.addNewSubsegment('Intentional error')
        subSegmente.addError(err)
        subSegmente.addAnnotation('type', 'intentional')
        subSegmente.close()
        res.status(500).json({ message: 'Error on server' })
    }
})

routes.use(XRayExpress.closeSegment())

export default routes
