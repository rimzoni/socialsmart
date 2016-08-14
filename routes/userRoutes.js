var express = require('express');

var routes = function(User){

    var usersRouter = express.Router();

    var userController = require('../controllers/userController')(User);

    usersRouter.route('/')
        .post(userController.post)
        .get(userController.get);

    usersRouter.use('/:userId', function(req,res,next){
        User.findById(req.params.userId,function(err,user){
            if(err)
                res.status(500).send(err);
            else if(user){
                req.user = user;
                next();
            }
            else{
                res.status(404).send('User not found');
            }
        })
    });
    usersRouter.route('/:userId')
        .get(userController.getUserId)
        .patch(userController.patchUserId)
        .delete(userController.deleteUserId);
    return usersRouter;
};

module.exports = routes;
