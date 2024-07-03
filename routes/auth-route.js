const express = require('express')
const router = express.Router()
const Controller = require('../controllers/auth-controller')

router.post('/login', Controller.login)
router.post('/register', Controller.register)
router.post('/logout', Controller.logout)

module.exports = router