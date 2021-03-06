angular.module('app.add_module', [])
.controller('add_moduleCtrl', function($scope, $ionicHistory) {
  $scope.module = {};
  $scope.week = [
    {
      name: "Mon",
    },
    {
      name: "Tue",
    },
    {
      name: "Wed",
    },
    {
      name: "Thu",
    },
    {
      name: "Fri",
    },
    {
      name: "Sun",
    },
  ];


  $scope.addModule = function() {
    console.log($scope.module);
    console.log($scope.week);
    var Modules = Parse.Object.extend("Modules");   // Create a class/table in parse named 'Modules'
    var qmodule = new Modules();                    // Create an instance of it

    qmodule.save({                                  // Save the object in parse
      code: ($scope.module.code).toUpperCase(),
      name: $scope.module.name,
      prerequisite: $scope.module.prerequisite,
      lecturer: $scope.module.lecturer,
      availability: {
        start: $scope.module.start,
        end: $scope.module.end,
        week: $scope.week,
      }
    }, {
      success: function(courses) {
        console.log("Saved");
        alert("Successfully created "+$scope.module.name);
      },
      error: function(courses, error) {
        console.log("Failed " + error.message);
      }
    });
    $ionicHistory.goBack();                       // Go back one page
  };
});
