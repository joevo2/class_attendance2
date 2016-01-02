angular.module('app.signup', [])
  .controller('signupCtrl', function($scope, $state, $ionicHistory, $localstorage) {
    $scope.signup = {};

    if ($localstorage.getObject('courses')) {
      $scope.courses = $localstorage.getObject('courses');
    }

    // Create a new account
    $scope.doSignup = function() {
      // Parse user sign up
      var user = new Parse.User();
      user.set("username", $scope.signup.email);
      user.set("password", $scope.signup.password);
      user.set("firstName", $scope.signup.firstName);
      user.set("lastName", $scope.signup.lastName);
      user.set("accountType", $scope.signup.accountType);
      user.set("course", $scope.signup.course);

      user.signUp(null, {
        success: function(user) {
          // Hooray! Let them use the app now.
          alert("Successfully created account for " + $scope.signup.firstName + " " + $scope.signup.lastName);
          $ionicHistory.goBack();
        },
        error: function(user, error) {
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
        }
      });
    };
  });
