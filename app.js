var express = require('express');
    mongoose = require('mongoose');
var schedule = require('node-schedule');
var dbConfig = require('./config/db');
var path     = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var session = require('express-session');
var User = require('./models/user');
var Post  = require('./models/post');
var OptimalTime = require('./models/optimalTime');
var SmartSchedule = require('./models/smartSchedule');
var AutopostQueue = require('./models/autopostQueue');
postRouter = require('./routes/postRoutes')(Post);
userRouter = require('./routes/userRoutes')(User);
autopostQueueRouter = require('./routes/autopostQueueRoutes')(AutopostQueue);
optimalTimeRouter = require('./routes/optimalTimeRoutes')(OptimalTime);
smartScheduleRouter = require('./routes/smartScheduleRoutes')(SmartSchedule);
var facebookController = require('./controllers/facebookController')(Post);
var twitterController = require('./controllers/twitterController')(Post);
var smartScheduleController = require('./controllers/smartScheduleController')(SmartSchedule);
var autopostQueueController = require('./controllers/autopostQueueController')(AutopostQueue);

//db
var db = mongoose.connect(dbConfig.location);
// serialize and deserialize
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


var app = express();

app.use(express.static('./public'));
app.set('views', './public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

app.use('/api/posts',postRouter);
app.use('/api/users',userRouter);
app.use('/api/optimaltimes',optimalTimeRouter);
app.use('/api/smartSchedule',smartScheduleRouter);
app.use('/api/autopostQueue',autopostQueueRouter);
app.use(session({ secret: '231JNBK567JFKSL', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// routes ======================================================================
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport




var userRouter = express.Router();

userRouter.route('/Users')
    .get(function(req,res){
        User.find(function(err,users){
            if(err){
                res.status(500).send(err);
            }else{
                res.json(users);
            }
        });
    });

app.use('/api', userRouter);


//event listener
var postEvent = require('./events/postEvent');
postEvent.on('newSchedulePost', schedulePostHandler);
postEvent.on('newPost', postHandler);

function schedulePostHandler(post){

    if(post.twitter) {

      var date = new Date(post.timeToPostTwitter);

      var hour = date.getHours();
      var day = date.getDay();
      var monthDay = date.getDate();
      var year = date.getFullYear();
      var month = date.getMonth();
      var minutes = date.getMinutes();

      var autopostQueue = new AutopostQueue;
      autopostQueue.postId = post._id;
      autopostQueue.userId = post.userId;
      autopostQueue.network = 'twitter';
      autopostQueue.dayOfWeek = day;
      autopostQueue.hour = hour;
      autopostQueue.minutes = minutes;
      autopostQueue.year = year;
      autopostQueue.date = monthDay;
      autopostQueue.month = month;
      autopostQueue.posted = false;

      autopostQueue.save();

    }
    if(post.facebook) {

      var date = new Date(post.timeToPostFacebook);
      var hour = date.getHours();
      var day = date.getDay();
      var monthDay = date.getDate();
      var year = date.getFullYear();
      var month = date.getMonth();
      var minutes = date.getMinutes();

      var autopostQueue = new AutopostQueue;
      autopostQueue.postId = post._id;
      autopostQueue.userId = post.userId;
      autopostQueue.network = 'facebook';
      autopostQueue.dayOfWeek = day;
      autopostQueue.hour = hour;
      autopostQueue.minutes = minutes;
      autopostQueue.year = year;
      autopostQueue.date = monthDay;
      autopostQueue.month = month;
      autopostQueue.posted = false;

      autopostQueue.save();

    }

}

function postHandler(post){

    var OptimalTime = require('./models/optimalTime');
    User.findOne({_id: post.userId}, function (err, user) {
        if (err) {
            console.log(err);
        } else if (user) {
            if(post.twitter)
                twitterController.twitterPost(user.twitter.token,user.twitter.tokenSecret,post.post);

            if(post.facebook)
                facebookController.facebookPost(user.facebook.token,post.post);
        } else {
            console.log('User not found!');
        }
    });

}

schedule.scheduleJob('*/1 * * * *', function(){
    var date = new Date();
    var current_hour = date.getHours();
    var current_day = date.getDay();
    var current_monthDay = date.getDate();
    var current_year = date.getFullYear();
    var current_month = date.getMonth();
    var current_minutes = date.getMinutes();

    var autopostQueue = AutopostQueue.find({year : current_year, date: current_monthDay, dayOfWeek: current_day, posted:false}, null, {sort: 'hour'}).exec();
    autopostQueue.then(function (autopostQueues) {
        if(autopostQueues){
            autopostQueues.forEach(function (element, index, array) {
                var autopostQueue = element.toJSON();

                if(autopostQueue.hour==current_hour){
                    if(autopostQueue.minutes == current_minutes){
                        Post.findById(autopostQueue.postId, function(err, post) {
                            User.findById(post.userId, function(err, user) {
                                if(autopostQueue.network == 'twitter'){
                                    twitterController.twitterPost(user.twitter.token,user.twitter.tokenSecret,post.post);
                                    newAutopostQueue = new AutopostQueue(autopostQueue);
                                    newAutopostQueue.posted = true;
                                    newAutopostQueue.save();
                                }else if(autopostQueue.network == 'facebook'){
                                    facebookController.facebookPost(user.facebook.token,post.post);
                                    newAutopostQueue = new AutopostQueue(autopostQueue);
                                    newAutopostQueue.posted = true;
                                    newAutopostQueue.save();
                                }

                             });
                        });
                    };
                }
            });
        };

    });
});

var port = process.env.PORT || 3000;

app.listen(port, function(){
    console.log('Running on port:' + port);
});
