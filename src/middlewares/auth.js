const jwt=require('jsonwebtoken')
const User = require('../models/user')

const userauth=async (req,res,next)=>{

    try{
    const{token}=req.cookies
    if(!token){
        throw new Error("invalid token")
    }
    const decodedobj=await jwt.verify(token,"SecretKey")
    const{_id}=decodedobj
    const user=await User.findById({_id})

    if(!user){
        throw new Error("User not found")
    }
    req.user=user
    next()
}
catch(err){
    res.status(400).send('Error'+ err.message)
}

}

module.exports={userauth}