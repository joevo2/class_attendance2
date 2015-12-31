angular.module('app.login', [])
  .controller('loginCtrl', function($rootScope, $scope, $state, $ionicHistory, $localstorage) {
    $scope.login = {};
    // Login
    $scope.doLogin = function() {
      console.log($scope.login);
      Parse.User.logIn($scope.login.username, $scope.login.password, {
        success: function(user) {
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          if (user.get('accountType') === 'Admin') {
            $localstorage.set('admin', true);
            $state.go('admin');
          }
          else {
            $state.go('home');
          }
          $scope.login = {};
        },
        error: function(user, error) {
          // The login failed. Check error to see why.
          alert("Error: " + error.code + " " + error.message);
        }
      });
    };
  });
