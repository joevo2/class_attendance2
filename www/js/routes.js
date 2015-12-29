angular.module('app.routes', [])
.config(function($stateProvider, $urlRouterProvider) {
  // Parse Initilise  with API key
  Parse.initialize("4nqAmOf9scv9vWFCdeZkNMH0yHSXAAmb3Pnf5mk9", "b2wahr5y1nRpV4vlB3mLWBNTtKVBriHiq3Ao3LZg");

  var path = '/login';
  if (Parse.User.current()) {
    path = '/home';
  }

  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })

    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'signupCtrl'
    })

    .state('admin', {
      url: '/admin',
      templateUrl: 'templates/admin.html',
      controller: 'adminCtrl'
    })

    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'homeCtrl'
    })

    .state('class', {
      url: '/class',
      templateUrl: 'templates/class.html',
      controller: 'classCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise(path);
});
