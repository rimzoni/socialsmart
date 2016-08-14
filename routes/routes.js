// app/routes.js

module.exports = function(app, passport) {

    app.get('/api/user', isLoggedInAjax, function(req, res) {
        return res.json(req.user);
    });

    app.post('/logout', function(req, res) {
        req.logout();
        res.json({ redirect: '/' });
    });

    // Facebook routes
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email', 'publish_actions']}));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/sharing',
        failureRedirect: '/',
    }));

    // Twitter routes
    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect: '/sharing',
        failureRedirect: '/',
    }));


    // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));


    // send to twitter to do the authentication
    app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

    // handle the callback after twitter has authorized the user
    app.get('/connect/twitter/callback',
        passport.authorize('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));


// route middleware to ensure user is logged in - ajax get
    function isLoggedInAjax(req, res, next) {
        if (!req.isAuthenticated()) {
            return res.json( { redirect: '/login' } );
        } else {
            next();
        }
    }
// route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/home');
    }
    app.get('*', function(req, res) {
        res.render('index.html');
    });
}