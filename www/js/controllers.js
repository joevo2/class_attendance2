angular.module('app.controllers', ['app.login',
    'app.add_course',
    'app.add_module',
    'app.admin',
    'app.signup'
  ])
  .controller('homeCtrl', function($scope, $state, $ionicPopover, $ionicHistory, $localstorage) {
    $scope.name = (Parse.User.current()).get('firstName') + " " + (Parse.User.current()).get('lastName');
    $scope.goToClass = function(selectedModule) {
      if ((Parse.User.current()).get('accountType') == 'Lecturer') {
        $state.go('class_lecturer');
      } else {
        $state.go('class');
      }
      $localstorage.setObject('selectedModule', selectedModule);
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
      Parse.User.logOut();            //Parse user logout function
      $ionicHistory.nextViewOptions({ //Disabled the back button in the navigation top bar
        disableBack: true
      });
      $state.go('login');             // go to the login page
      $scope.closePopover();          // close the ionic popover
      localStorage.clear();           // clear all the localstorage
    };
    $scope.goto = function(page) {
      $state.go(page);
    };

    // Student's enrolled class
    $scope.getClass = function() {
      $scope.modules = [];
      // Asscociate with the class named as Student Details in parse
      var StudentModule = Parse.Object.extend("StudentDetails");
      var query = new Parse.Query(StudentModule);
      // Set the query equalTo
      query.equalTo("parent", (Parse.User.current()).id);
      // Get only the first result
      query.first({
        success: function(results) {
          var object = results;
          $scope.modulesCode = object.get('modules');
          console.log($scope.modulesCode);
          //var Modules = Parse.Object.extend("Modules");
          // queryX = new Parse.Query(Modules);
          // queryX.equalTo("objectId", $scope.modulesCode[0]);

          var a = new Parse.Query("Modules");
          a.equalTo("objectId", $scope.modulesCode[0]);

          var b = new Parse.Query("Modules");
          b.equalTo("objectId", $scope.modulesCode[1]);

          var c = new Parse.Query("Modules");
          c.equalTo("objectId", $scope.modulesCode[2]);

          var d = new Parse.Query("Modules");
          d.equalTo("objectId", $scope.modulesCode[3]);

          // An 'or' query for 4 different value
          var mainQuery = Parse.Query.or(a, b, c, d);
          // Find all the result that satisfied the query contraints
          mainQuery.find({
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
              // Store it as a localstorage for offline access
              $localstorage.setObject('module', $scope.modules);
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
      if ($localstorage.getObject('module')) {
        $scope.modules = $localstorage.getObject('module');
      }
    };

    $scope.doRefresh = function() {
      $scope.getClass();
      $scope.$broadcast('scroll.refreshComplete');
    };
  })

.controller('register_moduleCtrl', function($scope, $ionicModal, $ionicHistory, $ionicPopup, modules, $localstorage) {
  // Get module information from service.js which fetch the data from
  // Parse and then store into localstorage object
  modules.get();
  if ($localstorage.getObject('courses')) {
    $scope.modules = $localstorage.getObject('modules');
  }
  // Pull to refresh
  $scope.doRefresh = function() {
    // Get modules in services.js
    modules.get();
    if ($localstorage.getObject('courses')) {
      $scope.modules = $localstorage.getObject('modules');
    }
    $scope.$broadcast('scroll.refreshComplete');
  };

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
  console.log($scope.selected);

  // Enrol in modules
  $scope.confirmModule = function() {
    // ionic confirm pop up
    var confirmPopup = $ionicPopup.confirm({
      title: 'Confirmation',
      template: 'Are you sure you want to enroll in this module?'
    });

    confirmPopup.then(function(res) {
      if (res) {
        $scope.closeModal();
        // Query then update the existing student details
        var StudentDetails = Parse.Object.extend("StudentDetails");
        var query = new Parse.Query(StudentDetails);
        query.equalTo("parent", (Parse.User.current()).id);
        query.first({
          success: function(Result) {
            if (Result) {
              Result.save(null, {
                success: function(result) {
                  // Add an unqiue array to the array object fetched from parse
                  result.addUnique("modules", $scope.selected.id);
                  result.save();
                }
              });
            } else {
              var studentDetails = new StudentDetails();
              studentDetails.save({
                parent: (Parse.User.current()).id,
                modules: [$scope.selected.id]
              }, {
                success: function(courses) {
                  console.log("Saved");
                },
                error: function(courses, error) {
                  console.log("Failed " + error.message);
                }
              });
            }
          }
        });
      } else {
        console.log('You are not sure');
      }
    });
  };


})

.controller('classCtrl', function($scope, $ionicPopup, $ionicHistory, $localstorage, $cordovaBeacon, $ionicPlatform) {
  $scope.selectedModule = $localstorage.getObject('selectedModule');

  // get localstorage object of student attendance
  if ($localstorage.getObject('attendance')) {
    $scope.students = $localstorage.getObject('attendance');
  }

  // Get or create the module instances (classes instances)
  $scope.getModuleInstance = function(type) {
    var ModuleInstance = Parse.Object.extend("ModuleInstance");
    var query = new Parse.Query(ModuleInstance);
    query.equalTo("date", ((new Date()).toDateString()));
    query.equalTo("name", $scope.selectedModule.name);
    query.first({
      success: function(Result) {
        // if the module instance already created
        if (Result) {
          // if this function is called by a lecturer
          // it will save the attendance student object
          if (type === 'lecturer') {
            $scope.students = Result.get('attendance');
            console.log(Result.get('attendance'));
            $localstorage.setObject('attendance', $scope.students);
            return;
          }
          Result.save(null, {
            success: function(result) {
              if (type === 'end') {
                console.log($scope.students);
                result.set("attendance", $scope.students);
              } else {
                // save student attendance in the module instance
                result.addUnique("attendance", {
                  name: (Parse.User.current()).get('firstName') + " " + (Parse.User.current()).get('lastName'),
                });
              }
              result.save();
              $scope.attend = true;
            }
          });
        } else {  // if module instance is not created, create it
          var name;
          if (type === 'lecturer') {
            name = null;
          } else {
            name = (Parse.User.current()).get('firstName') + " " + (Parse.User.current()).get('lastName');
          }
          var moduleInstance = new ModuleInstance();
          moduleInstance.save({
            code: ($scope.selectedModule.code).toUpperCase(),
            name: $scope.selectedModule.name,
            lecturer: $scope.selectedModule.lecturer,
            date: ((new Date()).toDateString()),
            attendance: [{
              name: name,
            }],
          }, {
            success: function(courses) {
              console.log("Saved");
            },
            error: function(courses, error) {
              console.log("Failed " + error.message);
            }
          });
          $scope.attend = true;
        }
      }
    });
  };

  // confirm attendance
  $scope.attendClass = function() {
    console.log(((new Date()).toDateString()));
    var confirmPopup = $ionicPopup.confirm({
      title: 'Confirm',
      template: 'Are you sure you are attending the class?<br><span style="color: red; font-weight: bold;">Fraud class attendance would be blacklisted</span>'
    });
    confirmPopup.then(function(res) {
      if (res) {
        $scope.getModuleInstance();
      } else {
        console.log('You are not sure');
      }
    });
  };

  $scope.refreshClass = function() {
    $scope.getModuleInstance('lecturer');
  };

  $scope.finishClass = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Confirm',
      template: 'Are you sure you want to end the class?'
    });

    confirmPopup.then(function(res) {
      if (res) {
        console.log('Ending class');
        console.log($scope.students);
        $scope.getModuleInstance('end');
        alert('Class ended');
        $ionicHistory.goBack();
      } else {
        console.log("cancelled");
      }
    });
  };


  // Beacon
  var brIdentifier = 'Bean Beacon';
  var brUuid = 'A495DEAD-C5B1-4B44-B512-1370F02D74DE';
  var brMajor = 48879;
  var brMinor = 51966;
  var brNotifyEntryStateOnDisplay = true;

  //$ionicPlatform.ready(function () {
    // $scope.didStartMonitoringForRegionLog = 'Test';
    // $scope.didDetermineStateForRegionLog = '';
    // $scope.didRangeBeaconsInRegionLog = '';
    //
    // $scope.requestAlwaysAuthorization = function() {
    //   $cordovaBeacon.requestAlwaysAuthorization();
    // };
    //
    // $scope.startMonitoringForRegion = function() {
    //   $cordovaBeacon.startMonitoringForRegion($cordovaBeacon.createBeaconRegion(
    //     brIdentifier, brUuid, brMajor, brMinor, brNotifyEntryStateOnDisplay
    //   ));
    // };
    // $scope.startRangingBeaconsInRegion = function() {
    //   $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion(
    //     brIdentifier, brUuid, brMajor, brMinor, brNotifyEntryStateOnDisplay
    //   ));
    // };
    //
    // $scope.stopMonitoringForRegion = function() {
    //   $cordovaBeacon.stopMonitoringForRegion($cordovaBeacon.createBeaconRegion(
    //     brIdentifier, brUuid, brMajor, brMinor, brNotifyEntryStateOnDisplay
    //   ));
    // };
    // $scope.stopRangingBeaconsInRegion = function() {
    //   $cordovaBeacon.stopRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion(
    //     brIdentifier, brUuid, brMajor, brMinor, brNotifyEntryStateOnDisplay
    //   ));
    // };
    //
    // $scope.clearLogs = function() {
    //   $scope.didStartMonitoringForRegionLog = '';
    //   $scope.didDetermineStateForRegionLog = '';
    //   $scope.didRangeBeaconsInRegionLog = '';
    // };
    //
    //
    // $rootScope.$on("$cordovaBeacon:didStartMonitoringForRegion", function (event, pluginResult) {
    //   $scope.didStartMonitoringForRegionLog += '-----' + '\n';
    //   $scope.didStartMonitoringForRegionLog += JSON.stringify(pluginResult) + '\n';
    // });
    //
    // $rootScope.$on("$cordovaBeacon:didDetermineStateForRegion", function (event, pluginResult) {
    //   $scope.didDetermineStateForRegionLog += '-----' + '\n';
    //   $scope.didDetermineStateForRegionLog += JSON.stringify(pluginResult) + '\n';
    // });
    //
    // $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function (event, pluginResult) {
    //   $scope.didRangeBeaconsInRegionLog += '-----' + '\n';
    //   $scope.didRangeBeaconsInRegionLog += JSON.stringify(pluginResult) + '\n';
    // });

  //});

});
