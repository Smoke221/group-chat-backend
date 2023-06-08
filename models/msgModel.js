const mongoose = require("mongoose")

const msgSchema = new mongoose.Schema({
    sender:String,
    recipient:String,
    message:String,
    timeStamp:String
})

const msgModel = mongoose.model("message",msgSchema)
module.exports = {msgModel}