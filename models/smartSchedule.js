var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var smartScheduleModel = new Schema({
    network             :{
        type: String
    },
    current_day         : {
        type         : Number
    },
    current_hour          : {
        type         : Number
    },
    current_minute        : {
        type         : Number
    }

});

module.exports = mongoose.model('SmartSchedule', smartScheduleModel);