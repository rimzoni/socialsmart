var express = require('express');

var routes = function(AutopostQueue){

    var autopostQueuesRouter = express.Router();

    var autopostQueueController = require('../controllers/autopostQueueController')(AutopostQueue);

    autopostQueuesRouter.route('/')
        .post(autopostQueueController.post)
        .get(autopostQueueController.get);

    autopostQueuesRouter.use('/:autopostQueueId', function(req,res,next){
        AutopostQueue.findById(req.params.autopostQueueId,function(err,autopostQueue){
            if(err)
                res.status(500).send(err);
            else if(autopostQueue){
                req.autopostQueue = autopostQueue;
                next();
            }
            else{
                res.status(404).send('autopostQueues not found');
            }
        })
    });
    autopostQueuesRouter.route('/:autopostQueueId')
        .put(autopostQueueController.putAutopostQueueId)

    return autopostQueuesRouter;
};

module.exports = routes;
