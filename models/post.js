var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var postModel = new Schema({
    userId             :{
        type: String
    },
    post         : {
        type         : String
    },
    twitter          : {
        type         : Boolean
    },
    facebook          : {
        type         : Boolean
    },
    autopost          : {
        type         : Boolean
    },
    timeToPostTwitter         : {
        type         : String
    },
    timeToPostFacebook         : {
        type         : String
    }
});

module.exports = mongoose.model('Post', postModel);
