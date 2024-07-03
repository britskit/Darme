const UserModel = require('../models/user-model')
const {generateAdminToken, generateUserToken} = require('../middlewares/jwt')
const bcrypt = require('bcrypt')

class AuthController {
    async register(req, res) {
        const { password, firstName, surName, phoneNumber } = req.body;
    
        try {
            // Check if phone number already exists
            const phoneNumberExist = await UserModel.findOne({ phoneNumber });
            if (phoneNumberExist) return res.status(400).json({ message: "Phone number already exists" });
    
            // Hash password
            const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
    
            // Create new user instance
            const user = new UserModel({
                firstName,
                surName,
                phoneNumber,
                password: hashedPassword,
                role: 'user'  // Ensure the role is set, replace with actual logic if needed
            });
    
            // Save user to the database
            await user.save();
            console.log('User saved:', user);
    
            // Generate token based on user role
            const token = user.role === 'user' ? generateUserToken(user) : generateAdminToken(user);
            console.log('Generated token:', token);
    
            // Set cookie with the token
            res.cookie(user.role, token, { maxAge: process.env.TOKEN_EXPIRESIN * 500 });
    
            // Send response with user ID and token
            res.status(200).json({ _id: user._id, userToken: token, message: "User successfully registered" });
    
        } catch (error) {
            console.error('Error during registration:', error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    
    
    async login(req, res) {
        const { phoneNumber, password } = req.body;
    
        try {
            const user = await UserModel.findOne({ phoneNumber });
            if (!user) return res.status(400).json({ message: "Incorrect phoneNumber" });
    
            const validationPassword = await bcrypt.compare(password, user.password);
            if (!validationPassword) return res.status(400).json({ message: "Incorrect password" });
    
            const token = user.role === 'user' ? generateUserToken(user) : generateAdminToken(user);
            res.cookie(user.role, token, { maxAge: process.env.TOKEN_EXPIRESIN * 500 });
    
            res.status(200).json({ _id: user._id, userToken: token, message: "User logged in successfully" });
        } catch (err) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
    

    async logout(req, res) {
        try {
            res.clearCookie('user')
            res.clearCookie('admin')
            return res.status(200).json({message: "User logged out successfully"})
        } catch (err) {
            res.status(500).json({message: "Internal server error"})
        }
    }

}

module.exports = new AuthController()