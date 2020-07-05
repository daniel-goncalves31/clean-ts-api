import app from '../config/app'
import request from 'supertest'

describe('Content Type Middleware', () => {
  test('should return JSON as default content-type', async () => {
    app.get('/test_content_json', (_, res) => {
      res.send()
    })

    await request(app)
      .get('/test_content_json')
      .expect('content-type', /json/)
  })

  test('should return XML content-type when forced', async () => {
    app.get('/test_content_xml', (_, res) => {
      res.type('xml')
      res.send()
    })

    await request(app)
      .get('/test_content_xml')
      .expect('content-type', /xml/)
  })
})
