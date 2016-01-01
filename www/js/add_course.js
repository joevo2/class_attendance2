angular.module('app.add_course', [])
.controller('add_courseCtrl', function($scope, $ionicHistory) {
  // Add course to Parse database
  $scope.course = {};
  $scope.addCourse = function() {
    if ($scope.course.code !== "" &&
        $scope.course.name !== "" &&
        $scope.course.year !== "" &&
        $scope.course.month !== "") {
      var Courses = Parse.Object.extend("Courses");
      var courses = new Courses();

      courses.save({
        code: ($scope.course.code).toUpperCase(),
        name: $scope.course.name,
        duration: $scope.course.year + "Y" + $scope.course.month + "M"
      }, {
        success: function(courses) {
          console.log("Saved");
        },
        error: function(courses, error) {
          console.log("Failed " + error.message);
        }
      });
      $ionicHistory.goBack();
    }
  };
});
