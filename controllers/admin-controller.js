const UserModel = require('../models/user-model')
const CategoryModel = require('../models/category-model')
const SubcategoryModel = require('../models/subcategory-model')
const ProductModel = require('../models/product-model')
const HistoryModel = require('../models/history-model')
const fs = require('fs')
const util = require('util')
const mkdir = util.promisify(fs.mkdir)

class AdminController {
    async getUsers(req, res) {
        try {
            const users = await UserModel.find()
            res.status(200).json(users)
        } catch (err) {
            res.status(500).json({message: "Internal server error"})
        }
    }

    async getUserById(req, res) {
        const userId = req.params.id
        try {
            const user = await UserModel.findById(userId)
            if (!user) return res.status(404).json({message: "User not found"})

            res.status(200).json(user)
        } catch (err) {
            res.status(500).json({message: "Internal server error"})
        }
    }

    async getHistoryById(req, res) {
        const userId = req.params.id
        try {
            const history = await HistoryModel.findOne({user: userId}).populate('products', 'title quantity')
            if (!history) return res.status(404).json({message: "User not found"})

            res.status(200).json(history)
        } catch (err) {
            res.status(500).json({message: "Internal server error"})
        }
    }

    async getProducts(req, res) {
        try {
            const products = await ProductModel.find()
            res.status(200).json(products)
        } catch (err) {
            res.status(500).json({message: "Internal server error"})
        }
    }

    async getProductById(req, res) {
        const productId = req.params.id
        try {
            const product = await ProductModel.findById(productId)
            if (!product) return res.status(404).json({message: "Product not found"})

            res.status(200).json(product)
        } catch (err) {
            res.status(500).json({message: "Internal server error"})
        }
    }

    async createProduct(req, res) {
        const userId = req.user._id
        const {title, description, category, subcategory, price, quantity} = req.body
        const files = req.files

        try {
            if (!files || files.length === 0) return res.status(404).json({message: 'No files'})

            const product = new ProductModel({
                title,
                description,
                price,
                quantity,
                category,
                subcategory
            })

            const dirPath = `public/products/${product._id}`
            if (!fs.existsSync(dirPath)) {
                await mkdir(dirPath, {recursive: true})
            }

            const fileNames = []
            await Promise.all(files.map(async (file, index) => {
                const fileName = `${product._id}-${index + 1}${file.originalname.slice(file.originalname.lastIndexOf('.'))}`
                const filePath = `public/products/${product._id}/${fileName}`
                fileNames.push(filePath)
                const fileContent = await new Promise((resolve, reject) => {
                    fs.readFile(file.path, (err, data) => {
                        if (err) reject(err)
                        else resolve(data)
                    })
                })
                await new Promise((resolve, reject) => {
                    fs.writeFile(`${dirPath}/${fileName}`, fileContent, (err) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve()
                        }
                    })
                })
            }))

            await Promise.all(files.map(async (file) => {
                await fs.promises.unlink(file.path)
            }))

            product.file = fileNames
            await product.save()

            res.status(201).json({product, message: 'Product created successfully'})
        } catch (err) {
            console.log(err)
            console.log(err.message)
            if (files && files.length > 0) {
                await Promise.all(files.map(async (file) => {
                    await fs.promises.unlink(file.path)
                }))
            }
            res.status(500).json({message: "Internal server error"})
        }
    }

    async editProduct(req, res) {
        const productId = req.params.id
        const {title, description, category, subcategory, price, quantity} = req.body
        try {
            const product = await ProductModel.findByIdAndUpdate(
                productId,
                {
                    title,
                    description,
                    category,
                    subcategory,
                    price,
                    quantity
                },
                {new: true})

            res.status(200).json({product, message: "Product edited successfully"})
        } catch (err) {
            res.status(500).json({message: "Internal server error"})
        }
    }

    async deleteProduct(req, res) {
        const productId = req.params.id
        try {
            const product = await ProductModel.findByIdAndDelete(productId)
            if (!product) return res.status(404).json({message: "Product not found"})

            res.status(200).json({product, message: "Product deleted successfully"})
        } catch (err) {
            res.status(500).json({message: "Internal server error"})
        }
    }

    async createCategory(req, res) {
        const {name} = req.body
        try {
            const category = await CategoryModel.create({name})
            res.status(201).json({category, message: 'Category created successfully'})
        } catch (err) {
            console.log(err.message)
            res.status(500).json({message: "Internal server error"})
        }
    }

    async editCategory(req, res) {
        const categoryId = req.params.id
        const {name} = req.body
        try {
            const category = await CategoryModel.findById(categoryId)
            if (!category) return res.status(404).json({message: "Category not found"})

            category.name = name
            await category.save()

            res.status(200).json({category, message: "Category edited successfully"})
        } catch (err) {
            res.status(500).json({message: "Internal server error"})
        }
    }

    async deleteCategory(req, res) {
        const categoryId = req.params.id
        try {
            const category = await CategoryModel.findById(categoryId)
            if (!category) return res.status(404).json({message: "Category not found"})

            await CategoryModel.deleteOne({ _id: categoryId })

            res.status(200).json({category, message: "Category deleted successfully"})
        } catch (err) {
            console.log(err.message)
            res.status(500).json({message: "Internal server error"})
        }
    }

    async createSubcategory(req, res) {
        const {name, categoryId} = req.body
        try {
            const category = await CategoryModel.findById(categoryId)
            if (!category) return res.status(404).json({message: "Category not found"})

            const subcategory = await SubcategoryModel.create({name})
            category.subcategories.push(subcategory._id)
            await category.save()

            res.status(201).json({subcategory, message: "Subcategory created successfully"})
        } catch (err) {
            res.status(500).json({message: "Internal server error"})
        }
    }

    async editSubcategory(req, res) {
        const subcategoryId = req.params.id
        const {name} = req.body
        try {
            const subcategory = await SubcategoryModel.findById(subcategoryId)
            if (!subcategory) return res.status(404).json({message: "Subcategory not found"})

            subcategory.name = name
            await subcategory.save()

            res.status(200).json({subcategory, message: "Subcategory edited successfully"})
        } catch (err) {
            res.status(500).json({message: "Internal server error"})
        }
    }

    async deleteSubcategory(req, res) {
        const subcategoryId = req.params.id
        try {
            const subcategory = await SubcategoryModel.findById(subcategoryId)
            if (!subcategory) return res.status(404).json({message: "Subcategory not found"})

            const categories = await CategoryModel.find({subcategories: subcategoryId})

            await Promise.all(categories.map(async category => {
                await category.updateOne({$pull: {subcategories: subcategoryId}})
            }))

            await SubcategoryModel.deleteOne({ _id: subcategoryId })

            res.status(200).json({subcategory, message: "Subcategory deleted successfully"})
        } catch (err) {
            res.status(500).json({message: "Internal server error"})
        }
    }
}

module.exports = new AdminController()