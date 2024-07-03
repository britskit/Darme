const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    subcategories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subcategory',
        }
    ],
    file: {type: Array, required: true, min: 1, max: 8},
    color: String  
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
