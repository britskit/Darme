const jwt = require("jsonwebtoken")

const generateAdminToken = (user) => {
    return jwt.sign({sub: user._id, role: 'admin'}, process.env.TOKEN_ACCESS_ADMIN)
}
const generateUserToken = (user) => {
    return jwt.sign({sub: user._id, role: 'user'}, process.env.TOKEN_ACCESS_USER)
}

const verifyAdminToken = (secretKey) => (req, res, next) => {
    const token = req.cookies['admin']
    if (!token) return res.status(403).json({message: "Authorize to website"})

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(404).json({message: "Token is invalid"})

        const {sub, role} = decoded
        req.user = {sub, role}
        next()
    })
}

const verifyUserToken = (secretKey) => (req, res, next) => {
    const token = req.cookies['user']
    if (!token) return res.status(403).json({message: "Authorize to website"})

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(404).json({message: "Token is invalid"})

        const {sub, role} = decoded
        req.user = {sub, role}
        next()
    })
}

module.exports = {generateAdminToken, generateUserToken, verifyAdminToken, verifyUserToken}
