const validator=require('validator')



const validatesignupData=(req)=>{
    const{firstName,lastName,emailId,password}=req.body
    if(!firstName||!lastName){
        throw new Error('Name not valid')
    }
    else if(!validator.isEmail(emailId)){
        throw new Error('Email not valid')
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Enter strong Password")
    }
}

module.exports={validatesignupData}

