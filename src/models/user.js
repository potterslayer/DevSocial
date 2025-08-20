const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
    },
    about: {
      type: String,
      default: "This is a default about of the user!",
    },
    skills: {
      type: [String],
    },
},{timestamps:true})

module.exports=mongoose.model('User',userSchema)