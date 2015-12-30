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

    $scope.goto = function(page) {
      $state.go(page);
    };
})

.controller('add_courseCtrl', function($scope, $ionicHistory) {
    $scope.course = {};
    $scope.addCourse = function() {
      console.log($scope.course);
      var Courses = Parse.Object.extend("Courses");
      var courses = new Courses();

      courses.save({
        code: $scope.course.code,
        name: $scope.course.name,
        duration: $scope.course.durationYear+"Y"+$scope.course.durationMonth+"M"
      }, {
        success: function(courses) {
          console.log("Saved");
        },
        error: function(courses, error) {
          console.log("Failed " + error.message);
        }
      });
      $ionicHistory.goBack();
    };
    console.log($ionicHistory.currentView());
})

.controller('add_moduleCtrl', function($scope) {
    $scope.module = {
      code: 'MOD',
    };


  // Ionic Date Picker
  $scope.datepickerObject = {
    titleLabel: 'Title',  //Optional
    todayLabel: 'Today',  //Optional
    closeLabel: 'Close',  //Optional
    setLabel: 'Set',  //Optional
    setButtonType : 'button-assertive',  //Optional
    todayButtonType : 'button-assertive',  //Optional
    closeButtonType : 'button-assertive',  //Optional
    inputDate: new Date(),  //Optional
    mondayFirst: true,  //Optional
    //disabledDates: disabledDates, //Optional
    //weekDaysList: weekDaysList, //Optional
    //monthList: monthList, //Optional
    templateType: 'popup', //Optional
    showTodayButton: 'true', //Optional
    modalHeaderColor: 'bar-positive', //Optional
    modalFooterColor: 'bar-positive', //Optional
    from: new Date(2012, 8, 2), //Optional
    to: new Date(2018, 8, 25),  //Optional
    callback: function (val) {  //Mandatory
      datePickerCallback(val);
    },
    dateFormat: 'dd-MM-yyyy', //Optional
    closeOnSelect: false, //Optional
  };

  var datePickerCallback = function (val) {
    if (typeof(val) === 'undefined') {
      console.log('No date selected');
    } else {
      console.log('Selected date is : ', val)
    }
  };
})
