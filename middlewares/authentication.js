const jwt = require("jsonwebtoken")
require("dotenv").config()

const authenticate = async (req,res,next) => {
    let token = req.headers.authorization
    try{
        jwt.verify(token,process.env.secret, async (err,decode) => {
            if(err){
                res.send({'msg':"Session expired"})
            }else{
                next()
            }
        })
    }
    catch(error){
        res.send({'error':error.message})
    }
}

module.exports = {authenticate}