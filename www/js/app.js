angular.module('app',
['ionic',
  'app.controllers',
  'app.routes',
  'app.services',
  'app.directives',
  'validation.match',
  'ti-segmented-control',
  'ng-mfb',
  'ngCordova'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
