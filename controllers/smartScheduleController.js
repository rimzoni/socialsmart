var smartScheduleController = function(SmartSchedule){

    var resp = [];
    var optimalTimeController = require('./optimalTimeController');
    var OptimalTime = require('../models/optimalTime');
    var post = function(req,res){
        var errors = [];
        var smartSchedule = new SmartSchedule(req.body);
        if(!req.body.network)
            errors.push('Network is required!');
        if(!req.body.current_day && req.body.current_day!='0')
            errors.push('Current day is required!');
        if(!req.body.current_hour && req.body.current_hour!='0')
            errors.push('Current hour is required!');
        if(!req.body.minute && req.body.minute!='0')
            errors.push('Current minute is required!');

        if(errors.length>1){
            res.status(400);
            res.send(errors);
        }else{

            var optimaltime = OptimalTime.find({network: smartSchedule.network}, null, {sort: 'day'}).exec();
                optimaltime.then(function(optimalTimes){

                var response = getPostTime(optimalTimes,req.body.current_day, req.body.current_hour,req.body.current_minute )
                res.status(200);
                res.json(response);
            });


        }
    }

    var getPostTime = function(optimalTimes, req_current_day, req_current_hour, req_current_minute){
              if (optimalTimes) {

                //take day and hour and duration
                var returnOptimalTimes = [];
                var generalTimes = [];
                var previousDay = null;
                var previousOptimalTime = [];
                optimalTimes.forEach(function (element, index, array) {
                    var optimalTime = element.toJSON();

                    if (!optimalTime.day && optimalTime.day != 0) {
                        generalTimes.push(optimalTime);

                    } else if (isCurrentDayPeak(optimalTime.day, req_current_day)) {

                        var generalPeakHour = getGeneralPeakHour(generalTimes, req_current_hour);
                        if (isCurrentHourPeak(optimalTime.hour, optimalTime.duration, req_current_hour)) {

                            returnOptimalTimes.push(optimalTime);
                        } else if (generalPeakHour.length > 0) {
                            returnOptimalTimes.push(generalPeakHour)
                        }   else if (index === optimalTimes.length - 1) {
                            returnOptimalTimes.push(previousOptimalTime[0]);
                        }

                    } else if (isNextDayPeak(optimalTime.day, req_current_day)) {

                        if (isWaitLongerThanTwoDays(optimalTimes.day, req_current_day)) {

                            returnOptimalTimes.push(generalTimes);

                        } else {

                            returnOptimalTimes.push(optimalTime);
                        }


                    } else if (index === optimalTimes.length - 1) {

                        returnOptimalTimes.push(previousOptimalTime[0]);
                    } else {

                        previousOptimalTime.push(optimalTime);
                    }
                    previousDay = optimalTime.day ? optimalTime.day : null;
                    // returnPost.push(newPost);
                });

                var response = {};
                if (isCurrentDayPeak(returnOptimalTimes[0].day, req_current_day)) {
                    response.day = req_current_day;
                    if (isCurrentHourLessThenPeak(returnOptimalTimes[0].hour, req_current_hour)) {
                        response.hour = returnOptimalTimes[0].hour;
                        response.minutes = '0';
                    } else {
                        response.hour = returnOptimalTimes[0].hour + returnOptimalTimes[0].duration - req_current_hour;
                        response.minutes = req_current_minute;
                    }
                } else{
                    response.day = returnOptimalTimes[0].day;
                    response.hour = returnOptimalTimes[0].hour;
                    response.minutes = '0';
                }

                return response;
            } else {
                return "not found";
            }
    }

    var isCurrentHourLessThenPeak = function(hour,current_hour){
        return hour>current_hour;
    };

    var isCurrentDayPeak = function(day, current_day){
        return day == current_day;
    };

    var isCurrentHourPeak = function(hour,duration,current_hour){
        return hour + duration >= current_hour
    };

    var isNextDayPeak= function(day,current_day){
        return day > current_day;
    };

    var isWaitLongerThanTwoDays = function(day,current_day){
        return Math.abs(day - current_day) > 1;
    }

    var getGeneralPeakHour = function(generalTimes, current_hour){
        generalTimes.forEach(function(element,index,array) {
            var generalTime = element;
            if (isCurrentHourPeak(generalTime.day, generalTime.duration, current_hour)) {
                return generalTime;
            }
        });
        return [];
    }

    var get = function(req,res){
        var query = {};
        if(req.query.network){
            query.network = req.query.network;
        }

        if(req.query.day){
            query.day = req.query.day;
        }

        if(req.query.hour){
            query.hour = req.query.hour;
        }

        if(req.query.duration){
            query.duration = req.query.duration;
        }
        if(req.query.recommended){
            query.recommended = req.query.recommended;
        }

        OptimalTime.find(query,function(err,optimalTimes){
            if(err)
                res.status(500).send(err);
            else{
                var returnOptimalTime =[];

                optimalTimes.forEach(function(element,index,array){
                    var newOptimalTime = element.toJSON();
                    newOptimalTime.links = {};
                    newOptimalTime.links.self = 'http://' + req.headers.host + '/api/optimaltimes/' + newOptimalTime._id;
                    returnOptimalTime.push(newOptimalTime);
                });

                res.json(returnOptimalTime);
            }
        });
    }

    return {
        post : post,
        getPostTime: getPostTime
    }
};

module.exports = smartScheduleController;