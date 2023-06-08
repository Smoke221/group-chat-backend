const express = require("express")
const cors = require("cors")

const { connection } = require("./configs/db")
const { userRouter } = require("./routes/userRoute")
require("dotenv").config()
const app = express()
app.use(express.json())
app.use(cors())
app.get("/", (req,res) => {
    res.send({'msg':"Server is working fine"})
})
app.use("/user",userRouter)

app.listen(process.env.port, async () => {
    try {
        await connection
        console.log('Connected to database');
    }
    catch (error) {
        console.log(error.message);
    }
    console.log(`App is running on port ${process.env.port}`);
})