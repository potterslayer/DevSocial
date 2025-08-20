const express=require("express")
const userRouter=express.Router()
const {userauth}=require('../middlewares/auth')
const ConnectionRequestModel=require('../models/connectionRequest')
const User=require('../models/user')

userRouter.get('/user/requests/received',userauth,async(req,res)=>{
    try{
        const LoggedInUser=req.user

        const Requests=await ConnectionRequestModel.find({
            toUserId:LoggedInUser._id,
            status:"interested",
        }).populate("fromUserId","firstName lastName age gender skills about")
        res.json({message:"Requests fetched",data:Requests})
    }
    catch(err){
        res.status(400).json({
            message:"Error"+ err.message})
    }
})
userRouter.get("/user/connections",userauth,async(req,res)=>{
    try{
        const LoggedInUser=req.user
        const Connection=await ConnectionRequestModel.find({
            $or:[
                {toUserId:LoggedInUser._id,status:"accepted"},
                {fromUserId:LoggedInUser._id,status:"accepted"}
            ]
        }).populate("fromUserId","firstName lastName age gender skills about")
          .populate("toUserId","firstName lastName age gender skills about")

        const data=Connection.map((row)=>{
            if(row.fromUserId._id.toString()===LoggedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })


        res.json({message:"Connections Fetched",data:data})
    }
    catch(err){
         res.status(400).json({
            message:"Error"+ err.message})
    }
})



module.exports=userRouter