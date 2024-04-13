const mongoose = require("mongoose");

const commSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
    owner:{
        type:String,
        required:true
    },
}, { timestamps: true });


module.exports = mongoose.model("community", commSchema);

