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

export { AWSXRay, AWSSDK, XRayExpress, AWS, mysqlXRay }
