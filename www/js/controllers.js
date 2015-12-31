angular.module('app.controllers', ['app.login', 'app.signup'])
  .controller('homeCtrl', function($scope, $state, $ionicPopover, $ionicHistory) {

    $scope.goToClass = function() {
      if ((Parse.User.current()).get('accountType') == 'Lecturer') {
        $state.go('class_lecturer');
      } else {
        $state.go('class');
      }
    };

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
    $scope.goto = function(page) {
      $state.go(page);
    };

    // Student attended class
    $scope.modules = [];
    var StudentModule = Parse.Object.extend("StudentDetails");
    var query = new Parse.Query(StudentModule);
    query.equalTo("parent", (Parse.User.current()).id);
    query.first({
      success: function(results) {
        var object = results;
        $scope.modulesCode = object.get('modules');
        console.log($scope.modulesCode);
        var Modules = Parse.Object.extend("Modules");
        queryX = new Parse.Query(Modules);
        queryX.equalTo("objectId", $scope.modulesCode[0]);
        queryX.find({
          success: function(results) {
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              $scope.modules[i] = {
                id: object.id,
                code: results[i].get('code'),
                name: results[i].get('name'),
                prerequisite: results[i].get('prerequisite'),
                lecturer: results[i].get('lecturer'),
                availability: results[i].get('availability'),
              };
            }
            window.localStorage['module'] = JSON.stringify($scope.modules);
            console.log($scope.modules);
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
          }
        });
      },
      error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });
    if (window.localStorage['module']) {
      $scope.modules = JSON.parse(window.localStorage['module']);
    }

  })

.controller('register_moduleCtrl', function($scope, $ionicModal, $ionicHistory, $ionicPopup) {
  $scope.modules = [];
  var Modules = Parse.Object.extend("Modules");
  var query = new Parse.Query(Modules);
  query.find({
    success: function(results) {
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        $scope.modules[i] = {
          id: object.id,
          code: results[i].get('code'),
          name: results[i].get('name'),
          prerequisite: results[i].get('prerequisite'),
          lecturer: results[i].get('lecturer'),
          availability: results[i].get('availability'),
        };
      }
      window.localStorage['module'] = JSON.stringify($scope.modules);
    },
    error: function(error) {
      console.log("Error: " + error.code + " " + error.message);
    }
  });
  if (window.localStorage['module']) {
    $scope.modules = JSON.parse(window.localStorage['module']);
  }

  $ionicModal.fromTemplateUrl('confirm_module.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function(selected) {
    $scope.modal.show();
    $scope.selected = selected;
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

  $scope.confirmModule = function() {
    //confirm
    var confirmPopup = $ionicPopup.confirm({
      title: 'Confirmation',
      template: 'Are you sure you want to enroll in this module?'
    });

    confirmPopup.then(function(res) {
      if (res) {
        $scope.closeModal();
        // Submit enrolled module to user accounts
        var StudentDetails = Parse.Object.extend("StudentDetails");
        var studentDetails = new StudentDetails();

        studentDetails.set("parent", (Parse.User.current()).id);

        studentDetails.save(null, {
          success: function(studentDetails) {
            studentDetails.set("modules", [$scope.selected.id]);
            studentDetails.save();
            console.log("Saved module");
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
          }
        });
      } else {
        console.log('You are not sure');
      }
    });
  };


})

.controller('classCtrl', function($scope, $ionicPopup) {
  $scope.attendClass = function() {
    var confirmPopup = $ionicPopup.confirm({
       title: 'Confirm',
       template: 'Are you sure you are attending the class?<br><span style="color: red; font-weight: bold;">Fraud Class attendance would be blacklisted?</span>'
     });

     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
       } else {
         console.log('You are not sure');
       }
     });
  };
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

  // Get courses
  $scope.courses = [];
  var Courses = Parse.Object.extend("Courses");
  var query = new Parse.Query(Courses);
  query.find({
    success: function(results) {
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        $scope.courses[i] = {
          name: object.get('name'),
        };
        console.log(results[i].get('name'));
      }
      window.localStorage['courses'] = JSON.stringify($scope.courses);
    },
    error: function(error) {
      console.log("Error: " + error.code + " " + error.message);
    }
  });

  if (window.localStorage['courses']) {
    $scope.courses = JSON.parse(window.localStorage['courses']);
  }

  // Get modules
  $scope.modules = [];
  var Modules = Parse.Object.extend("Modules");
  var queryM = new Parse.Query(Modules);
  queryM.find({
    success: function(results) {
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        $scope.modules[i] = {
          name: object.get('name'),
        };
        console.log(results[i].get('name'));
      }
    },
    error: function(error) {
      console.log("Error: " + error.code + " " + error.message);
    }
  });
})

.controller('add_courseCtrl', function($scope, $ionicHistory) {
  $scope.course = {};
  $scope.addCourse = function() {
    console.log($scope.course);
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
  };
})

.controller('add_moduleCtrl', function($scope, $ionicHistory) {
  $scope.module = {};
  $scope.week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  $scope.addModule = function() {
    console.log($scope.module);
    var Modules = Parse.Object.extend("Modules");
    var qmodule = new Modules();

    qmodule.save({
      code: ($scope.module.code).toUpperCase(),
      name: $scope.module.name,
      prerequisite: $scope.module.prerequisite,
      lecturer: $scope.module.lecturer,
      availability: {
        start: "1 Oct 2015",
        end: "1 Jan 2016",
        week: {
          tue: {
            start: "1200",
            end: "1500",
          }
        }
      }
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


  // Ionic Date Picker
  $scope.datepickerObject = {
    titleLabel: 'Title', //Optional
    todayLabel: 'Today', //Optional
    closeLabel: 'Close', //Optional
    setLabel: 'Set', //Optional
    setButtonType: 'button-assertive', //Optional
    todayButtonType: 'button-assertive', //Optional
    closeButtonType: 'button-assertive', //Optional
    inputDate: new Date(), //Optional
    mondayFirst: true, //Optional
    //disabledDates: disabledDates, //Optional
    //weekDaysList: weekDaysList, //Optional
    //monthList: monthList, //Optional
    templateType: 'popup', //Optional
    showTodayButton: 'true', //Optional
    modalHeaderColor: 'bar-positive', //Optional
    modalFooterColor: 'bar-positive', //Optional
    from: new Date(2012, 8, 2), //Optional
    to: new Date(2018, 8, 25), //Optional
    callback: function(val) { //Mandatory
      datePickerCallback(val);
    },
    dateFormat: 'dd-MM-yyyy', //Optional
    closeOnSelect: false, //Optional
  };

  var datePickerCallback = function(val) {
    if (typeof(val) === 'undefined') {
      console.log('No date selected');
    } else {
      console.log('Selected date is : ', val);
    }
  };

  // Ionic time Picker
  $scope.timePickerObject = {
    inputEpochTime: ((new Date()).getHours() * 60 * 60), //Optional
    step: 30, //Optional
    format: 12, //Optional
    titleLabel: '12-hour Format', //Optional
    setLabel: 'Set', //Optional
    closeLabel: 'Close', //Optional
    setButtonType: 'button-positive', //Optional
    closeButtonType: 'button-stable', //Optional
    callback: function(val) { //Mandatory
      timePickerCallback(val);
    }
  };

  function timePickerCallback(val) {
    if (typeof(val) === 'undefined') {
      console.log('Time not selected');
    } else {
      var selectedTime = new Date(val * 1000);
      console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
    }
  }
});
