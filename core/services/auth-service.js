"use strict";

const express = require('express')
const User = require('../models/user');
const UserRepository = require('./db/user-repository');

const router = express.Router()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { reject } = require('bluebird');

class AuthService {

  constructor() {
    this.userRepository = new UserRepository();
  }

  generateAuthToken(user) {
    return jwt.sign({id: user.id}, 'test')
  }

  login(name, password) {
    return this.userRepository.getByName(name).then((user) => {
      if(!user) {
        console.error('user not found')
        reject('user not found')
      }

      if(!bcrypt.compareSync(password, user.password)) {
        console.error('password incorrect')
        reject('password incorrect')
      }

      console.log('login successful')

      return this.generateAuthToken(user)
    });
  }
}

module.exports = AuthService