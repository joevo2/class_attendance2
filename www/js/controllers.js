angular.module('app.controllers', ['app.login', 'app.signup'])
  .controller('homeCtrl', function($scope, $state, $ionicPopover, $ionicHistory) {

    // Ionic popover
    $ionicPopover.fromTemplateUrl('home-menu.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.popover = popover;
    });
    $scope.openPopover = function($event) {
      $scope.popover.show($event);
    };
    $scope.closePopover = function() {
      $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.popover.remove();
    });

    // Logout
    $scope.logout = function() {
      Parse.User.logOut();
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('login');
      $scope.closePopover();
    };
  })

.controller('classCtrl', function($scope) {

})

.controller('adminCtrl', function($scope, $state, $ionicPopover, $ionicHistory) {
    // Ionic popover
    $ionicPopover.fromTemplateUrl('admin-menu.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.popover = popover;
    });
    $scope.openPopover = function($event) {
      $scope.popover.show($event);
    };
    $scope.closePopover = function() {
      $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.popover.remove();
    });

    // Logout
    $scope.logout = function() {
      Parse.User.logOut();
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('login');
      $scope.closePopover();
    };
})
