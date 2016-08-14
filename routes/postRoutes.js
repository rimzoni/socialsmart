var express = require('express');

var routes = function(Post){

    var postsRouter = express.Router();

    var postController = require('../controllers/postController')(Post);
    postsRouter.route('/')
        .post(postController.post)
        .get(postController.get);

    postsRouter.use('/:postId', function(req,res,next){
        Post.findById(req.params.postId,function(err,post){
            if(err)
                res.status(500).send(err);
            else if(post){
                req.post = post;
                next();
            }
            else{
                res.status(404).send('Post not found');
            }
        })
    });
    postsRouter.route('/:postId')
        .get(postController.getPostId);
    return postsRouter;
};

module.exports = routes;
