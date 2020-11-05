const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000
app.use(cors())
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 
var pm2 = require('pm2')
const e = require('express')
const Configstore = require('configstore')
const config = new Configstore("test", {foo: 'bar'});
config.set('awesome', true);
console.log(config.path);
let mongoose = require('mongoose');

//Import routes
let routes = require("./core/routes/routes")
let apiRoutes = require("./core/routes/api-routes")
let authRoutes = require("./core/routes/auth-routes")

//Use API routes in the App
app.use('/', routes)
app.use('/api', apiRoutes)
app.use('/auth', authRoutes)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const UserRepo = require('./core/services/db/user-repository')
const AuthService = require('./core/services/auth-service')

const userRepo = new UserRepo()

const bcrypt = require('bcryptjs')

userRepo.createTable()
.then(() => {
  let hash = bcrypt.hashSync('test', bcrypt.genSaltSync(10));
  console.log("HASH: " + hash)
  userRepo.create('Colin', hash)
})

