import request from 'supertest'
import { app } from '../src/app.js'

describe('Test firt endpoint', () => {
    it('Should return "Everything ok"', async () => {
        const response = await request(app).get('/')
        expect(response.header['content-type']).toMatch('json')
        expect(response.status).toEqual(200)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toEqual(':smile: everything ok')
    })
})
