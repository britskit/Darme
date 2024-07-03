const UserModel = require('../models/user-model')
const HistoryModel = require('../models/history-model')
const bcrypt = require('bcrypt')
const fs = require('fs')
const util = require('util')
const mkdir = util.promisify(fs.mkdir)
const path = require('path')

class UserController {
    async getUserById(req, res) {
        const userId = req.user.sub;
        const id = req.params.id;
        try {
            if (id !== userId) {
                return res.status(403).json({ message: 'You are requesting another user\'s data' });
            }
            const user = await UserModel.findById(id).select('-__v -password');
            res.status(200).json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getHistory(req, res) {
        const userId = req.user.sub
        const id = req.params.id
        try {
            if (id !== userId) {
                return res.status(403).json({message: 'You are requiring another user'})
            }
            const user = await HistoryModel.findOne({user: id}, {products: 1}).populate('products', 'title, quantity')
            res.status(200).json(user)
        } catch (err) {
            res.status(500).json({message: "Internal server error"})
        }
    }

    async editProfile(req, res) {
        const userId = req.user.sub
        const id = req.params.id
        const {firstName, lastName, surName, phoneNumber, password} = req.body
        try {
            if (id !== userId) {
                return res.status(403).json({message: 'You are requiring another user'})
            }

            const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10))

            const user = await UserModel.findOneAndUpdate({_id: id}, {
                firstName,
                lastName,
                surName,
                phoneNumber,
                password: hashedPassword
            }, {new: true})
            res.status(200).json(user)
        } catch (err) {
            console.log(err.message)
            res.status(500).json({message: "Internal server error"})
        }
    }

    async editPhoto(req, res) {
        const userId = req.user.sub
        const id = req.params.id
        const photo = req.file
        try {
            if (id !== userId) {
                return res.status(403).json({message: 'You are requiring another user'})
            }
            if (!photo) {
                return res.status(404).json({message: 'No file'})
            }

            const user = await UserModel.findById(id)
            const dirPath = `public/uploads/users/${id}`
            if (!fs.existsSync(dirPath)) {
                await fs.promises.mkdir(dirPath, {recursive: true});
            }
            const previousPhoto = user.photo
            if (previousPhoto) {
                const previousPhotoPath = path.join(dirPath, previousPhoto)
                await fs.promises.unlink(previousPhotoPath);
            }

            const newFileName = `${userId}-${Date.now()}${path.extname(photo.originalname)}`

            const newPath = path.join(dirPath, newFileName)
            await fs.promises.rename(photo.path, newPath)

            const updatedUser = await UserModel.findByIdAndUpdate(
                id,
                {photo: newPath},
                {new: true}
            )
            res.status(200).json(user)
        } catch (err) {
            console.log(err.message)
            if (photo) {
                await fs.promises.unlink(photo.path)
            }
            res.status(500).json({message: "Internal server error"})
        }
    }

    async deletePhoto(req, res) {
        const userId = req.user.sub
        const id = req.params.id
        try {
            if (id !== userId) {
                return res.status(403).json({message: 'You are requiring another user'})
            }
            const user = await UserModel.findById(id)
            const filePath = user.photo
            await fs.promises.unlink(filePath)
            await UserModel.findOneAndUpdate({_id: id}, {photo: null}, {new: true})
            res.status(200).json({user, message: 'File successfully deleted'})
        } catch (err) {
            console.log(err.message)
            res.status(500).json({message: "Internal server error"})
        }
    }
}

module.exports = new UserController()