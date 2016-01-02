angular.module('app.services', [])
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  };
}])

// This services will get the courses from parse database
// and create an localstroage object to be used in the app
.factory('courses', function($localstorage) {
  var courseData = [];
  return {
    get: function() {
      var Courses = Parse.Object.extend("Courses");
      var query = new Parse.Query(Courses);
      query.find({
        success: function(results) {
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            courseData[i] = {
              name: object.get('name'),
            };
          }
          $localstorage.setObject('courses', courseData);
        },
        error: function(error) {
          console.log("Error: " + error.code + " " + error.message);
        }
      });
    }
  };
})

.factory('modules', function($localstorage) {
  var moduleData = [];
  return {
    get: function() {
      var Modules = Parse.Object.extend("Modules");
      var query = new Parse.Query(Modules);
      query.find({
        success: function(results) {
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            moduleData[i] = {
              id: object.id,
              code: object.get('code'),
              name: object.get('name'),
              prerequisite: object.get('prerequisite'),
              lecturer: object.get('lecturer'),
              availability: object.get('availability'),
            };
          }
          console.log(moduleData);
          $localstorage.setObject('modules', moduleData);
        },
        error: function(error) {
          console.log("Error: " + error.code + " " + error.message);
        }
      });
    }
  };
});
