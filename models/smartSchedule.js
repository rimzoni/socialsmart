var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var smartScheduleModel = new Schema({
    network             :{
        type: String
    },
    userId         : {
        type         : String
    },
    current_day         : {
        type         : Number
    },
    current_hour          : {
        type         : Number
    },
    current_minute        : {
        type         : Number
    },
    current_date        : {
        type         : Number
    },
    current_month        : {
        type         : Number
    }

});

module.exports = mongoose.model('SmartSchedule', smartScheduleModel);
