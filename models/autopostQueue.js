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
    dayOfWeek : {
        type         : Number
    },
    hour          : {
        type         : Number
    },
    minutes          : {
        type         : Number
    },
    date        : {
        type         : Number
    },
    month        : {
        type         : Number
    },
    year        : {
        type         : Number
    },
    posted          : {
        type         : Boolean
    }
});

module.exports = mongoose.model('AutopostQueue', autopostQueueModel);
