const express = require('express')
const router = express.Router()
const {verifyUserToken} = require('../middlewares/jwt')
const Controller = require('../controllers/user-controller')
const upload = require("../middlewares/userPhoto")

router.get('/:id', verifyUserToken(process.env.TOKEN_ACCESS_USER), Controller.getUserById)
router.get('/history/:id', verifyUserToken(process.env.TOKEN_ACCESS_USER), Controller.getHistory)
router.post('/:id/edit', verifyUserToken(process.env.TOKEN_ACCESS_USER), Controller.editProfile)
router.post('/:id/edit/photo', verifyUserToken(process.env.TOKEN_ACCESS_USER), upload.single('photo'), Controller.editPhoto)
router.post('/:id/delete/photo', verifyUserToken(process.env.TOKEN_ACCESS_USER), Controller.deletePhoto)

module.exports = router