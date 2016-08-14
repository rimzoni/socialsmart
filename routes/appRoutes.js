// app/routes.js

module.exports = function(app, passport) {

    // route for home page
    app.get('/', isLoggedIn, function (req, res) {
        res.render('sharing.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // route for home page
    app.get('/home', function (req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // route for showing the profile page
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // route for showing the profile page
    app.get('/sharing', isLoggedIn, function (req, res) {
        res.render('sharing.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    app.get('fbpost',isLoggedIn,function(req,res){
        var request = require('request');

        function postMessage(access_token, message, response) {
            // Specify the URL and query string parameters needed for the request
            var url = 'https://graph.facebook.com/me/feed';
            var params = {
                access_token: access_token,
                message: message
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

                // Send output as the response
                response.writeHeader(200, {
                    'Content-Type': 'text/html'
                });
                response.end(output);
            });

        }
    })


// route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/home');
    }
}