zenbeat.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: '../views/mainindex.html',
        controller: 'MainController'
      })
      .when('/login', {
        templateUrl: '../views/login1.html',
        controller: 'LoginController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
