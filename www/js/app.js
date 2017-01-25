// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('app', ['ionic', 'ngRoute', 'ngCordova', 'nvd3'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($routeProvider) {
  $routeProvider
    .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'loginCtrl'
    })
    .when('/menu', {
    	templateUrl: 'views/menu.html',
        controller: 'menuCtrl'
    })
    .when('/scan', {
        templateUrl: 'views/scan.html',
        controller: 'scanCtrl'
    })
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'dashboardCtrl'
    })
    .when('/bottleDetails', {
      templateUrl: 'views/bottleDetails.html',
      controller: 'juiceCtrl'
    })
    .when('/added', {
      templateUrl: 'views/bottleAdded.html',
      controller: 'juiceCtrl'
    })
  .when('/community', {
      templateUrl: 'views/community.html',
      controller: 'menuCtrl'
  })
    .otherwise({
    	redirectTo: '/login'
    });
})
