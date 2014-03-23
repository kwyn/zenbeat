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
  .controller('MainController', ['$scope', 'AuthService', '$location', function($scope, AuthService, $location) {
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
    $scope.myData.doClick = function(item, event) {

      var responsePromise = $http.get("/info");

      responsePromise.success(function(data, status, headers, config) {
        $scope.myData = data;
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
