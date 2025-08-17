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

const validateeditdata= (req)=>{
    const allowedEditFields=["age","gender","skills","about"]

const isEditAllowed=Object.keys(req.body).every(field=>allowedEditFields.includes(field))
return isEditAllowed
}

module.exports={validatesignupData,validateeditdata}

