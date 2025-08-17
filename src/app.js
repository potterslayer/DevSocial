const express=require('express')
const app=express()
const port=3000
const User=require('./models/user')
const validator=require('validator')
const {connectDB}=require('./config/database')

const bcrypt=require('bcrypt')
const cookieParser = require('cookie-parser')

const {userauth}=require('./middlewares/auth')

app.use(express.json())
app.use(cookieParser())

const authRouter=require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)


connectDB().then(()=>{
    console.log('DB connected')
    app.listen(port,()=>{console.log('server started')})
})
.catch((err)=>{
    console.error('Database cannot be connected'+err.message)
})
