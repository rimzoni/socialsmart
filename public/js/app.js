// public/core.js
var app = angular.module('SocialScheduler', ['ngRoute']);



app.controller('mainController', function($scope, $http,$timeout) {




     $scope.init = function() {

         $scope.loading = true;

         $http.get('/api/user')
             .success(function(data) {
                 $scope.user = data;
                 $scope.loading = false;
             });

         $scope.message_error = true;
         $scope.checkbox_error = true;
         $scope.schedule_times = true;
         $scope.schedule_facebook = true;
         $scope.schedule_twitter = true;
         $scope.charCount = true;
         $scope.post_message = true;
         $scope.twitter = 'false';
         $scope.facebook = 'false';
         $scope.autopost = 'false';
         $scope.timeToPostTwitter = new Date();
         $scope.timeToPostFacebook = new Date();
         $scope.days = ["Sunday", "Monday", "Tuesday", "Wednsday", "Thursday", "Friday", "Saturday"];

     };

     $scope.init();


    $scope.twitterCheckbox = function(value)
    {
        $scope.twitter = value;
        if(value == 'true')
            $scope.charCount = false;
        else
            $scope.charCount = true;
    };
    $scope.facebookCheckbox = function(value)
    {
        $scope.facebook = value;
    };
    $scope.autopostCheckbox = function(value)
    {
        $scope.autopost = value;
    };

    $scope.createPost = function() {
        $scope.errors = [];
        $scope.message_error = true;
        $scope.checkbox_error = true;
        $scope.post_message = true;
        $scope.schedule_times = true;
        $scope.schedule_facebook = true;
        $scope.schedule_twitter = true;
        var date = new Date();


        if(!$scope.message){
            $scope.message_error = false;
            $scope.errors['message'] = 'Message is required!';
        }
        if($scope.twitter == 'false' && $scope.facebook == 'false'){
            $scope.checkbox_error = false;
            $scope.errors['checkbox'] = 'Social network is required, please select Facebook or Twitter!';
        }

        if(!$scope.errors.message && !$scope.errors.checkbox){
          if($scope.twitter =='true' && $scope.autopost == 'true'){
              $http.post('/api/smartSchedule', {
                  network: 'twitter',
                  userId: $scope.user._id,
                  date: date
              }).success(function(data) {
                  $scope.scheduleTimeTwitter = data;
                  $scope.timeToPostTwitter = new Date(data.year,data.month,data.monthDay ,data.hour, data.minutes );
                  $scope.scheduleTimeTwitter.day = $scope.days[data.day];
                  $scope.schedule_times = false;
                  $scope.schedule_twitter = false;
                  console.log(data);
              }).error(function(data) {
                  $scope.errors['serverError'] = data;
              });
          }
          if($scope.facebook =='true' && $scope.autopost == 'true'){
              $http.post('/api/smartSchedule', {
                  network: 'facebook',
                  userId: $scope.user._id,
                  date: date
              }).success(function(data) {
                  $scope.scheduleTimeFacebook = data;
                  $scope.timeToPostFacebook = new Date(data.year,data.month,data.monthDay ,data.hour, data.minutes );
                  $scope.scheduleTimeFacebook.day = $scope.days[data.day];
                  $scope.schedule_times = false;
                  $scope.schedule_facebook = false;
                  console.log(data);
              }).error(function(data) {
                  $scope.errors['serverError'] = data;
              });
          }
            if($scope.twitter == 'false')
              $scope.timeToPostTwitter = '';
            if($scope.facebook == 'false')
              $scope.timeToPostFacebook = '';
            $http.post('/api/posts', {
                userId: $scope.user._id,
                post: $scope.message,
                facebook: $scope.facebook,
                twitter : $scope.twitter,
                autopost : $scope.autopost,
                timeToPostTwitter : $scope.timeToPostTwitter,
                timeToPostFacebook : $scope.timeToPostFacebook
            }).success(function(data) {
                $scope.message = '';
                $scope.post_message = false;
                //commented because bug
                // $scope.facebook = 'false';
                // $scope.twitter = 'false';
                // $scope.autopost = 'false';
                $scope.posts = data;

                console.log(data);
            }).error(function(data) {
                    $scope.errors['serverError'] = data;
            });

        }else{
            $timeout(function(){
                $scope.message_error = true;
                $scope.checkbox_error = true;
            }, 5000);
        }




        };
});

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/sharing', {
            templateUrl: '/views/sharing.html',
            controller: 'mainController'
        })
        .when('/profile', {
            templateUrl: '/views/profile.html',
            controller: 'mainController',
        })
        .otherwise({
            templateUrl: '/views/home.html',
            controller: 'mainController',
        });
    $locationProvider.html5Mode(true); //Use html5Mode so your angular routes don't have #/route
}])
