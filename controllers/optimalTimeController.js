var optimalTimeController = function(OptimalTime){

    var resp = [];
    var post = function(req,res){

        var optimalTime = new OptimalTime(req.body);
        if(!req.body.network){
            res.status(400);
            res.send('Network is required');
        }
        else{
            optimalTime.save(function(err,optimalTime) {
                if(err)
                    res.status(500).send(err);
                else {
                    optimalTime.save();
                    res.status(201);
                    res.send(optimalTime);
                }
            });
        }
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

    var getOptimalTimeId = function(req,res){

        var returnOptimalTime = req.optimalTime.toJSON();

        returnOptimalTime.links = {};

        var networkLink = 'http://' + req.headers.host + '/api/optimaltimes/?network=' + returnOptimalTime.network;
        var dayLink = 'http://' + req.headers.host + '/api/optimaltimes/?day=' + returnOptimalTime.day;
        var hourLink = 'http://' + req.headers.host + '/api/optimaltimes/?hour=' + returnOptimalTime.hour;
        var durationLink = 'http://' + req.headers.host + '/api/optimaltimes/?duration=' + returnOptimalTime.duration;
        var recommendedLink = 'http://' + req.headers.host + '/api/optimaltimes/?recommended=' + returnOptimalTime.recommended;

        returnOptimalTime.links.filterByNetwork = networkLink.replace(' ','%20');
        returnOptimalTime.links.filterByDay = dayLink.replace(' ','%20');
        returnOptimalTime.links.filterByHour = hourLink.replace(' ','%20');
        returnOptimalTime.links.filterByDuration = durationLink.replace(' ','%20');
        returnOptimalTime.links.filterByRecommended = recommendedLink.replace(' ','%20');

        res.json(returnOptimalTime);
    }

    var putOptimalTimeId = function(req,res){
        if(req.body.network)
            req.optimalTime.network = req.body.network;
        if(req.body.day)
            req.optimalTime.day = req.body.day;
        if(req.body.hour)
            req.optimalTime.hour = req.body.hour;
        if(req.body.duration)
            req.optimalTime.duration = req.body.duration;
        if(req.body.recommended)
            req.optimalTime.recommended = req.body.recommended;


        req.optimalTime.save(function(err){
            if(err)
                res.status(500).send(err);
            else{
                res.json(req.optimalTime);
            }
        });
    }

    var patchOptimalTimeId = function(req,res){
        if(req.body._id)
            delete req.body._id;

        for(var p in req.body){
            req.optimalTime[p] = req.body[p];
        }

        req.optimalTime.save(function(err){
            if(err)
                res.status(500).send(err);
            else{
                res.json(req.optimalTime);
            }
        });
    }

    var deleteOptimalTimeId = function(req,res){
        req.optimalTime.remove(function(err){
            if(err)
                res.status(500).send(err);
            else{
                res.status(204).send("OptimalTime removed.");
            }
        });
    }



    return {
        post : post,
        get  : get,
        getOptimalTimeId : getOptimalTimeId,
        putOptimalTimeId : putOptimalTimeId,
        patchOptimalTimeId : patchOptimalTimeId,
        deleteOptimalTimeId : deleteOptimalTimeId
    }
};

module.exports = optimalTimeController;