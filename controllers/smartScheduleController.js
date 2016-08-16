var smartScheduleController = function(SmartSchedule){

    var resp = [];
    var optimalTimeController = require('./optimalTimeController');
    var OptimalTime = require('../models/optimalTime');
    var AutopostQueue = require('../models/autopostQueue');
    var post = function(req,res){
        var errors = [];
        var smartSchedule = new SmartSchedule(req.body);
        if(!req.body.network)
            errors.push('Network is required!');
        if(!req.body.date && req.body.date!='0')
            errors.push('Date  is required!');

        if(errors.length>1){
            res.status(400);
            res.send(errors);
        }else{
            req.body.date = new Date(req.body.date);
            var optimaltime = OptimalTime.find({network: smartSchedule.network}, null, {sort: 'day'}).exec();
                optimaltime.then(function(optimalTimes){

                var response = {};
                var autopostQueueResult =  AutopostQueue .find({userId: req.body.userId }, null).sort('-date').exec();
                autopostQueueResult.then(function(queueResults){

                    if(queueResults.length>0){
                      queueResults.forEach(function (element, index, array) {
                          var queueResult = element;
                          var day = req.body.date.getDay();
                          var hours = req.body.date.getHours();
                          var minutes = req.body.date.getMinutes();
                          var month = req.body.date.getMonth();
                          var monthDay = req.body.date.getDate();
                          var year = req.body.date.getFullYear();

                          if(queueResult.date >= monthDay && queueResult.month >= month
                          && queueResult.year >= year){

                            var nextMonthDay = queueResult.date + 1;

                            var safeNextDay = safeIncrementDay(nextMonthDay,  queueResult.month, queueResult.year);
                             nextMonthDay = safeNextDay.day;
                             year = safeNextDay.year;
                             month = safeNextDay.month;

                            var newDate = new Date(year, month, nextMonthDay);
                            var   newPostTime = getPostTime(optimalTimes,req.body.userId, newDate.toString());
                            response.year = newPostTime.year;
                            response.month = newPostTime.month;
                            response.monthDay = newPostTime.monthDay;
                            response.day = newPostTime.day;
                            response.hour = newPostTime.hour;
                            response.minutes = newPostTime.minutes ;
                            res.status(200);
                            res.send(response);
                          }else{

                            var   postTime = getPostTime(optimalTimes,req.body.userId, req.body.date);

                            var year = postTime.year;
                            var month = postTime.month;
                            var monthDay = postTime.monthDay;
                            var day = postTime.day;
                            var hour = postTime.hour;
                            var minutes = postTime.minutes;

                            response.year = year;

                            response.month = month;
                            response.date= monthDay;
                            response.day = day;
                            response.hour = hour;
                            response.minutes = minutes;
                            res.status(200);
                            res.send(response);
                          }
                      });
                    }else{

                      var   postTime = getPostTime(optimalTimes,req.body.userId, req.body.date);

                      var year = postTime.year;
                      var month = postTime.month;
                      var monthDay = postTime.monthDay;
                      var day = postTime.day;
                      var hour = postTime.hour;
                      var minutes = postTime.minutes;

                      response.year = year;

                      response.month = month;
                      response.date= monthDay;
                      response.day = day;
                      response.hour = hour;
                      response.minutes = minutes;

                      res.status(200);
                      res.send(response);

                    }
                    res.status(200);
                    res.send(response);
                });
            });


        }
    }

    var getPostTime = function(optimalTimes, userId,date){
              date = new Date(date);

              if (optimalTimes) {
                 var req_current_day = date.getDay();
                 var req_current_hour = date.getHours();
                 var req_current_minute = date.getMinutes();

                 var req_current_month = date.getMonth();
                 var req_current_date = date.getDate();
                 var req_current_year = date.getFullYear();
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
                });


                var response = {};
                var day = null;
                var minutes = null;
                var hour = null;
                if (isCurrentDayPeak(returnOptimalTimes[0].day, req_current_day)) {
                     day = req_current_day;
                    if (isCurrentHourLessThenPeak(returnOptimalTimes[0].hour, req_current_hour)) {
                        hour = returnOptimalTimes[0].hour;
                        minutes = 0;
                    } else {
                        hour = returnOptimalTimes[0].hour + returnOptimalTimes[0].duration - req_current_hour;
                        minutes = req_current_minute;
                    }
                } else{
                    day = returnOptimalTimes[0].day;
                    hour = returnOptimalTimes[0].hour;
                    minutes = 0;
                }

                var month = null;
                var monthDay = req_current_date + Math.abs(day - req_current_day);

                var nextDay = safeIncrementDay(monthDay,  req_current_month, req_current_year);


                response.month = nextDay.month;
                response.year = nextDay.year;
                response.monthDay = nextDay.day;
                response.day = day;
                response.hour = hour;
                response.minutes = minutes;

                return response;
            } else {
                return "not found";
            }
    }

    var safeIncrementDay = function(day,month,year){
      response = {};
      var numberOfDays = new Date(year, month, 0).getDate();
      if(numberOfDays<day){

          if(month<12){
            month = month+1;
          }else{
            month = month-11;
            year ++;
          }
          day = day - numberOfDays;
        }

        response.day = day;
        response.year = year;
        response.month = month;

        return response;
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
