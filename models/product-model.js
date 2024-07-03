const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    file: {type: Array, required: true, min: 1, max: 8},
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: {type: String},
}, {timestamps: true})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product