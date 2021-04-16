const request = require('supertest')
const ExpressLoader = require('../express-loader')

test('should return 422 when no email and password is given', async (done) => {
  const expressLoader = new ExpressLoader()
  expressLoader.init().then((app) => {
    request(app)
      .post('/auth/login')
      .expect(422)
      .end(function (err, res) {
        if (err) throw err
        done()
      })
  })
})
