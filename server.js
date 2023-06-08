const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const { msgModel } = require("./models/msgModel")

const app = express()
const server = http.createServer(app)
const io = new Server(server)


io.on("connection", (socket) => {
    console.log('User connected');

    socket.on("join", (userId) => {
        socket.join(userId)
    })

    socket.on("message", async (data) => {
        try {
            const message = new msgModel({
                sender: data.sender,
                recipient: data.recipient,
                message: data.message,
                timeStamp: data.timeStamp
            })
            await message.save()

            io.to(data.recipient).emit("message", data)
        }
        catch (error) {
            console.log('error: ' + error.message);
        }
    })

    socket.on("disconnect", () => {
        console.log('User disconnected');
    })
})