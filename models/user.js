const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');
const UserSchema = mongoose.Schema({
    // username : {
    //     type : String,
    //     required : true
    // },
    // password : {
    //     type : String,
    //     required : true
    // },
    email: {
        type : String,
        required : true
    }
})
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserSchema)

// const UserSchemaBcrypt = mongoose.Schema({
//     username : {
//         type : String,
//         required : true
//     },
//     password : {
//         type : String,
//         required : true
//     },
//     email: {
//         type : String,
//         required : true
//     }
// })
