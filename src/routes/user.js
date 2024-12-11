const express = require('express');
const login = require('../services/login');
const register = require('../services/register-user');

const user = express.Router();

user.post('/login', login);
user.post('/register', register);

module.exports = user;
