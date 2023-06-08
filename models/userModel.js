const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    isVerified: {
        type: Boolean,
        default: false
    }
})

const userModel = mongoose.model("user",userSchema)
module.exports = {userModel}