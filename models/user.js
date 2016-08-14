var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userModel = new Schema({
    token             :{
        type : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        tokenSecret  : String,
        displayName  : String,
        username     : String,
        profileImage : String
    }
});

module.exports = mongoose.model('User', userModel);