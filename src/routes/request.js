const express=require("express")
const requestRouter=express.Router()
const {userauth}=require('../middlewares/auth')
const ConnectionRequestModel=require('../models/connectionRequest')
const User=require('../models/user')

requestRouter.post('/request/send/:status/:toUserId',userauth,async(req,res)=>{
    try{
        const fromUserId=req.user._id
        const toUserId=req.params.toUserId
        const status=req.params.status

        const allowedStatus=["ignored","interested"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Invalid status type:"+status
            })
        }
        const toUser=await User.findById(toUserId)
        if(!toUser){
            return res.status(404).json({
                message:"User not found"
            })
        }

        const existingConnectionRequest=await ConnectionRequestModel.findOne({
            $or:[{fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ],
        })

        if(existingConnectionRequest){
            return res.status(400).json({message:"Connection Request already exists"})
        }

        if(fromUserId==toUserId){
            return res.status(400).json({
                message:"Cant Send Connection to yourself"
            })
        }

        const ConnectionRequest=new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status,
        })
        const data=await ConnectionRequest.save()
        res.json({
            message:"Connection"+' '+status,
            data
        })
    }
    catch(err){
        res.status(400).send('Error'+err.message)
    }
})

requestRouter.post('/request/review/:status/:requestId',userauth,async(req,res)=>{
    try{
        const LoggedInUser=req.user
        const{status,requestId}=req.params

        const allowedStatus=["accepted","rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Status not allowed"})
        }
        const connectionRequest=await ConnectionRequestModel.findOne({
            _id:requestId,
            toUserId:LoggedInUser._id,
            status:"interested"
        })
        if(!connectionRequest){
            return res.status(404).json({message:"Request Not found"})
        }
        connectionRequest.status=status
        const data= await connectionRequest.save()
        res.json({message:"Connection Request"+status,data})
    }
    catch(err){
        res.status(400).json({
            message:"Error"+err.message
        })
    }
})

module.exports=requestRouter