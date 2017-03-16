var app = angular.module('app', ['ui.router', 'ngAnimate']);

setTimeout(
  function asyncBootstrap() {
    angular.bootstrap(document, ["app"]);
  }, (10)
);

app.run(function ($rootScope, $state, $timeout, $preload) {
  
  $rootScope.endAnimation = false;

  $timeout(function () {
    $rootScope.endAnimation = true;
  }, 3300); //3.3sec

  $rootScope.$state = $state;
  $rootScope.loading = false;
  $rootScope.modalData = {};
  $(".button-collapse").sideNav({
    closeOnClick: true
  });

//  $preload.loadAll().then(function (success) {
//    console.log("Preload", success);
//  }, function (error) {
//    console.log("Preload", error);
//  });

  $rootScope.$on('$stateChangeStart', function (evt, to, params) {
    if (to.redirectTo) {
      evt.preventDefault();
      $state.go(to.redirectTo, params, {
        location: 'replace'
      });
    }
  });
});


/* --- Routing --- */

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: true
  });

  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('Home', {
      url: '/',
      templateUrl: "views/home.html",
      controller: 'HomeController',
      data: {}
    })
    .state('About', {
      url: '/about',
      templateUrl: "views/about.html",
      controller: 'AboutController',
      data: {}
    })
    .state('Experience', {
      url: '/experience',
      templateUrl: "views/experience.html",
      controller: 'ExperienceController',
      data: {}
    })
    .state('Projects', {
      url: "/projects",
      templateUrl: "views/projects.html",
      controller: 'ProjectsController',
      redirectTo: 'Projects.All',
      data: {}
    })
    .state('Projects.All', {
      parent: 'Projects',
      project: '/all',
      url: "/all?style",
      templateUrl: "views/projects/all.html",
      controller: 'ProjectsAllController',
      data: {}
    })
    .state('Projects.Detail', {
      parent: 'Projects',
      url: "/:projectName",
      templateUrl: "views/projects/details.html",
      controller: 'ProjectsDetailsController',
      data: {}
    });
});
app.controller('AboutController', function ($scope, $json) {

  $json.loadFile('information/general')
    .then(function (data) {
      $scope.generalInfo = data.data;
    }, function (error) {
      console.log(error);
    });

});
app.controller('ExperienceController', function ($scope, $json) {
  $json.loadFile('information/work')
    .then(function (data) {
      $scope.workHistory = data.data;
      $('.collapsible').collapsible();
    }, function (error) {
      console.log(error);
    });
});
app.controller('HomeController', function($scope){
  
});
app.controller('NavController', function ($scope) {

  $(".button-collapse").sideNav({
    closeOnClick: true
  });

});
app.controller('ProjectsAllController', function ($scope, $json, $stateParams, $state) {

  if (!$stateParams.style || $stateParams.style == "") {
    $stateParams.style = 'tiles';

    $state.go('Projects.All', {
      style: $stateParams.style
    }, {
      notify: false,
      location: "replace"
    });

  };
  $scope.gridStyle = $stateParams.style;

  $json.loadFile('projects')
    .then(function (data) {
      $scope.projectList = data.data;
    }, function (error) {
      console.log(error);
    });


  $scope.$watch('gridStyle', function (newVal, oldVal) {
    if (newVal != oldVal) {
      $state.go('Projects.All', {
        style: newVal
      }, {
        notify: false,
        location: "replace"
      });
    }
  });


});
app.controller('ProjectsController', function ($scope, $json) {

});
app.controller('ProjectsDetailsController', function ($scope, $stateParams, $json, $sce) {

  var title = $json.formatTitle($stateParams.projectName);

  $json.loadFile("projects/" + title)
    .then(function successCallback(response) {
      $scope.project = response.data;
    }, function errorCallback(response) {
      $json.errorResponse(response);
    });



});
app.filter('rawHtml', ['$sce', function ($sce) {
  return function (val) {
    return $sce.trustAsHtml(val);
  };
}]);
app.directive('backToTop', function () {
  return {
    restrict: 'E'
    , replace: true
    , scope: {}
    , template: '<div id="goToTop" class="btn btn-floating waves-effect waves-light" ng-click="toTop()"><i class="material-icons">keyboard_arrow_up</i></div>'
    , link: function (scope, element, attrs) {
      $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
          element.addClass('show');
        }
        else {
          element.removeClass('show');
        }
        
        if ($(window).width() <= 750) {
          if ($(this).scrollTop() >= $(window).height() - 1) {
            element.addClass('upfix');
          }
          else {
            element.removeClass('upfix');
          }
        } else {
          element.removeClass('upfix');
        }
      });
      scope.toTop = function () {
        $("html, body").animate({
          scrollTop: 0
        }, 600);
        return false;
      };
    }
  }
});
app.directive('carousel', function ($interval) {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      imageArray: '='
    },
    templateUrl: './views/directives/carousel.html',
    link: function (scope, element, attrs) {

      var self = this;
      
      scope.paused = false;
      
//      scope.fullScreen = false;

      scope.carouselIndex = 0;

      var carouselTime = 4500;

      var init = function () {
        if (self.carousel) {
          $interval.cancel(self.carousel);
        }
        
        self.carousel = $interval(function () {
          if (scope.paused){
            return;
          }
          scope.carouselIndex += 1;
          if (scope.imageArray.length == scope.carouselIndex) {
            scope.carouselIndex = 0;
          }
        }, carouselTime);
      }

      scope.$watch('imageArray', function (newValue) {
        if (newValue) {
          init();
        }
      });


      /**
       * Toggle Playback function, starts/pauses carousel
       * @author Brandon Groff
       */
      scope.togglePlayback = function () {
        scope.paused = !scope.paused;
      }
      
      /**
       * Toggle FullScreen function, expands/shrinks carousel
       * @author Brandon Groff
       */
//      scope.toggleFullscreen = function () {
//        scope.fullScreen = !scope.fullScreen;
//      }

    }
  }
});
function GridStyle() { }

