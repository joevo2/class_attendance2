angular.module('app.signup', [])
  .controller('signupCtrl', function($scope, $state, $ionicHistory) {
    $scope.signup = {};
    // Login
    $scope.doSignup = function() {
      // Parse user sign up
      var user = new Parse.User();
      user.set("username", $scope.signup.email);
      user.set("password", $scope.signup.password);
      user.set("firstName", $scope.signup.firstName);
      user.set("lastName", $scope.signup.lastName);
      user.set("accountType", $scope.signup.accountType);

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
