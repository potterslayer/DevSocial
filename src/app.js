const express=require('express')
const app=express()
const port=3000
const User=require('./models/user')
const validator=require('validator')
const {connectDB}=require('./config/database')
const {validatesignupData}=require('./utils/validate')
const bcrypt=require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt=require("jsonwebtoken")
const {userauth}=require('./middlewares/auth')

app.use(express.json())
app.use(cookieParser())

app.post('/signup',async (req,res)=>{
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

app.post('/login',async (req,res)=>{
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
app.get('/profile',userauth,async(req,res)=>{
    try{
    user=req.user
    res.send(user)
}
catch(err){
    res.status(400).send('error:'+err.message)
}
})

app.post('/sendconnectionrequest',userauth,async(req,res)=>{
    const user=req.user
    res.send(user.firstName+'sent connection request')
})
connectDB().then(()=>{
    console.log('DB connected')
    app.listen(port,()=>{console.log('server started')})
})
.catch((err)=>{
    console.error('Database cannot be connected'+err.message)
})
