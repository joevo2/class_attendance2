angular.module('app',
['ionic',
  'app.controllers',
  'app.routes',
  'app.services',
  'app.directives',
  'validation.match',
  'ionic-datepicker',
  'ionic-timepicker',
  'ti-segmented-control',
  'ng-mfb'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
