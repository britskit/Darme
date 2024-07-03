const mongoose = require('mongoose')

const HistorySchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    purchases: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        purchaseDate: { type: Date, default: Date.now }
    }]
}, {timestamps: true})

const History = mongoose.model('History', HistorySchema)

module.exports = History