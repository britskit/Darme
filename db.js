const mongoose = require('mongoose')

const DB = async () => {
    try {
        
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database is connected")
    } catch (err) {
        console.error("Error connecting to database:", err.message)
        process.exit(1)
    }
}

module.exports = DB
