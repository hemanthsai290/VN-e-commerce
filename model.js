const mongoose = require('mongoose')

const Userdata = mongoose.Schema({

    // _id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //   },

    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required :true,
    },
    password: {
        type: String ,
        required :true,
    },
    data: {
        type: Date,
        default : Date.now,
    },
    

})

module.exports = mongoose.model("name,email,password", Userdata)