const { default: mongoose } = require("mongoose");

exports.db=mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("database connected successfully");
    
})
.catch((err)=>{
    console.log("database connection error");
    
})