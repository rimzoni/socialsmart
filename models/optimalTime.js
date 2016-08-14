var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var optimalTimeModel = new Schema({
    network             :{
        type: String
    },
    day         : {
        type         : Number
    },
    hour          : {
        type         : Number
    },
    duration          : {
        type         : Number
    },
    recommended          : {
        type         : Boolean
    },

});

module.exports = mongoose.model('OptimalTime', optimalTimeModel);