const express = require('express')
const router = express.Router()
const {verifyAdminToken} = require('../middlewares/jwt')
const Controller = require('../controllers/admin-controller')
const upload  = require('../middlewares/productPhoto')

router.get('/users', verifyAdminToken(process.env.TOKEN_ACCESS_ADMIN), Controller.getUsers)
router.get('/users/:id', verifyAdminToken(process.env.TOKEN_ACCESS_ADMIN), Controller.getUserById)
router.get('/users/history/:id', verifyAdminToken(process.env.TOKEN_ACCESS_ADMIN), Controller.getHistoryById)

router.get('/products', verifyAdminToken(process.env.TOKEN_ACCESS_ADMIN), Controller.getProducts)
router.get('/product/:id', verifyAdminToken(process.env.TOKEN_ACCESS_ADMIN), Controller.getProductById)
router.post('/product/create', verifyAdminToken(process.env.TOKEN_ACCESS_ADMIN), upload.array('file', 8), Controller.createProduct)
router.post('/product/edit/:id', verifyAdminToken(process.env.TOKEN_ACCESS_ADMIN), Controller.editProduct)
router.post('/product/delete/:id', verifyAdminToken(process.env.TOKEN_ACCESS_ADMIN), Controller.deleteProduct)

router.post('/category/create', verifyAdminToken(process.env.TOKEN_ACCESS_ADMIN), Controller.createCategory)
router.post('/category/edit/:id', verifyAdminToken(process.env.TOKEN_ACCESS_ADMIN), Controller.editCategory)
router.post('/category/delete/:id', verifyAdminToken(process.env.TOKEN_ACCESS_ADMIN), Controller.deleteCategory)

router.post('/subcategory/create', verifyAdminToken(process.env.TOKEN_ACCESS_ADMIN), Controller.createSubcategory)
router.post('/subcategory/edit/:id', verifyAdminToken(process.env.TOKEN_ACCESS_ADMIN), Controller.editSubcategory)
router.post('/subcategory/delete/:id', verifyAdminToken(process.env.TOKEN_ACCESS_ADMIN), Controller.deleteSubcategory)

module.exports = router