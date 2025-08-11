const mongoose=require('mongoose')

const connectDB=async ()=>{
    await mongoose.connect('mongodb+srv://harshitthakur2003:uQ9q9Aceao2oUSmd@clusterm.22i0wec.mongodb.net/DevTinderDB')
}
module.exports={connectDB}