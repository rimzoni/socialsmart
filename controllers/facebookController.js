var request = require('request');
var configAuth = require('../config/oauth');

var facebookController = function(Post){

    function facebookPost(token, message) {
        // Specify the URL and query string parameters needed for the request
        var url = 'https://graph.facebook.com/me/feed';
        var params = {
            message: message,
            access_token: token
        };

        // Send the request
        request.post({
            url: url,
            qs: params
        }, function (err, resp, body) {

            // Handle any errors that occur
            if (err) return console.error("Error occured: ", err);
            body = JSON.parse(body);
            if (body.error) return console.error("Error returned from facebook: ", body.error);

            // Generate output
            var output = '<;p>;Message has been posted to your feed. Here is the id generated:<;/p>;';
            output += '<;pre>;' + JSON.stringify(body, null, 't') + '<;/pre>;';

            console.log(output);
        });

    }
    var post = function(req,res){
        var user = new User(req.body);

        if(!req.body.name){
            res.status(400);
            res.send('Name is required');
        }
        else{
            User.save();
            res.status(201);
            res.send(User);
        }
    }

    var revoke = function(req,res){

        var returnUser = req.User.toJSON();

        returnUser.facebook.token = '';
        returnUser.isNew = false;
        returnUser.save(function(err) {
            res.json(returnUser);
        });
    }




    return {
        facebookPost : facebookPost,
        revoke       : revoke
    }
};

module.exports = facebookController;
