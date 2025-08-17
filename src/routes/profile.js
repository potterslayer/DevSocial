const express=require("express")
const profileRouter=express.Router()
const {userauth}=require('../middlewares/auth')
const {validateeditdata}=require('../utils/validate')
const validator=require('validator')
const bcrypt=require("bcrypt")

profileRouter.get('/profile/view',userauth,async(req,res)=>{
    try{
    user=req.user
    res.send(user)
}
catch(err){
    res.status(400).send('error:'+err.message)
}
})
profileRouter.patch('/profile/edit',userauth,async(req,res)=>{
    try{
    if(!validateeditdata(req)){
        throw new Error('Invalid Edit Request')
    }
    const LoggedInUser=req.user
    Object.keys(req.body).forEach((key)=>LoggedInUser[key]=req.body[key])
    await LoggedInUser.save()
    res.json({
        message:`${LoggedInUser.firstName}, profile updated successfully`,
        data:LoggedInUser
    })
}
catch(err){
    res.status(400).send("error"+err.message)
}
})

profileRouter.patch('/profile/password',userauth,async(req,res)=>{
    try{
    const LoggedInUser=req.user
    const{OldPassword,NewPassword}=req.body
    const ispasswordValid=await bcrypt.compare(OldPassword,LoggedInUser.password)
    console.log(ispasswordValid)
    
    if(ispasswordValid){
        if(!validator.isStrongPassword(NewPassword)){
            throw new Error("Enter Strong New Password")
        }
        const passwordHash=await bcrypt.hash(NewPassword,10)
        LoggedInUser.password=passwordHash
        await LoggedInUser.save()
        res.json({
            message:`${LoggedInUser.firstName},password changed`
        })
    }
    else{
        throw new Error('Enter Correct Old Password')
    }
    
}
catch(err){
    res.status(400).send("error"+err.message)
}
})

module.exports=profileRouter