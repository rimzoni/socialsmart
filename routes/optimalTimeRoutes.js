var express = require('express');

var routes = function(OptimalTime){

    var optimalTimesRouter = express.Router();

    var optimalTimeController = require('../controllers/optimalTimeController')(OptimalTime);
    optimalTimesRouter.route('/')
        .post(optimalTimeController.post)
        .get(optimalTimeController.get);

    optimalTimesRouter.use('/:optimalTimeId', function(req,res,next){
        OptimalTime.findById(req.params.optimalTimeId,function(err,optimalTime){
            if(err)
                res.status(500).send(err);
            else if(optimalTime){
                req.optimalTime = optimalTime;
                next();
            }
            else{
                res.status(404).send('Optimal time not found');
            }
        })
    });
    optimalTimesRouter.route('/:postId')
        .get(optimalTimeController.getOptimalTimeId)
        .put(optimalTimeController.putOptimalTimeId)
        .patch(optimalTimeController.patchOptimalTimeId)
        .delete(optimalTimeController.deleteOptimalTimeId);
    return optimalTimesRouter;
};

module.exports = routes;
