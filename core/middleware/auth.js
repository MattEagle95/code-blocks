const jwt = require('jsonwebtoken')
const UserRepo = require('./db/user-repository')

const auth = async (req, res, next) => {
  const userRepo = new UserRepo()

  const token = req.header('Authorization').replace('Bearer ', '')
  const data = jwt.verify(token, process.env.JWT_KEY)

  userRepo.findByIdAndToken(data.id)
    .then(user => {

    })
}
module.exports = auth
