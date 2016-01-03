angular.module('app.admin', [])
.controller('adminCtrl', function($scope, $state, $ionicPopover, $ionicHistory, courses, modules, $localstorage, $window) {
  // Get courses services in service.js
  // Where it will fetch the data from parse and save into
  // a localstorage object.
  courses.get();
  if ($localstorage.getObject('courses')) {
    $scope.courses = $localstorage.getObject('courses');
  }

  // Get modules in services.js
  modules.get();
  if ($localstorage.getObject('courses')) {
    $scope.modules = $localstorage.getObject('modules');
  }

  $scope.doRefresh = function() {
    courses.get();
    if ($localstorage.getObject('courses')) {
      $scope.courses = $localstorage.getObject('courses');
    }
    // Get modules in services.js
    modules.get();
    if ($localstorage.getObject('courses')) {
      $scope.modules = $localstorage.getObject('modules');
    }
    $scope.$broadcast('scroll.refreshComplete');
  };

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
    localStorage.clear();
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('login');
    $scope.closePopover();
  };

  $scope.goto = function(page) {
    $state.go(page);
  };
});