GridStyle.List = 'list';

GridStyle.Tiles = 'grid';

app.directive('grid', function () {
  return {
    restrict: 'E',
    replace: true,
    transclude: false,
    scope: {
      data: '=',
      gridStyle: '='
    },
    templateUrl: './views/directives/grid.html',
    link: function(scope, element, attrs){
      if (!scope.gridStyle){
        scope.gridStyle = GridStyle.Tiles;
      }
      
      scope.setStyle = function(newStyle) {
        scope.gridStyle = newStyle;
      };
      
    }
//    controller: 'NavController'
  }
});
app.directive('gridList', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      project: '='
    },
    templateUrl: './views/directives/grid-list.html',
    link: function(scope, element, attrs){
      
    }
  }
});
app.directive('gridTile', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      project: '='
    },
    templateUrl: './views/directives/grid-tile.html',
    link: function(scope, element, attrs){
      
    }
  }
});
app.directive("mAppLoading", function ($animate, $rootScope) {

  function link(scope, element, attributes) {
    // Due to the way AngularJS prevents animation during the bootstrap
    // of the application, we can't animate the top-level container; but,
    // since we added "ngAnimateChildren", we can animated the inner
    // container during this phase.
    // --
    // NOTE: Am using .eq(1) so that we don't animate the Style block.
    $animate.enabled(true);

    $rootScope.$watch('endAnimation', function (newVal) {
      if (newVal) {
        $animate.leave(element.children().eq(1)).then(
          function cleanupAfterAnimation() {
            // Remove the root directive element.
            element.remove();
            // Clear the closed-over variable references.
            scope = element = attributes = null;
          }
        );
      }
    });

  };


  // Return the directive configuration.
  return ({
    link: link,
    restrict: "C"
  });
  // I bind the JavaScript events to the scope.

});
app.directive('navigation', function () {
  return {
    restrict: 'E',
    transclude: false,
    scope: {
      project: "="
    },
    templateUrl: './views/directives/navigation.html',
    link: function(scope, element, attrs){
      
    },
    controller: 'NavController'
  }
});
app.service("$json", function ($http) {

  var location = "json/";

  var toTitleCase = function (str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  this.formatTitle = function (title) {
    var temp = toTitleCase(title);
    temp = temp.replace(/ /g, "");
    temp = temp.replace("(", "");
    temp = temp.replace(")", "");
    temp = temp.replace(/-/g, "");
    return temp;
  }

  this.loadFile = function (filename) {
    console.log(location + filename + ".json");
    return $http.get(location + filename + ".json");
  }

  this.errorResponse = function (error) {
    alert("An error occured loading the remote data. Please reload the page to try again.");
    console.log(error);
  }
});
app.service("$preload", function ($templateCache, $http) {

  var self = this;

  var views = [
    'about',
    'experience',
    'home',
    'projects',
    'directives/carousel',
    'directives/grid-list',
    'directives/grid-tile',
    'directives/grid',
    'directives/navigation',
    'projects/all',
    'projects/details'
  ];

  var json = [
    'information/general',
//    'information/interests',
//    'information/personalityTraits',
//    'information/skills',
    'information/work',
//    'oldProjects',
    'projects'
  ];

  var projJson = [
    'projects/AsteroidBlaster',
//    'projects/AugmentedRealityScavengerHunt',
//    'projects/Bombnanza',
//    'projects/BuzzedBuddy',
    'projects/CharlieEatsWorms',
//    'projects/CodeOfKnighthodd',
    'projects/Godex',
    'projects/Hackolantern',
    'projects/Inbetween',
//    'projects/Inbetweenios',
//    'projects/Mcverilog',
//    'projects/PlantsInSpace',
    'projects/PlexmediaServer',
    'projects/Pokemondb',
    'projects/SimpleStudentDb',
    'projects/Skbutton',
    'projects/VirtualCommencementAdmin',
    'projects/Wifiusb'
  ]


  /**
   * Load all images from the json
   * @author Brandon Groff
   * @param {Object}  jsonFile the loaded json file
   * @returns {Promise} a promise
   */
  var loadImages = function (jsonFile) {
    var promArray = [];
    for (var i = 0; i < jsonFile.images.length; i++) {
      var url = jsonFile.images[i];
      var prom = $http.get('/assets/projects/' + url);
      promArray.push(prom);
    }
    return Promise.all(promArray);
  };

  /**
   * Load all template html,json, and image files for future use
   * @author Brandon Groff
   * @returns {Promise} A Promise that always resolves successfully
   */
  this.loadAll = function () {
    var masterProm = new Promise(function (resolve, reject) {

      var promArray = [];

      //Views
      for (var i = 0; i < views.length; i++) {
        var thisdir = views[i];
        var prom = $http.get('views/' + thisdir + '.html');
        promArray.push(prom);
      }

      //ProjJSON
      for (var i = 0; i < projJson.length; i++) {
        var thisdir = projJson[i];
        var prom = new Promise(function (resolve, reject) {
          $http.get('json/' + thisdir + '.json')
            .then(function (response) {
              //Images
              var imgProm = loadImages(response.data);
              imgProm.then(function(values) {
                //add this item or it won't get cached
                values.push(response);
                resolve(values);
              }, function(err) {
                reject(err);
              });

            }, function (error) {
              reject(error);
            });
        });
        promArray.push(prom);
      }

      //JSON
      for (var i = 0; i < json.length; i++) {
        var thisdir = json[i];
        var prom = $http.get('json/' + thisdir + '.json');
        promArray.push(prom);
      }

      //FINALLY -> save them ALLLL
      Promise.all(promArray).then(function(values) {
        values.forEach(function (response) {
          if (Array.isArray(response)) {
            response.forEach(function (innerResponse) {
              $templateCache.put(innerResponse.config.url, innerResponse.data);
            });
          } else {
            $templateCache.put(response.config.url, response.data);
          }
        });
        resolve('Success');
      }, function(err) {
        console.log(err);
        resolve(err);
      });

    });
    return masterProm;
  };

});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL0Fib3V0Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL0V4cGVyaWVuY2VDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvSG9tZUNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9OYXZDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvUHJvamVjdHNBbGxDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvUHJvamVjdHNDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvUHJvamVjdHNEZXRhaWxzQ29udHJvbGxlci5qcyIsImZpbHRlcnMvcmF3SHRtbC5qcyIsImRpcmVjdGl2ZXMvYmFja1RvVG9wLmpzIiwiZGlyZWN0aXZlcy9jYXJvdXNlbC5qcyIsImRpcmVjdGl2ZXMvZ3JpZC5qcyIsImRpcmVjdGl2ZXMvZ3JpZExpc3QuanMiLCJkaXJlY3RpdmVzL2dyaWRUaWxlLmpzIiwiZGlyZWN0aXZlcy9tQXBwTG9hZGluZy5qcyIsImRpcmVjdGl2ZXMvbmF2aWdhdGlvbi5qcyIsInNlcnZpY2VzL2pzb24uanMiLCJzZXJ2aWNlcy9wcmVsb2FkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyd1aS5yb3V0ZXInLCAnbmdBbmltYXRlJ10pO1xuXG5zZXRUaW1lb3V0KFxuICBmdW5jdGlvbiBhc3luY0Jvb3RzdHJhcCgpIHtcbiAgICBhbmd1bGFyLmJvb3RzdHJhcChkb2N1bWVudCwgW1wiYXBwXCJdKTtcbiAgfSwgKDEwKVxuKTtcblxuYXBwLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHN0YXRlLCAkdGltZW91dCwgJHByZWxvYWQpIHtcbiAgXG4gICRyb290U2NvcGUuZW5kQW5pbWF0aW9uID0gZmFsc2U7XG5cbiAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICRyb290U2NvcGUuZW5kQW5pbWF0aW9uID0gdHJ1ZTtcbiAgfSwgMzMwMCk7IC8vMy4zc2VjXG5cbiAgJHJvb3RTY29wZS4kc3RhdGUgPSAkc3RhdGU7XG4gICRyb290U2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAkcm9vdFNjb3BlLm1vZGFsRGF0YSA9IHt9O1xuICAkKFwiLmJ1dHRvbi1jb2xsYXBzZVwiKS5zaWRlTmF2KHtcbiAgICBjbG9zZU9uQ2xpY2s6IHRydWVcbiAgfSk7XG5cbi8vICAkcHJlbG9hZC5sb2FkQWxsKCkudGhlbihmdW5jdGlvbiAoc3VjY2Vzcykge1xuLy8gICAgY29uc29sZS5sb2coXCJQcmVsb2FkXCIsIHN1Y2Nlc3MpO1xuLy8gIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuLy8gICAgY29uc29sZS5sb2coXCJQcmVsb2FkXCIsIGVycm9yKTtcbi8vICB9KTtcblxuICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZ0LCB0bywgcGFyYW1zKSB7XG4gICAgaWYgKHRvLnJlZGlyZWN0VG8pIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgJHN0YXRlLmdvKHRvLnJlZGlyZWN0VG8sIHBhcmFtcywge1xuICAgICAgICBsb2NhdGlvbjogJ3JlcGxhY2UnXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufSk7XG5cblxuLyogLS0tIFJvdXRpbmcgLS0tICovXG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG5cbiAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHtcbiAgICBlbmFibGVkOiB0cnVlLFxuICAgIHJlcXVpcmVCYXNlOiB0cnVlXG4gIH0pO1xuXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCIvXCIpO1xuXG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdIb21lJywge1xuICAgICAgdXJsOiAnLycsXG4gICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9ob21lLmh0bWxcIixcbiAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcicsXG4gICAgICBkYXRhOiB7fVxuICAgIH0pXG4gICAgLnN0YXRlKCdBYm91dCcsIHtcbiAgICAgIHVybDogJy9hYm91dCcsXG4gICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hYm91dC5odG1sXCIsXG4gICAgICBjb250cm9sbGVyOiAnQWJvdXRDb250cm9sbGVyJyxcbiAgICAgIGRhdGE6IHt9XG4gICAgfSlcbiAgICAuc3RhdGUoJ0V4cGVyaWVuY2UnLCB7XG4gICAgICB1cmw6ICcvZXhwZXJpZW5jZScsXG4gICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9leHBlcmllbmNlLmh0bWxcIixcbiAgICAgIGNvbnRyb2xsZXI6ICdFeHBlcmllbmNlQ29udHJvbGxlcicsXG4gICAgICBkYXRhOiB7fVxuICAgIH0pXG4gICAgLnN0YXRlKCdQcm9qZWN0cycsIHtcbiAgICAgIHVybDogXCIvcHJvamVjdHNcIixcbiAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3Byb2plY3RzLmh0bWxcIixcbiAgICAgIGNvbnRyb2xsZXI6ICdQcm9qZWN0c0NvbnRyb2xsZXInLFxuICAgICAgcmVkaXJlY3RUbzogJ1Byb2plY3RzLkFsbCcsXG4gICAgICBkYXRhOiB7fVxuICAgIH0pXG4gICAgLnN0YXRlKCdQcm9qZWN0cy5BbGwnLCB7XG4gICAgICBwYXJlbnQ6ICdQcm9qZWN0cycsXG4gICAgICBwcm9qZWN0OiAnL2FsbCcsXG4gICAgICB1cmw6IFwiL2FsbD9zdHlsZVwiLFxuICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvcHJvamVjdHMvYWxsLmh0bWxcIixcbiAgICAgIGNvbnRyb2xsZXI6ICdQcm9qZWN0c0FsbENvbnRyb2xsZXInLFxuICAgICAgZGF0YToge31cbiAgICB9KVxuICAgIC5zdGF0ZSgnUHJvamVjdHMuRGV0YWlsJywge1xuICAgICAgcGFyZW50OiAnUHJvamVjdHMnLFxuICAgICAgdXJsOiBcIi86cHJvamVjdE5hbWVcIixcbiAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3Byb2plY3RzL2RldGFpbHMuaHRtbFwiLFxuICAgICAgY29udHJvbGxlcjogJ1Byb2plY3RzRGV0YWlsc0NvbnRyb2xsZXInLFxuICAgICAgZGF0YToge31cbiAgICB9KTtcbn0pOyIsImFwcC5jb250cm9sbGVyKCdBYm91dENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkanNvbikge1xuXG4gICRqc29uLmxvYWRGaWxlKCdpbmZvcm1hdGlvbi9nZW5lcmFsJylcbiAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgJHNjb3BlLmdlbmVyYWxJbmZvID0gZGF0YS5kYXRhO1xuICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH0pO1xuXG59KTsiLCJhcHAuY29udHJvbGxlcignRXhwZXJpZW5jZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkanNvbikge1xuICAkanNvbi5sb2FkRmlsZSgnaW5mb3JtYXRpb24vd29yaycpXG4gICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICRzY29wZS53b3JrSGlzdG9yeSA9IGRhdGEuZGF0YTtcbiAgICAgICQoJy5jb2xsYXBzaWJsZScpLmNvbGxhcHNpYmxlKCk7XG4gICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSk7XG59KTsiLCJhcHAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUpe1xuICBcbn0pOyIsImFwcC5jb250cm9sbGVyKCdOYXZDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXG4gICQoXCIuYnV0dG9uLWNvbGxhcHNlXCIpLnNpZGVOYXYoe1xuICAgIGNsb3NlT25DbGljazogdHJ1ZVxuICB9KTtcblxufSk7IiwiYXBwLmNvbnRyb2xsZXIoJ1Byb2plY3RzQWxsQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRqc29uLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSkge1xuXG4gIGlmICghJHN0YXRlUGFyYW1zLnN0eWxlIHx8ICRzdGF0ZVBhcmFtcy5zdHlsZSA9PSBcIlwiKSB7XG4gICAgJHN0YXRlUGFyYW1zLnN0eWxlID0gJ3RpbGVzJztcblxuICAgICRzdGF0ZS5nbygnUHJvamVjdHMuQWxsJywge1xuICAgICAgc3R5bGU6ICRzdGF0ZVBhcmFtcy5zdHlsZVxuICAgIH0sIHtcbiAgICAgIG5vdGlmeTogZmFsc2UsXG4gICAgICBsb2NhdGlvbjogXCJyZXBsYWNlXCJcbiAgICB9KTtcblxuICB9O1xuICAkc2NvcGUuZ3JpZFN0eWxlID0gJHN0YXRlUGFyYW1zLnN0eWxlO1xuXG4gICRqc29uLmxvYWRGaWxlKCdwcm9qZWN0cycpXG4gICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICRzY29wZS5wcm9qZWN0TGlzdCA9IGRhdGEuZGF0YTtcbiAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KTtcblxuXG4gICRzY29wZS4kd2F0Y2goJ2dyaWRTdHlsZScsIGZ1bmN0aW9uIChuZXdWYWwsIG9sZFZhbCkge1xuICAgIGlmIChuZXdWYWwgIT0gb2xkVmFsKSB7XG4gICAgICAkc3RhdGUuZ28oJ1Byb2plY3RzLkFsbCcsIHtcbiAgICAgICAgc3R5bGU6IG5ld1ZhbFxuICAgICAgfSwge1xuICAgICAgICBub3RpZnk6IGZhbHNlLFxuICAgICAgICBsb2NhdGlvbjogXCJyZXBsYWNlXCJcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cblxufSk7IiwiYXBwLmNvbnRyb2xsZXIoJ1Byb2plY3RzQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRqc29uKSB7XG5cbn0pOyIsImFwcC5jb250cm9sbGVyKCdQcm9qZWN0c0RldGFpbHNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkanNvbiwgJHNjZSkge1xuXG4gIHZhciB0aXRsZSA9ICRqc29uLmZvcm1hdFRpdGxlKCRzdGF0ZVBhcmFtcy5wcm9qZWN0TmFtZSk7XG5cbiAgJGpzb24ubG9hZEZpbGUoXCJwcm9qZWN0cy9cIiArIHRpdGxlKVxuICAgIC50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3NDYWxsYmFjayhyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLnByb2plY3QgPSByZXNwb25zZS5kYXRhO1xuICAgIH0sIGZ1bmN0aW9uIGVycm9yQ2FsbGJhY2socmVzcG9uc2UpIHtcbiAgICAgICRqc29uLmVycm9yUmVzcG9uc2UocmVzcG9uc2UpO1xuICAgIH0pO1xuXG5cblxufSk7IiwiYXBwLmZpbHRlcigncmF3SHRtbCcsIFsnJHNjZScsIGZ1bmN0aW9uICgkc2NlKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodmFsKSB7XG4gICAgcmV0dXJuICRzY2UudHJ1c3RBc0h0bWwodmFsKTtcbiAgfTtcbn1dKTsiLCJhcHAuZGlyZWN0aXZlKCdiYWNrVG9Ub3AnLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJ1xuICAgICwgcmVwbGFjZTogdHJ1ZVxuICAgICwgc2NvcGU6IHt9XG4gICAgLCB0ZW1wbGF0ZTogJzxkaXYgaWQ9XCJnb1RvVG9wXCIgY2xhc3M9XCJidG4gYnRuLWZsb2F0aW5nIHdhdmVzLWVmZmVjdCB3YXZlcy1saWdodFwiIG5nLWNsaWNrPVwidG9Ub3AoKVwiPjxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5rZXlib2FyZF9hcnJvd191cDwvaT48L2Rpdj4nXG4gICAgLCBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQodGhpcykuc2Nyb2xsVG9wKCkgPiAxMDApIHtcbiAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdzaG93Jyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnc2hvdycpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPD0gNzUwKSB7XG4gICAgICAgICAgaWYgKCQodGhpcykuc2Nyb2xsVG9wKCkgPj0gJCh3aW5kb3cpLmhlaWdodCgpIC0gMSkge1xuICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygndXBmaXgnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCd1cGZpeCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCd1cGZpeCcpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHNjb3BlLnRvVG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkKFwiaHRtbCwgYm9keVwiKS5hbmltYXRlKHtcbiAgICAgICAgICBzY3JvbGxUb3A6IDBcbiAgICAgICAgfSwgNjAwKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfTtcbiAgICB9XG4gIH1cbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2Nhcm91c2VsJywgZnVuY3Rpb24gKCRpbnRlcnZhbCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBzY29wZToge1xuICAgICAgaW1hZ2VBcnJheTogJz0nXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZGlyZWN0aXZlcy9jYXJvdXNlbC5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIFxuICAgICAgc2NvcGUucGF1c2VkID0gZmFsc2U7XG4gICAgICBcbi8vICAgICAgc2NvcGUuZnVsbFNjcmVlbiA9IGZhbHNlO1xuXG4gICAgICBzY29wZS5jYXJvdXNlbEluZGV4ID0gMDtcblxuICAgICAgdmFyIGNhcm91c2VsVGltZSA9IDQ1MDA7XG5cbiAgICAgIHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoc2VsZi5jYXJvdXNlbCkge1xuICAgICAgICAgICRpbnRlcnZhbC5jYW5jZWwoc2VsZi5jYXJvdXNlbCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHNlbGYuY2Fyb3VzZWwgPSAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmIChzY29wZS5wYXVzZWQpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzY29wZS5jYXJvdXNlbEluZGV4ICs9IDE7XG4gICAgICAgICAgaWYgKHNjb3BlLmltYWdlQXJyYXkubGVuZ3RoID09IHNjb3BlLmNhcm91c2VsSW5kZXgpIHtcbiAgICAgICAgICAgIHNjb3BlLmNhcm91c2VsSW5kZXggPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgY2Fyb3VzZWxUaW1lKTtcbiAgICAgIH1cblxuICAgICAgc2NvcGUuJHdhdGNoKCdpbWFnZUFycmF5JywgZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgIGlmIChuZXdWYWx1ZSkge1xuICAgICAgICAgIGluaXQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBUb2dnbGUgUGxheWJhY2sgZnVuY3Rpb24sIHN0YXJ0cy9wYXVzZXMgY2Fyb3VzZWxcbiAgICAgICAqIEBhdXRob3IgQnJhbmRvbiBHcm9mZlxuICAgICAgICovXG4gICAgICBzY29wZS50b2dnbGVQbGF5YmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2NvcGUucGF1c2VkID0gIXNjb3BlLnBhdXNlZDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLyoqXG4gICAgICAgKiBUb2dnbGUgRnVsbFNjcmVlbiBmdW5jdGlvbiwgZXhwYW5kcy9zaHJpbmtzIGNhcm91c2VsXG4gICAgICAgKiBAYXV0aG9yIEJyYW5kb24gR3JvZmZcbiAgICAgICAqL1xuLy8gICAgICBzY29wZS50b2dnbGVGdWxsc2NyZWVuID0gZnVuY3Rpb24gKCkge1xuLy8gICAgICAgIHNjb3BlLmZ1bGxTY3JlZW4gPSAhc2NvcGUuZnVsbFNjcmVlbjtcbi8vICAgICAgfVxuXG4gICAgfVxuICB9XG59KTsiLCJmdW5jdGlvbiBHcmlkU3R5bGUoKSB7IH1cblxuR3JpZFN0eWxlLkxpc3QgPSAnbGlzdCc7XG5cbkdyaWRTdHlsZS5UaWxlcyA9ICdncmlkJztcblxuYXBwLmRpcmVjdGl2ZSgnZ3JpZCcsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdHJhbnNjbHVkZTogZmFsc2UsXG4gICAgc2NvcGU6IHtcbiAgICAgIGRhdGE6ICc9JyxcbiAgICAgIGdyaWRTdHlsZTogJz0nXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZGlyZWN0aXZlcy9ncmlkLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycyl7XG4gICAgICBpZiAoIXNjb3BlLmdyaWRTdHlsZSl7XG4gICAgICAgIHNjb3BlLmdyaWRTdHlsZSA9IEdyaWRTdHlsZS5UaWxlcztcbiAgICAgIH1cbiAgICAgIFxuICAgICAgc2NvcGUuc2V0U3R5bGUgPSBmdW5jdGlvbihuZXdTdHlsZSkge1xuICAgICAgICBzY29wZS5ncmlkU3R5bGUgPSBuZXdTdHlsZTtcbiAgICAgIH07XG4gICAgICBcbiAgICB9XG4vLyAgICBjb250cm9sbGVyOiAnTmF2Q29udHJvbGxlcidcbiAgfVxufSk7IiwiYXBwLmRpcmVjdGl2ZSgnZ3JpZExpc3QnLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHNjb3BlOiB7XG4gICAgICBwcm9qZWN0OiAnPSdcbiAgICB9LFxuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9kaXJlY3RpdmVzL2dyaWQtbGlzdC5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpe1xuICAgICAgXG4gICAgfVxuICB9XG59KTsiLCJhcHAuZGlyZWN0aXZlKCdncmlkVGlsZScsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgc2NvcGU6IHtcbiAgICAgIHByb2plY3Q6ICc9J1xuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2RpcmVjdGl2ZXMvZ3JpZC10aWxlLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycyl7XG4gICAgICBcbiAgICB9XG4gIH1cbn0pOyIsImFwcC5kaXJlY3RpdmUoXCJtQXBwTG9hZGluZ1wiLCBmdW5jdGlvbiAoJGFuaW1hdGUsICRyb290U2NvcGUpIHtcblxuICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzKSB7XG4gICAgLy8gRHVlIHRvIHRoZSB3YXkgQW5ndWxhckpTIHByZXZlbnRzIGFuaW1hdGlvbiBkdXJpbmcgdGhlIGJvb3RzdHJhcFxuICAgIC8vIG9mIHRoZSBhcHBsaWNhdGlvbiwgd2UgY2FuJ3QgYW5pbWF0ZSB0aGUgdG9wLWxldmVsIGNvbnRhaW5lcjsgYnV0LFxuICAgIC8vIHNpbmNlIHdlIGFkZGVkIFwibmdBbmltYXRlQ2hpbGRyZW5cIiwgd2UgY2FuIGFuaW1hdGVkIHRoZSBpbm5lclxuICAgIC8vIGNvbnRhaW5lciBkdXJpbmcgdGhpcyBwaGFzZS5cbiAgICAvLyAtLVxuICAgIC8vIE5PVEU6IEFtIHVzaW5nIC5lcSgxKSBzbyB0aGF0IHdlIGRvbid0IGFuaW1hdGUgdGhlIFN0eWxlIGJsb2NrLlxuICAgICRhbmltYXRlLmVuYWJsZWQodHJ1ZSk7XG5cbiAgICAkcm9vdFNjb3BlLiR3YXRjaCgnZW5kQW5pbWF0aW9uJywgZnVuY3Rpb24gKG5ld1ZhbCkge1xuICAgICAgaWYgKG5ld1ZhbCkge1xuICAgICAgICAkYW5pbWF0ZS5sZWF2ZShlbGVtZW50LmNoaWxkcmVuKCkuZXEoMSkpLnRoZW4oXG4gICAgICAgICAgZnVuY3Rpb24gY2xlYW51cEFmdGVyQW5pbWF0aW9uKCkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSByb290IGRpcmVjdGl2ZSBlbGVtZW50LlxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgIC8vIENsZWFyIHRoZSBjbG9zZWQtb3ZlciB2YXJpYWJsZSByZWZlcmVuY2VzLlxuICAgICAgICAgICAgc2NvcGUgPSBlbGVtZW50ID0gYXR0cmlidXRlcyA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIH07XG5cblxuICAvLyBSZXR1cm4gdGhlIGRpcmVjdGl2ZSBjb25maWd1cmF0aW9uLlxuICByZXR1cm4gKHtcbiAgICBsaW5rOiBsaW5rLFxuICAgIHJlc3RyaWN0OiBcIkNcIlxuICB9KTtcbiAgLy8gSSBiaW5kIHRoZSBKYXZhU2NyaXB0IGV2ZW50cyB0byB0aGUgc2NvcGUuXG5cbn0pOyIsImFwcC5kaXJlY3RpdmUoJ25hdmlnYXRpb24nLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICB0cmFuc2NsdWRlOiBmYWxzZSxcbiAgICBzY29wZToge1xuICAgICAgcHJvamVjdDogXCI9XCJcbiAgICB9LFxuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9kaXJlY3RpdmVzL25hdmlnYXRpb24uaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKXtcbiAgICAgIFxuICAgIH0sXG4gICAgY29udHJvbGxlcjogJ05hdkNvbnRyb2xsZXInXG4gIH1cbn0pOyIsImFwcC5zZXJ2aWNlKFwiJGpzb25cIiwgZnVuY3Rpb24gKCRodHRwKSB7XG5cbiAgdmFyIGxvY2F0aW9uID0gXCJqc29uL1wiO1xuXG4gIHZhciB0b1RpdGxlQ2FzZSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcd1xcUyovZywgZnVuY3Rpb24gKHR4dCkge1xuICAgICAgcmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHRoaXMuZm9ybWF0VGl0bGUgPSBmdW5jdGlvbiAodGl0bGUpIHtcbiAgICB2YXIgdGVtcCA9IHRvVGl0bGVDYXNlKHRpdGxlKTtcbiAgICB0ZW1wID0gdGVtcC5yZXBsYWNlKC8gL2csIFwiXCIpO1xuICAgIHRlbXAgPSB0ZW1wLnJlcGxhY2UoXCIoXCIsIFwiXCIpO1xuICAgIHRlbXAgPSB0ZW1wLnJlcGxhY2UoXCIpXCIsIFwiXCIpO1xuICAgIHRlbXAgPSB0ZW1wLnJlcGxhY2UoLy0vZywgXCJcIik7XG4gICAgcmV0dXJuIHRlbXA7XG4gIH1cblxuICB0aGlzLmxvYWRGaWxlID0gZnVuY3Rpb24gKGZpbGVuYW1lKSB7XG4gICAgY29uc29sZS5sb2cobG9jYXRpb24gKyBmaWxlbmFtZSArIFwiLmpzb25cIik7XG4gICAgcmV0dXJuICRodHRwLmdldChsb2NhdGlvbiArIGZpbGVuYW1lICsgXCIuanNvblwiKTtcbiAgfVxuXG4gIHRoaXMuZXJyb3JSZXNwb25zZSA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgIGFsZXJ0KFwiQW4gZXJyb3Igb2NjdXJlZCBsb2FkaW5nIHRoZSByZW1vdGUgZGF0YS4gUGxlYXNlIHJlbG9hZCB0aGUgcGFnZSB0byB0cnkgYWdhaW4uXCIpO1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgfVxufSk7IiwiYXBwLnNlcnZpY2UoXCIkcHJlbG9hZFwiLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUsICRodHRwKSB7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciB2aWV3cyA9IFtcbiAgICAnYWJvdXQnLFxuICAgICdleHBlcmllbmNlJyxcbiAgICAnaG9tZScsXG4gICAgJ3Byb2plY3RzJyxcbiAgICAnZGlyZWN0aXZlcy9jYXJvdXNlbCcsXG4gICAgJ2RpcmVjdGl2ZXMvZ3JpZC1saXN0JyxcbiAgICAnZGlyZWN0aXZlcy9ncmlkLXRpbGUnLFxuICAgICdkaXJlY3RpdmVzL2dyaWQnLFxuICAgICdkaXJlY3RpdmVzL25hdmlnYXRpb24nLFxuICAgICdwcm9qZWN0cy9hbGwnLFxuICAgICdwcm9qZWN0cy9kZXRhaWxzJ1xuICBdO1xuXG4gIHZhciBqc29uID0gW1xuICAgICdpbmZvcm1hdGlvbi9nZW5lcmFsJyxcbi8vICAgICdpbmZvcm1hdGlvbi9pbnRlcmVzdHMnLFxuLy8gICAgJ2luZm9ybWF0aW9uL3BlcnNvbmFsaXR5VHJhaXRzJyxcbi8vICAgICdpbmZvcm1hdGlvbi9za2lsbHMnLFxuICAgICdpbmZvcm1hdGlvbi93b3JrJyxcbi8vICAgICdvbGRQcm9qZWN0cycsXG4gICAgJ3Byb2plY3RzJ1xuICBdO1xuXG4gIHZhciBwcm9qSnNvbiA9IFtcbiAgICAncHJvamVjdHMvQXN0ZXJvaWRCbGFzdGVyJyxcbi8vICAgICdwcm9qZWN0cy9BdWdtZW50ZWRSZWFsaXR5U2NhdmVuZ2VySHVudCcsXG4vLyAgICAncHJvamVjdHMvQm9tYm5hbnphJyxcbi8vICAgICdwcm9qZWN0cy9CdXp6ZWRCdWRkeScsXG4gICAgJ3Byb2plY3RzL0NoYXJsaWVFYXRzV29ybXMnLFxuLy8gICAgJ3Byb2plY3RzL0NvZGVPZktuaWdodGhvZGQnLFxuICAgICdwcm9qZWN0cy9Hb2RleCcsXG4gICAgJ3Byb2plY3RzL0hhY2tvbGFudGVybicsXG4gICAgJ3Byb2plY3RzL0luYmV0d2VlbicsXG4vLyAgICAncHJvamVjdHMvSW5iZXR3ZWVuaW9zJyxcbi8vICAgICdwcm9qZWN0cy9NY3Zlcmlsb2cnLFxuLy8gICAgJ3Byb2plY3RzL1BsYW50c0luU3BhY2UnLFxuICAgICdwcm9qZWN0cy9QbGV4bWVkaWFTZXJ2ZXInLFxuICAgICdwcm9qZWN0cy9Qb2tlbW9uZGInLFxuICAgICdwcm9qZWN0cy9TaW1wbGVTdHVkZW50RGInLFxuICAgICdwcm9qZWN0cy9Ta2J1dHRvbicsXG4gICAgJ3Byb2plY3RzL1ZpcnR1YWxDb21tZW5jZW1lbnRBZG1pbicsXG4gICAgJ3Byb2plY3RzL1dpZml1c2InXG4gIF1cblxuXG4gIC8qKlxuICAgKiBMb2FkIGFsbCBpbWFnZXMgZnJvbSB0aGUganNvblxuICAgKiBAYXV0aG9yIEJyYW5kb24gR3JvZmZcbiAgICogQHBhcmFtIHtPYmplY3R9ICBqc29uRmlsZSB0aGUgbG9hZGVkIGpzb24gZmlsZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gYSBwcm9taXNlXG4gICAqL1xuICB2YXIgbG9hZEltYWdlcyA9IGZ1bmN0aW9uIChqc29uRmlsZSkge1xuICAgIHZhciBwcm9tQXJyYXkgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGpzb25GaWxlLmltYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHVybCA9IGpzb25GaWxlLmltYWdlc1tpXTtcbiAgICAgIHZhciBwcm9tID0gJGh0dHAuZ2V0KCcvYXNzZXRzL3Byb2plY3RzLycgKyB1cmwpO1xuICAgICAgcHJvbUFycmF5LnB1c2gocHJvbSk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9tQXJyYXkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBMb2FkIGFsbCB0ZW1wbGF0ZSBodG1sLGpzb24sIGFuZCBpbWFnZSBmaWxlcyBmb3IgZnV0dXJlIHVzZVxuICAgKiBAYXV0aG9yIEJyYW5kb24gR3JvZmZcbiAgICogQHJldHVybnMge1Byb21pc2V9IEEgUHJvbWlzZSB0aGF0IGFsd2F5cyByZXNvbHZlcyBzdWNjZXNzZnVsbHlcbiAgICovXG4gIHRoaXMubG9hZEFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWFzdGVyUHJvbSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgdmFyIHByb21BcnJheSA9IFtdO1xuXG4gICAgICAvL1ZpZXdzXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0aGlzZGlyID0gdmlld3NbaV07XG4gICAgICAgIHZhciBwcm9tID0gJGh0dHAuZ2V0KCd2aWV3cy8nICsgdGhpc2RpciArICcuaHRtbCcpO1xuICAgICAgICBwcm9tQXJyYXkucHVzaChwcm9tKTtcbiAgICAgIH1cblxuICAgICAgLy9Qcm9qSlNPTlxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9qSnNvbi5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdGhpc2RpciA9IHByb2pKc29uW2ldO1xuICAgICAgICB2YXIgcHJvbSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAkaHR0cC5nZXQoJ2pzb24vJyArIHRoaXNkaXIgKyAnLmpzb24nKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgIC8vSW1hZ2VzXG4gICAgICAgICAgICAgIHZhciBpbWdQcm9tID0gbG9hZEltYWdlcyhyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgICAgaW1nUHJvbS50aGVuKGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgICAgICAgICAgIC8vYWRkIHRoaXMgaXRlbSBvciBpdCB3b24ndCBnZXQgY2FjaGVkXG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2gocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUodmFsdWVzKTtcbiAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcHJvbUFycmF5LnB1c2gocHJvbSk7XG4gICAgICB9XG5cbiAgICAgIC8vSlNPTlxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBqc29uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0aGlzZGlyID0ganNvbltpXTtcbiAgICAgICAgdmFyIHByb20gPSAkaHR0cC5nZXQoJ2pzb24vJyArIHRoaXNkaXIgKyAnLmpzb24nKTtcbiAgICAgICAgcHJvbUFycmF5LnB1c2gocHJvbSk7XG4gICAgICB9XG5cbiAgICAgIC8vRklOQUxMWSAtPiBzYXZlIHRoZW0gQUxMTExcbiAgICAgIFByb21pc2UuYWxsKHByb21BcnJheSkudGhlbihmdW5jdGlvbih2YWx1ZXMpIHtcbiAgICAgICAgdmFsdWVzLmZvckVhY2goZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzcG9uc2UpKSB7XG4gICAgICAgICAgICByZXNwb25zZS5mb3JFYWNoKGZ1bmN0aW9uIChpbm5lclJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICR0ZW1wbGF0ZUNhY2hlLnB1dChpbm5lclJlc3BvbnNlLmNvbmZpZy51cmwsIGlubmVyUmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJHRlbXBsYXRlQ2FjaGUucHV0KHJlc3BvbnNlLmNvbmZpZy51cmwsIHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJlc29sdmUoJ1N1Y2Nlc3MnKTtcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICByZXNvbHZlKGVycik7XG4gICAgICB9KTtcblxuICAgIH0pO1xuICAgIHJldHVybiBtYXN0ZXJQcm9tO1xuICB9O1xuXG59KTsiXX0=
