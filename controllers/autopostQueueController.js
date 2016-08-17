var autopostQueueController = function(AutopostQueue){

    var post = function(req,res){
        var autopostQueue = new AutopostQueue(req.body);

        if(!req.body.postId){
            res.status(400);
            res.send('postId is required');
        }
        else{
            autopostQueue.save();
            res.status(201);
            res.send(autopostQueue);
        }
    }

    var get = function(req,res){

        var query = {};
        if(req.query.postId){
            query.postId = req.query.postId;
        }

        if(req.query.userId){
            query.userId = req.query.userId;
        }

        if(req.query.date){
            query.date = req.query.date;
        }

        AutopostQueue.find(query,function(err,autopostQueues){
            if(err)
                res.status(500).send(err);
            else{
                var returnAutopostQueue =[];

                autopostQueues.forEach(function(element,index,array){
                    var newAutopostQueue = element.toJSON();
                    newAutopostQueue.links = {};
                    newAutopostQueue.links.self = 'http://' + req.headers.host + '/api/autopostQueues/' + newAutopostQueue._id;
                    returnAutopostQueue.push(newAutopostQueue);
                });

                res.json(returnAutopostQueue);
            }
        });
    }


    var putAutopostQueueId = function(req,res){
        if(req.body.postId)
            req.autopostQueue.postId = req.body.postId;
        if(req.body.userId)
            req.autopostQueue.userId = req.body.userId;
        if(req.body.network)
            req.autopostQueue.network = req.body.network;
        if(req.body.date)
            req.autopostQueue.date = req.body.date;
        if(req.body.posted)
            req.autopostQueue.posted = req.body.posted;



        req.autopostQueue.save(function(err){
            if(err)
                res.status(500).send(err);
            else{
                res.json(req.autopostQueue);
            }
        });
    }



    return {
        post : post,
        get  : get,
        putAutopostQueueId : putAutopostQueueId
    }
};

module.exports = autopostQueueController;
