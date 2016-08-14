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
    }
});

module.exports = mongoose.model('Post', postModel);