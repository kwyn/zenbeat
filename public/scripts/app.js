var zenbeat = angular.module('zenbeat', ['ngRoute','ngAnimate'])
  .service('AuthService', [function(){
        var userIsAuthenticated = false;

        this.setUserAuthenticated = function(value) {
            userIsAuthenticated = value;
        };

        this.getUserAuthenticated = function() {
            return userIsAuthenticated;
        };

        return this;
  }])
  .run(['$rootScope', 'AuthService', '$location', function($rootScope, AuthService, $location){
      // Everytime the route in our app changes check auth status
      $rootScope.$on("$routeChangeStart", function(event, next, current) {
        // if you're logged out send to login page.
        if (next.requireLogin && !AuthService.getUserAuthenticated()) {
          $location.path('/login');
          event.preventDefault();
        }
      });
  }])
  .service('LoginService', [function() {

      this.attemptLogin = OAuth.callback('gmail', function(err, result) {
          if(err){
             this.err = err;
          }
          return true;
          // handle error with err
          // use result.access_token in your API request
        });
      return this;
  }])
  .controller('MainController', ['$scope', 'AuthService', '$location', '$http', function($scope, AuthService, $location, $http) {
    var token;
    OAuth.initialize('bIKHVRopgWPyXO6yQxbn9ohNjVc');
    OAuth.popup('google', function(err, result) {
      if(err){
        console.log(err);
      }
      token = result;
      console.log(result);
      // use result to access tokens or make API calls
    });
    $scope.logoutUser = function() {
      // run a logout function to your api
      AuthService.setUserAuthenticated(false);
      $location.path('/login');
    };

    $scope.isLoggedIn = function() {
      return AuthService.getUserAuthenticated();
    };

    //ajax stuff
    $scope.myData = {};
    $scope.gradients = "background-color:red;";

    $scope.calcGradients = function( data ){

      //  change = current - least //with margin???
      //  change = current - average //with margin???
      //
      //  change = last_current - current
      //  current_change += change
      //
      //  if current change goes above a threshold set a gradient for i
      //  if it falls below a certain threshold set an end to the gradient
      //
      //if its negative then its increasing 
      //if its positive its decereasing

      //we know the total time here
      //we calc the height in pixels

      //we know the peaks @ a given time
      //cal those for a given pixel
      //set the start of the gradient
      //set the end of the gradient at the end of the thing

      //return a thing that is an array

      var gradient = 'linear-gradient(to bottom, red 0%,';

      var change = 0,
        previous_change = 0,
        hrv = $scope.average,
        previous_hrv = 0,
        current_change_total = 0;

      var threshold = 40;

      for( var i = 0; i < $scope.myData.length; i++ ){

        previous_change = change;

        previous_hrv = hrv;
        hrv = $scope.myData[i][1];

        previous_change = change;
        change = previous_hrv - hrv;

        current_change_total += change;

        var percent = ( i / $scope.myData.length ) * 100;

        if( current_change_total > threshold ){
          //calculate the percentage
          gradient = gradient + 'yellow '+percent+'%, '
        }else{
          gradient = gradient + 'red '+percent+'%, '

        }
      }

      gradient = gradient + 'red 100%)';

      return {
          'background-image': gradient
      };
    };

    $scope.doClick = function() {

      var responsePromise = $http.get("/info");

      responsePromise.success(function(data, status, headers, config) {
        $scope.myData = data.data;
        $scope.startTime = data.time;
        $scope.average = data.average;
      });
      responsePromise.error(function(data, status, headers, config) {
        alert("AJAX failed!");
      });
    };

  }])
  .controller('LoginController', ['$scope', 'LoginService', 'AuthService', '$location', function($scope, LoginService, AuthService, $location){
    if (AuthService.getUserAuthenticated()) {
        $location.path('/');
      }

      // attempt login to your api
      $scope.attemptLogin = function() {
          /**
          LoginService.attemptLogin($scope.credentials.email, $scope.credentials.password).success(function(data) {
              if (data.success) {
                  AuthService.setUserAuthenticated(true);
                  $location.path('/pets');
              } else {
                  AuthService.setUserAuthenticated(false);
                  // you're probably a hacker
              }
          });
           */

          AuthService.setUserAuthenticated(true);
          $location.path('/');
      };

  }]);
