import request from 'supertest'
import app from '../app'

describe('Body Parser Middleware', () => {
  test('should parse the response body to JSON', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test_body_parser')
      .send({ test: 'test' })
      .expect({ test: 'test' })
  })
})
