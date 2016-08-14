var request = require('request');

var configAuth = require('../config/oauth');

var twitterController = function(Post){

    function twitterPost(token,token_secret,status) {
        // Specify the URL and query string parameters needed for the request
        var url = 'https://api.twitter.com/1.1/statuses/update.json';
        var params = {
            status: status
        };

        // Send the request
        request.post({
            url: url,
            oauth : {
            consumer_key: configAuth.twitter.consumerKey,
            consumer_secret: configAuth.twitter.consumerSecret,
            token : token,
            token_secret : token_secret,
            },
            qs: params

        }, function (err, resp, body) {

            // Handle any errors that occur
            if (err) return console.error("Error occured: ", err);
            body = JSON.parse(body);
            if (body.error) return console.error("Error returned from twitter: ", body.error);

            // Generate output
            var output = '<;p>;Message has been posted to your feed. Here is the id generated:<;/p>;';
            output += '<;pre>;' + JSON.stringify(body, null, 't') + '<;/pre>;';

            console.log(output);

        });

    }


    var revoke = function(req,res){

        var returnUser = req.User.toJSON();


        returnUser.twitter.token = '';
        returnUser.isNew = false;
        returnUser.save(function(err) {
            res.json(returnUser);
        });
    }


    return {
        twitterPost : twitterPost,
        revoke      : revoke
    }
};

module.exports = twitterController;
