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
        if(req.query.timeToPostTwitter){
            query.timeToPostTwitter = req.query.timeToPostTwitter;
        }
        if(req.query.timeToPostFacebook){
            query.timeToPostFacebook = req.query.timeToPostFacebook;
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

        var userIdLink = 'http://' + req.headers.host + '/api/posts/?userId=' + returnPost.userId;
        var postLink = 'http://' + req.headers.host + '/api/posts/?post=' + returnPost.post;
        var twitterLink = 'http://' + req.headers.host + '/api/posts/?twitter=' + returnPost.twitter;
        var facebookLink = 'http://' + req.headers.host + '/api/posts/?facebook=' + returnPost.facebook;
        var autopostLink = 'http://' + req.headers.host + '/api/posts/?autopost=' + returnPost.autopost;
        var timeToPostTwitterLink = 'http://' + req.headers.host + '/api/posts/?timetoposttwitter=' + returnPost.timeToPostTwitter;
        var timeToPostFacebookLink = 'http://' + req.headers.host + '/api/posts/?timetopostfacebook=' + returnPost.timeToPostFacebook;

        returnPost.links.filterByUserId = userIdLink.replace(' ','%20');
        returnPost.links.filterByPost = postLink.replace(' ','%20');
        returnPost.links.filterByTwitter = twitterLink.replace(' ','%20');
        returnPost.links.filterByFacebook = facebookLink.replace(' ','%20');
        returnPost.links.filterByAutopost = autopostLink.replace(' ','%20');
        returnPost.links.filterByTimeToPostTwitter =timeToPostTwitterLink.replace(' ','%20');
        returnPost.links.filterByTimeToPostFacebook =timeToPostFacebookLink.replace(' ','%20');

        res.json(returnPost);
    }


    return {
        post : post,
        get  : get,
        getPostId : getPostId
    }
};

module.exports = postController;
