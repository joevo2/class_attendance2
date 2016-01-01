angular.module('app.admin', [])
.controller('adminCtrl', function($scope, $state, $ionicPopover, $ionicHistory, courses, $localstorage) {

  // Get courses services in service.js
  // Where it will fetch the data from parse and save into
  // a localstorage object.
  courses.get();
  if ($localstorage.getObject('courses')) {
    $scope.courses = $localstorage.getObject('courses');
  }

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

  $scope.goto = function(page) {
    $state.go(page);
  };

  // Get modules
  // $scope.modules = [];
  // var Modules = Parse.Object.extend("Modules");
  // var queryM = new Parse.Query(Modules);
  // queryM.find({
  //   success: function(results) {
  //     for (var i = 0; i < results.length; i++) {
  //       var object = results[i];
  //       $scope.modules[i] = {
  //         name: object.get('name'),
  //       };
  //       console.log(results[i].get('name'));
  //     }
  //   },
  //   error: function(error) {
  //     console.log("Error: " + error.code + " " + error.message);
  //   }
  // });
});
