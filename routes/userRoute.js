const express = require("express")
const { userModel } = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
require("dotenv").config()
const userRouter = express.Router()

userRouter.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                res.send({ 'error': err.message })
            } else {
                const isExisting = await userModel.findOne({ email })
                if (isExisting) {
                    res.send({ 'msg': 'User already exists, please login' })
                } else {
                    const user = new userModel({ username, email, password: hash })
                    await user.save()

                    const token = jwt.sign({ userId: user._id }, process.env.secret)
                    const transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        auth: {
                            user: "kanilreddy2222@gmail.com",
                            pass: process.env.gp
                        }
                    })

                    const mailOptions = {
                        from: 'asau3637@gmail.com',
                        to: `${req.body.email}`,
                        subject: 'Email verification',
                        html: `<p>Please click on the following link to verify</p>
                        <a href="http://localhost:8080/user/verify/${token}">Verfiy Email</a>`
                    }

                    await transporter.sendMail(mailOptions, async (err, info) => {
                        if (err) {
                            console.log(err.message);
                        } else {
                            console.log(info);
                        }
                    })

                    res.status(201)
                    res.send({ 'msg': 'New user registered successfully' })
                }
            }
        })
    }
    catch (error) {
        res.status(500)
        res.send({ 'msg': 'Something went wrong', 'error': error.message })
    }
})

// for verfiying the link sent to mail
userRouter.get("/verify/:token", async (req, res) => {
    try {
        const { token } = req.params

        const decoded = jwt.verify(token, process.env.secret)
        const userId = decoded.userId

        await userModel.findByIdAndUpdate(userId, { isVerified: true })

        res.status(200)
        res.send({ 'msg': 'Email verified' })
    }
    catch (error) {
        res.status(500)
        res.send({ 'msg': 'Something went wrong', 'error': error.message })
    }
})


// user login
userRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        const isExisting = await userModel.findOne({ email })

        if (!isExisting) {
            res.status(404)
            res.send({ 'msg': 'User doesn"t exist, please register' })
        } else {
            const isPassMatch = await bcrypt.compare(password, isExisting.password)

            if (!isPassMatch) {
                res.status(401)
                res.send({ 'msg': 'Wrong password' })
            } else {

                if (!isExisting.isVerified) {
                    res.status(401)
                    res.send({ 'msg': 'Email address not verified' })
                } else {
                    const token = jwt.sign({ userId: isExisting._id }, 'masai')
                    res.status(200)
                    res.send({ 'msg': 'Logged in', 'token': token })
                }
            }
        }
    }
    catch (error) {
        res.status(500)
        res.send({ 'msg': 'Something went wrong', 'error': error.message })
    }
})

module.exports = { userRouter }