const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
}, { timestamps: true });


module.exports = mongoose.model("role", roleSchema);

