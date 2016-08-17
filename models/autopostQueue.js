var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var autopostQueueModel = new Schema({
    postId             :{
        type: String
    },
    userId         : {
        type         : String
    },
    network         : {
        type         : String
    },
    date            :{
        type        : Date
    },
    posted          : {
        type         : Boolean
    }
});

module.exports = mongoose.model('AutopostQueue', autopostQueueModel);
