const express=require('express')
const app=express()
const port=3000
const User=require('./models/user')
const validator=require('validator')
const {connectDB}=require('./config/database')

app.use(express.json())

app.get('/feed',async (req,res)=>{
    try{
        const user=await User.find({})
        res.send(user)
    }
    catch(err){
        res.status(400).send('something is wrong')
    }

})
app.get('/user',async (req,res)=>{
    const userEmail=req.body.emailId
    try{
        const user=await User.find({emailId:userEmail})
        res.send(user)
    }
    catch(err){
        res.status(400).send('something is wrong')
    }

})

app.post('/signup',async (req,res)=>{
    const user=new User(req.body)
    await user.save()
    res.send('user added')

    
})

app.patch('/update/:userId',async (req,res)=>{
    
    try{
        const id=req.params?.userId
        const data=req.body
        const allowed_updates=["lastname","password","emailId"]
        

        const isUpdatesAllowed=Object.keys(data).every(k=>allowed_updates.includes(k))

        if(!isUpdatesAllowed){
            throw new Error('Patch API Validation Failed')
        }
        if(!validator.isEmail(data.emailId)){
            throw new Error('Bad Email')
        }
        const user= await User.findByIdAndUpdate({_id:id}, data,{returnDocument:"after"})
        console.log(user)
        res.send('update success')
    }
        catch(err){
        res.status(400).send(err.message)
    }
})



app.delete('/delete',async (req,res)=>{
    try{
    const id=req.body.userId
    const user=await findByIdAndDelete(id)
        res.send("update successful")
    }
    catch(err){
        res.status(400).send('delete error')
    }

})

connectDB().then(()=>{
    console.log('DB connected')
    app.listen(port,()=>{console.log('server started')})
})
.catch((err)=>{
    console.error('Database cannot be connected'+err.message)
})
