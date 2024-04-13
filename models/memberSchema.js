const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    community:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
}, { timestamps: true });


module.exports = mongoose.model("member", memberSchema);

