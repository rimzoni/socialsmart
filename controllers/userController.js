var userController = function(User){

    var post = function(req,res){
        var user = new User(req.body);

        if(!req.body.name){
            res.status(400);
            res.send('Name is required');
        }
        else{
            user.save();
            res.status(201);
            res.send(user);
        }
    }

    var get = function(req,res){

        var query = {};
        if(req.query.name){
            query.name = req.query.name;
        }

        if(req.query.category){
            query.category = req.query.category;
        }

        if(req.query.active){
            query.active = req.query.active;
        }

        User.find(query,function(err,Users){
            if(err)
                res.status(500).send(err);
            else{
                var returnUser =[];

                Users.forEach(function(element,index,array){
                    var newUser = element.toJSON();
                    newUser.links = {};
                    newUser.links.self = 'http://' + req.headers.host + '/api/Users/' + newUser._id;
                    returnUser.push(newUser);
                });

                res.json(returnUser);
            }
        });
    }

    var findByUserId = function(req,res){

        User.findById(user.userId, function(err, user) {

            res.send(user);
        });

    }

    var getUserId = function(req,res){

        var returnUser = req.User.toJSON();

        returnUser.links = {};

        var nameLink = 'http://' + req.headers.host + '/api/Users/?name=' + returnUser.name;
        var categoryLink = 'http://' + req.headers.host + '/api/Users/?category=' + returnUser.category;
        var activeLink = 'http://' + req.headers.host + '/api/Users/?active=' + returnUser.active;

        returnUser.links.filterByName = nameLink.reUser(' ','%20');
        returnUser.links.filterByCategory = categoryLink.reUser(' ','%20');
        returnUser.links.filterByActive = activeLink.reUser(' ','%20');

        res.json(returnUser);
    }


    var patchUserId = function(req,res){
        if(req.body._id)
            delete req.body._id;

        for(var p in req.body){
            req.User[p] = req.body[p];
        }

        req.User.save(function(err){
            if(err)
                res.status(500).send(err);
            else{
                res.json(req.User);
            }
        });
    }

    var deleteUserId = function(req,res){
        req.User.remove(function(err){
            if(err)
                res.status(500).send(err);
            else{
                res.status(204).send("User removed.");
            }
        });
    }

    // var

    return {
        post : post,
        get  : get,
        findByUserId : findByUserId,
        getUserId : getUserId,
        patchUserId : patchUserId,
        deleteUserId : deleteUserId
    }
};

module.exports = userController;