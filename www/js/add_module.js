angular.module('app.add_module', [])
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
