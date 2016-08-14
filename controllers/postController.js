var postController = function(Post){

    var postEvent = require('../events/postEvent');
    var resp = [];
    var post = function(req,res){

        var post = new Post(req.body);
        if(!req.body.post){
            res.status(400);
            res.send('Post is required');
        }
        else{
            post.save(function(err,post) {
                if(err)
                    res.status(500).send(err);
                else {
                    if (post.autopost == true) {
                        postEvent.emit('newSchedulePost', post);
                    } else {
                        postEvent.emit('newPost', post);
                    }
                    res.status(201).send(post)
                }
            });
        }
    }

    var get = function(req,res){

        var query = {};
        if(req.query.userId){
            query.userId = req.query.userId;
        }

        if(req.query.post){
            query.post = req.query.post;
        }

        if(req.query.twitter){
            query.twitter = req.query.twitter;
        }

        if(req.query.facebook){
            query.facebook = req.query.facebook;
        }

        if(req.query.autopost){
            query.autopost = req.query.autopost;
        }

        Post.find(query,function(err,posts){
            if(err)
                res.status(500).send(err);
            else{
                var returnPost =[];

                posts.forEach(function(element,index,array){
                    var newPost = element.toJSON();
                    newPost.links = {};
                    newPost.links.self = 'http://' + req.headers.host + '/api/posts/' + newPost._id;
                    returnPost.push(newPost);
                });

                res.json(returnPost);
            }
        });
    }

    var getPostId = function(req,res){

        var returnPost = req.post.toJSON();

        returnPost.links = {};

        var userIdLink = 'http://' + req.headers.host + '/api/posts/?userId=' + returnPlace.userId;
        var postLink = 'http://' + req.headers.host + '/api/posts/?post=' + returnPlace.post;
        var twitterLink = 'http://' + req.headers.host + '/api/posts/?twitter=' + returnPlace.twitter;
        var facebookLink = 'http://' + req.headers.host + '/api/posts/?facebook=' + returnPlace.facebook;
        var autopostLink = 'http://' + req.headers.host + '/api/posts/?autopost=' + returnPlace.autopost;

        returnPlace.links.filterByUserId = userIdLink.replace(' ','%20');
        returnPlace.links.filterByPost = postLink.replace(' ','%20');
        returnPlace.links.filterByTwitter = twitterLink.replace(' ','%20');
        returnPlace.links.filterByFacebook = facebookLink.replace(' ','%20');
        returnPlace.links.filterByAutopost = autopostLink.replace(' ','%20');

        res.json(returnPost);
    }


    return {
        post : post,
        get  : get,
        getPostId : getPostId
    }
};

module.exports = postController;