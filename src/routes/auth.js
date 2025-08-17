const express=require("express")
const authRouter=express.Router()
const {validatesignupData}=require('../utils/validate')
const bcrypt=require('bcrypt')
const jwt=require("jsonwebtoken")
const User=require('../models/user')




authRouter.post('/signup',async (req,res)=>{
    try{
    validatesignupData(req)

    const{firstName,lastName,emailId,password}=req.body
    const passwordHash=await bcrypt.hash(password,10)
    
    const user=new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash
    })
    await user.save()
    res.send('user added')
    }
    catch(err){
        res.status(400).send('error'+err.message)
    }
    
})

authRouter.post('/login',async (req,res)=>{
    try{
    const {emailId,password}=req.body
    const user=await User.findOne({emailId:emailId})
    if(!user){
        throw new Error('Invalid Creds')
    }
    const ispasswordValid=await bcrypt.compare(password,user.password)
    if(ispasswordValid){
        //Create JWT token
        const token=await jwt.sign({_id:user._id},"SecretKey",{expiresIn:'7d'})

        //add token to cookie
        res.cookie("token",token)
        res.send('login successful')
    }
    else{
        throw new Error('invalid creds')
    }
}
catch(err){
    res.status(400).send('error:'+err.message)
}

})

authRouter.post('/logout',async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    })
    res.send("logout successful")
})


module.exports=authRouter