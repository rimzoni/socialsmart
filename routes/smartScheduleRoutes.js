var express = require('express');

var routes = function(SmartSchedule){

    var smartScheduleRouter = express.Router();

    var smartScheduleController = require('../controllers/smartScheduleController')(SmartSchedule);
    smartScheduleRouter.route('/')
        .post(smartScheduleController.post);
    return smartScheduleRouter;
};

module.exports = routes;
