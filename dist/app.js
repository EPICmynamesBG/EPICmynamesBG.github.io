var app = angular.module('app', ['ui.router', 'ngAnimate']);

//setTimeout(
//  function asyncBootstrap() {
//    angular.bootstrap(document, ["app"]);
//  }, (3.3 * 1000)
//);

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
    .success(function (data) {
      $scope.generalInfo = data;
    })
    .error(function (error) {
      console.log(error);
    });

});
app.controller('ExperienceController', function ($scope, $json) {
  $json.loadFile('information/work')
    .success(function (data) {
      $scope.workHistory = data;
      $('.collapsible').collapsible();
    })
    .error(function (error) {
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
    .success(function (data) {
      $scope.projectList = data;
    })
    .error(function (error) {
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
      console.log($scope.project);
    }, function errorCallback(response) {
      $json.errorResponse(response);
    });



});
app.directive('backToTop', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    template: '<div id="goToTop" class="btn btn-floating waves-effect waves-light" ng-click="toTop()"><i class="material-icons">keyboard_arrow_up</i></div>',
    link: function (scope, element, attrs) {

      $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
          element.addClass('show');
        } else {
          element.removeClass('show');
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
app.filter('rawHtml', ['$sce', function ($sce) {
  return function (val) {
    return $sce.trustAsHtml(val);
  };
}]);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL0Fib3V0Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL0V4cGVyaWVuY2VDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvSG9tZUNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9OYXZDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvUHJvamVjdHNBbGxDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvUHJvamVjdHNDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvUHJvamVjdHNEZXRhaWxzQ29udHJvbGxlci5qcyIsImRpcmVjdGl2ZXMvYmFja1RvVG9wLmpzIiwiZGlyZWN0aXZlcy9jYXJvdXNlbC5qcyIsImRpcmVjdGl2ZXMvZ3JpZC5qcyIsImRpcmVjdGl2ZXMvZ3JpZExpc3QuanMiLCJkaXJlY3RpdmVzL2dyaWRUaWxlLmpzIiwiZGlyZWN0aXZlcy9tQXBwTG9hZGluZy5qcyIsImRpcmVjdGl2ZXMvbmF2aWdhdGlvbi5qcyIsImZpbHRlcnMvcmF3SHRtbC5qcyIsInNlcnZpY2VzL2pzb24uanMiLCJzZXJ2aWNlcy9wcmVsb2FkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsndWkucm91dGVyJywgJ25nQW5pbWF0ZSddKTtcblxuLy9zZXRUaW1lb3V0KFxuLy8gIGZ1bmN0aW9uIGFzeW5jQm9vdHN0cmFwKCkge1xuLy8gICAgYW5ndWxhci5ib290c3RyYXAoZG9jdW1lbnQsIFtcImFwcFwiXSk7XG4vLyAgfSwgKDMuMyAqIDEwMDApXG4vLyk7XG5cbmFwcC5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsICRzdGF0ZSwgJHRpbWVvdXQsICRwcmVsb2FkKSB7XG4gICRyb290U2NvcGUuZW5kQW5pbWF0aW9uID0gZmFsc2U7XG5cbiAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICRyb290U2NvcGUuZW5kQW5pbWF0aW9uID0gdHJ1ZTtcbiAgfSwgMzMwMCk7IC8vMy4zc2VjXG5cbiAgJHJvb3RTY29wZS4kc3RhdGUgPSAkc3RhdGU7XG4gICRyb290U2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAkcm9vdFNjb3BlLm1vZGFsRGF0YSA9IHt9O1xuICAkKFwiLmJ1dHRvbi1jb2xsYXBzZVwiKS5zaWRlTmF2KHtcbiAgICBjbG9zZU9uQ2xpY2s6IHRydWVcbiAgfSk7XG5cbi8vICAkcHJlbG9hZC5sb2FkQWxsKCkudGhlbihmdW5jdGlvbiAoc3VjY2Vzcykge1xuLy8gICAgY29uc29sZS5sb2coXCJQcmVsb2FkXCIsIHN1Y2Nlc3MpO1xuLy8gIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuLy8gICAgY29uc29sZS5sb2coXCJQcmVsb2FkXCIsIGVycm9yKTtcbi8vICB9KTtcblxuICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZ0LCB0bywgcGFyYW1zKSB7XG4gICAgaWYgKHRvLnJlZGlyZWN0VG8pIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgJHN0YXRlLmdvKHRvLnJlZGlyZWN0VG8sIHBhcmFtcywge1xuICAgICAgICBsb2NhdGlvbjogJ3JlcGxhY2UnXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufSk7XG5cblxuLyogLS0tIFJvdXRpbmcgLS0tICovXG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG5cbiAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHtcbiAgICBlbmFibGVkOiB0cnVlLFxuICAgIHJlcXVpcmVCYXNlOiB0cnVlXG4gIH0pO1xuXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCIvXCIpO1xuXG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdIb21lJywge1xuICAgICAgdXJsOiAnLycsXG4gICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9ob21lLmh0bWxcIixcbiAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcicsXG4gICAgICBkYXRhOiB7fVxuICAgIH0pXG4gICAgLnN0YXRlKCdBYm91dCcsIHtcbiAgICAgIHVybDogJy9hYm91dCcsXG4gICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hYm91dC5odG1sXCIsXG4gICAgICBjb250cm9sbGVyOiAnQWJvdXRDb250cm9sbGVyJyxcbiAgICAgIGRhdGE6IHt9XG4gICAgfSlcbiAgICAuc3RhdGUoJ0V4cGVyaWVuY2UnLCB7XG4gICAgICB1cmw6ICcvZXhwZXJpZW5jZScsXG4gICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9leHBlcmllbmNlLmh0bWxcIixcbiAgICAgIGNvbnRyb2xsZXI6ICdFeHBlcmllbmNlQ29udHJvbGxlcicsXG4gICAgICBkYXRhOiB7fVxuICAgIH0pXG4gICAgLnN0YXRlKCdQcm9qZWN0cycsIHtcbiAgICAgIHVybDogXCIvcHJvamVjdHNcIixcbiAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3Byb2plY3RzLmh0bWxcIixcbiAgICAgIGNvbnRyb2xsZXI6ICdQcm9qZWN0c0NvbnRyb2xsZXInLFxuICAgICAgcmVkaXJlY3RUbzogJ1Byb2plY3RzLkFsbCcsXG4gICAgICBkYXRhOiB7fVxuICAgIH0pXG4gICAgLnN0YXRlKCdQcm9qZWN0cy5BbGwnLCB7XG4gICAgICBwYXJlbnQ6ICdQcm9qZWN0cycsXG4gICAgICBwcm9qZWN0OiAnL2FsbCcsXG4gICAgICB1cmw6IFwiL2FsbD9zdHlsZVwiLFxuICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvcHJvamVjdHMvYWxsLmh0bWxcIixcbiAgICAgIGNvbnRyb2xsZXI6ICdQcm9qZWN0c0FsbENvbnRyb2xsZXInLFxuICAgICAgZGF0YToge31cbiAgICB9KVxuICAgIC5zdGF0ZSgnUHJvamVjdHMuRGV0YWlsJywge1xuICAgICAgcGFyZW50OiAnUHJvamVjdHMnLFxuICAgICAgdXJsOiBcIi86cHJvamVjdE5hbWVcIixcbiAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3Byb2plY3RzL2RldGFpbHMuaHRtbFwiLFxuICAgICAgY29udHJvbGxlcjogJ1Byb2plY3RzRGV0YWlsc0NvbnRyb2xsZXInLFxuICAgICAgZGF0YToge31cbiAgICB9KTtcbn0pOyIsImFwcC5jb250cm9sbGVyKCdBYm91dENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkanNvbikge1xuXG4gICRqc29uLmxvYWRGaWxlKCdpbmZvcm1hdGlvbi9nZW5lcmFsJylcbiAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgJHNjb3BlLmdlbmVyYWxJbmZvID0gZGF0YTtcbiAgICB9KVxuICAgIC5lcnJvcihmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KTtcblxufSk7IiwiYXBwLmNvbnRyb2xsZXIoJ0V4cGVyaWVuY2VDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGpzb24pIHtcbiAgJGpzb24ubG9hZEZpbGUoJ2luZm9ybWF0aW9uL3dvcmsnKVxuICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAkc2NvcGUud29ya0hpc3RvcnkgPSBkYXRhO1xuICAgICAgJCgnLmNvbGxhcHNpYmxlJykuY29sbGFwc2libGUoKTtcbiAgICB9KVxuICAgIC5lcnJvcihmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KTtcbn0pOyIsImFwcC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSl7XG4gIFxufSk7IiwiYXBwLmNvbnRyb2xsZXIoJ05hdkNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cbiAgJChcIi5idXR0b24tY29sbGFwc2VcIikuc2lkZU5hdih7XG4gICAgY2xvc2VPbkNsaWNrOiB0cnVlXG4gIH0pO1xuXG59KTsiLCJhcHAuY29udHJvbGxlcignUHJvamVjdHNBbGxDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGpzb24sICRzdGF0ZVBhcmFtcywgJHN0YXRlKSB7XG5cbiAgaWYgKCEkc3RhdGVQYXJhbXMuc3R5bGUgfHwgJHN0YXRlUGFyYW1zLnN0eWxlID09IFwiXCIpIHtcbiAgICAkc3RhdGVQYXJhbXMuc3R5bGUgPSAndGlsZXMnO1xuXG4gICAgJHN0YXRlLmdvKCdQcm9qZWN0cy5BbGwnLCB7XG4gICAgICBzdHlsZTogJHN0YXRlUGFyYW1zLnN0eWxlXG4gICAgfSwge1xuICAgICAgbm90aWZ5OiBmYWxzZSxcbiAgICAgIGxvY2F0aW9uOiBcInJlcGxhY2VcIlxuICAgIH0pO1xuXG4gIH07XG4gICRzY29wZS5ncmlkU3R5bGUgPSAkc3RhdGVQYXJhbXMuc3R5bGU7XG5cbiAgJGpzb24ubG9hZEZpbGUoJ3Byb2plY3RzJylcbiAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgJHNjb3BlLnByb2plY3RMaXN0ID0gZGF0YTtcbiAgICB9KVxuICAgIC5lcnJvcihmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KTtcblxuXG4gICRzY29wZS4kd2F0Y2goJ2dyaWRTdHlsZScsIGZ1bmN0aW9uIChuZXdWYWwsIG9sZFZhbCkge1xuICAgIGlmIChuZXdWYWwgIT0gb2xkVmFsKSB7XG4gICAgICAkc3RhdGUuZ28oJ1Byb2plY3RzLkFsbCcsIHtcbiAgICAgICAgc3R5bGU6IG5ld1ZhbFxuICAgICAgfSwge1xuICAgICAgICBub3RpZnk6IGZhbHNlLFxuICAgICAgICBsb2NhdGlvbjogXCJyZXBsYWNlXCJcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cblxufSk7IiwiYXBwLmNvbnRyb2xsZXIoJ1Byb2plY3RzQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRqc29uKSB7XG5cbn0pOyIsImFwcC5jb250cm9sbGVyKCdQcm9qZWN0c0RldGFpbHNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkanNvbiwgJHNjZSkge1xuXG4gIHZhciB0aXRsZSA9ICRqc29uLmZvcm1hdFRpdGxlKCRzdGF0ZVBhcmFtcy5wcm9qZWN0TmFtZSk7XG5cbiAgJGpzb24ubG9hZEZpbGUoXCJwcm9qZWN0cy9cIiArIHRpdGxlKVxuICAgIC50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3NDYWxsYmFjayhyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLnByb2plY3QgPSByZXNwb25zZS5kYXRhO1xuICAgICAgY29uc29sZS5sb2coJHNjb3BlLnByb2plY3QpO1xuICAgIH0sIGZ1bmN0aW9uIGVycm9yQ2FsbGJhY2socmVzcG9uc2UpIHtcbiAgICAgICRqc29uLmVycm9yUmVzcG9uc2UocmVzcG9uc2UpO1xuICAgIH0pO1xuXG5cblxufSk7IiwiYXBwLmRpcmVjdGl2ZSgnYmFja1RvVG9wJywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBzY29wZToge30sXG4gICAgdGVtcGxhdGU6ICc8ZGl2IGlkPVwiZ29Ub1RvcFwiIGNsYXNzPVwiYnRuIGJ0bi1mbG9hdGluZyB3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHRcIiBuZy1jbGljaz1cInRvVG9wKClcIj48aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+a2V5Ym9hcmRfYXJyb3dfdXA8L2k+PC9kaXY+JyxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJCh0aGlzKS5zY3JvbGxUb3AoKSA+IDEwMCkge1xuICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ3Nob3cnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCdzaG93Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBzY29wZS50b1RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJChcImh0bWwsIGJvZHlcIikuYW5pbWF0ZSh7XG4gICAgICAgICAgc2Nyb2xsVG9wOiAwXG4gICAgICAgIH0sIDYwMCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH07XG5cbiAgICB9XG4gIH1cbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2Nhcm91c2VsJywgZnVuY3Rpb24gKCRpbnRlcnZhbCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBzY29wZToge1xuICAgICAgaW1hZ2VBcnJheTogJz0nXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZGlyZWN0aXZlcy9jYXJvdXNlbC5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIFxuICAgICAgc2NvcGUucGF1c2VkID0gZmFsc2U7XG4gICAgICBcbi8vICAgICAgc2NvcGUuZnVsbFNjcmVlbiA9IGZhbHNlO1xuXG4gICAgICBzY29wZS5jYXJvdXNlbEluZGV4ID0gMDtcblxuICAgICAgdmFyIGNhcm91c2VsVGltZSA9IDQ1MDA7XG5cbiAgICAgIHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoc2VsZi5jYXJvdXNlbCkge1xuICAgICAgICAgICRpbnRlcnZhbC5jYW5jZWwoc2VsZi5jYXJvdXNlbCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHNlbGYuY2Fyb3VzZWwgPSAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmIChzY29wZS5wYXVzZWQpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzY29wZS5jYXJvdXNlbEluZGV4ICs9IDE7XG4gICAgICAgICAgaWYgKHNjb3BlLmltYWdlQXJyYXkubGVuZ3RoID09IHNjb3BlLmNhcm91c2VsSW5kZXgpIHtcbiAgICAgICAgICAgIHNjb3BlLmNhcm91c2VsSW5kZXggPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgY2Fyb3VzZWxUaW1lKTtcbiAgICAgIH1cblxuICAgICAgc2NvcGUuJHdhdGNoKCdpbWFnZUFycmF5JywgZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgIGlmIChuZXdWYWx1ZSkge1xuICAgICAgICAgIGluaXQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBUb2dnbGUgUGxheWJhY2sgZnVuY3Rpb24sIHN0YXJ0cy9wYXVzZXMgY2Fyb3VzZWxcbiAgICAgICAqIEBhdXRob3IgQnJhbmRvbiBHcm9mZlxuICAgICAgICovXG4gICAgICBzY29wZS50b2dnbGVQbGF5YmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2NvcGUucGF1c2VkID0gIXNjb3BlLnBhdXNlZDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLyoqXG4gICAgICAgKiBUb2dnbGUgRnVsbFNjcmVlbiBmdW5jdGlvbiwgZXhwYW5kcy9zaHJpbmtzIGNhcm91c2VsXG4gICAgICAgKiBAYXV0aG9yIEJyYW5kb24gR3JvZmZcbiAgICAgICAqL1xuLy8gICAgICBzY29wZS50b2dnbGVGdWxsc2NyZWVuID0gZnVuY3Rpb24gKCkge1xuLy8gICAgICAgIHNjb3BlLmZ1bGxTY3JlZW4gPSAhc2NvcGUuZnVsbFNjcmVlbjtcbi8vICAgICAgfVxuXG4gICAgfVxuICB9XG59KTsiLCJmdW5jdGlvbiBHcmlkU3R5bGUoKSB7IH1cblxuR3JpZFN0eWxlLkxpc3QgPSAnbGlzdCc7XG5cbkdyaWRTdHlsZS5UaWxlcyA9ICdncmlkJztcblxuYXBwLmRpcmVjdGl2ZSgnZ3JpZCcsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdHJhbnNjbHVkZTogZmFsc2UsXG4gICAgc2NvcGU6IHtcbiAgICAgIGRhdGE6ICc9JyxcbiAgICAgIGdyaWRTdHlsZTogJz0nXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZGlyZWN0aXZlcy9ncmlkLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycyl7XG4gICAgICBpZiAoIXNjb3BlLmdyaWRTdHlsZSl7XG4gICAgICAgIHNjb3BlLmdyaWRTdHlsZSA9IEdyaWRTdHlsZS5UaWxlcztcbiAgICAgIH1cbiAgICAgIFxuICAgICAgc2NvcGUuc2V0U3R5bGUgPSBmdW5jdGlvbihuZXdTdHlsZSkge1xuICAgICAgICBzY29wZS5ncmlkU3R5bGUgPSBuZXdTdHlsZTtcbiAgICAgIH07XG4gICAgICBcbiAgICB9XG4vLyAgICBjb250cm9sbGVyOiAnTmF2Q29udHJvbGxlcidcbiAgfVxufSk7IiwiYXBwLmRpcmVjdGl2ZSgnZ3JpZExpc3QnLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHNjb3BlOiB7XG4gICAgICBwcm9qZWN0OiAnPSdcbiAgICB9LFxuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9kaXJlY3RpdmVzL2dyaWQtbGlzdC5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpe1xuICAgICAgXG4gICAgfVxuICB9XG59KTsiLCJhcHAuZGlyZWN0aXZlKCdncmlkVGlsZScsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgc2NvcGU6IHtcbiAgICAgIHByb2plY3Q6ICc9J1xuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2RpcmVjdGl2ZXMvZ3JpZC10aWxlLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycyl7XG4gICAgICBcbiAgICB9XG4gIH1cbn0pOyIsImFwcC5kaXJlY3RpdmUoXCJtQXBwTG9hZGluZ1wiLCBmdW5jdGlvbiAoJGFuaW1hdGUsICRyb290U2NvcGUpIHtcblxuICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzKSB7XG4gICAgLy8gRHVlIHRvIHRoZSB3YXkgQW5ndWxhckpTIHByZXZlbnRzIGFuaW1hdGlvbiBkdXJpbmcgdGhlIGJvb3RzdHJhcFxuICAgIC8vIG9mIHRoZSBhcHBsaWNhdGlvbiwgd2UgY2FuJ3QgYW5pbWF0ZSB0aGUgdG9wLWxldmVsIGNvbnRhaW5lcjsgYnV0LFxuICAgIC8vIHNpbmNlIHdlIGFkZGVkIFwibmdBbmltYXRlQ2hpbGRyZW5cIiwgd2UgY2FuIGFuaW1hdGVkIHRoZSBpbm5lclxuICAgIC8vIGNvbnRhaW5lciBkdXJpbmcgdGhpcyBwaGFzZS5cbiAgICAvLyAtLVxuICAgIC8vIE5PVEU6IEFtIHVzaW5nIC5lcSgxKSBzbyB0aGF0IHdlIGRvbid0IGFuaW1hdGUgdGhlIFN0eWxlIGJsb2NrLlxuICAgICRhbmltYXRlLmVuYWJsZWQodHJ1ZSk7XG5cbiAgICAkcm9vdFNjb3BlLiR3YXRjaCgnZW5kQW5pbWF0aW9uJywgZnVuY3Rpb24gKG5ld1ZhbCkge1xuICAgICAgaWYgKG5ld1ZhbCkge1xuICAgICAgICAkYW5pbWF0ZS5sZWF2ZShlbGVtZW50LmNoaWxkcmVuKCkuZXEoMSkpLnRoZW4oXG4gICAgICAgICAgZnVuY3Rpb24gY2xlYW51cEFmdGVyQW5pbWF0aW9uKCkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSByb290IGRpcmVjdGl2ZSBlbGVtZW50LlxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgIC8vIENsZWFyIHRoZSBjbG9zZWQtb3ZlciB2YXJpYWJsZSByZWZlcmVuY2VzLlxuICAgICAgICAgICAgc2NvcGUgPSBlbGVtZW50ID0gYXR0cmlidXRlcyA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIH07XG5cblxuICAvLyBSZXR1cm4gdGhlIGRpcmVjdGl2ZSBjb25maWd1cmF0aW9uLlxuICByZXR1cm4gKHtcbiAgICBsaW5rOiBsaW5rLFxuICAgIHJlc3RyaWN0OiBcIkNcIlxuICB9KTtcbiAgLy8gSSBiaW5kIHRoZSBKYXZhU2NyaXB0IGV2ZW50cyB0byB0aGUgc2NvcGUuXG5cbn0pOyIsImFwcC5kaXJlY3RpdmUoJ25hdmlnYXRpb24nLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICB0cmFuc2NsdWRlOiBmYWxzZSxcbiAgICBzY29wZToge1xuICAgICAgcHJvamVjdDogXCI9XCJcbiAgICB9LFxuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9kaXJlY3RpdmVzL25hdmlnYXRpb24uaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKXtcbiAgICAgIFxuICAgIH0sXG4gICAgY29udHJvbGxlcjogJ05hdkNvbnRyb2xsZXInXG4gIH1cbn0pOyIsImFwcC5maWx0ZXIoJ3Jhd0h0bWwnLCBbJyRzY2UnLCBmdW5jdGlvbiAoJHNjZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKHZhbCkge1xuICAgIHJldHVybiAkc2NlLnRydXN0QXNIdG1sKHZhbCk7XG4gIH07XG59XSk7IiwiYXBwLnNlcnZpY2UoXCIkanNvblwiLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuICB2YXIgbG9jYXRpb24gPSBcImpzb24vXCI7XG5cbiAgdmFyIHRvVGl0bGVDYXNlID0gZnVuY3Rpb24gKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFx3XFxTKi9nLCBmdW5jdGlvbiAodHh0KSB7XG4gICAgICByZXR1cm4gdHh0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdHh0LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgdGhpcy5mb3JtYXRUaXRsZSA9IGZ1bmN0aW9uICh0aXRsZSkge1xuICAgIHZhciB0ZW1wID0gdG9UaXRsZUNhc2UodGl0bGUpO1xuICAgIHRlbXAgPSB0ZW1wLnJlcGxhY2UoLyAvZywgXCJcIik7XG4gICAgdGVtcCA9IHRlbXAucmVwbGFjZShcIihcIiwgXCJcIik7XG4gICAgdGVtcCA9IHRlbXAucmVwbGFjZShcIilcIiwgXCJcIik7XG4gICAgdGVtcCA9IHRlbXAucmVwbGFjZSgvLS9nLCBcIlwiKTtcbiAgICByZXR1cm4gdGVtcDtcbiAgfVxuXG4gIHRoaXMubG9hZEZpbGUgPSBmdW5jdGlvbiAoZmlsZW5hbWUpIHtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KGxvY2F0aW9uICsgZmlsZW5hbWUgKyBcIi5qc29uXCIpO1xuICB9XG5cbiAgdGhpcy5lcnJvclJlc3BvbnNlID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgYWxlcnQoXCJBbiBlcnJvciBvY2N1cmVkIGxvYWRpbmcgdGhlIHJlbW90ZSBkYXRhLiBQbGVhc2UgcmVsb2FkIHRoZSBwYWdlIHRvIHRyeSBhZ2Fpbi5cIik7XG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xuICB9XG59KTsiLCJhcHAuc2VydmljZShcIiRwcmVsb2FkXCIsIGZ1bmN0aW9uICgkdGVtcGxhdGVDYWNoZSwgJGh0dHApIHtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIHZpZXdzID0gW1xuICAgICdhYm91dCcsXG4gICAgJ2V4cGVyaWVuY2UnLFxuICAgICdob21lJyxcbiAgICAncHJvamVjdHMnLFxuICAgICdkaXJlY3RpdmVzL2Nhcm91c2VsJyxcbiAgICAnZGlyZWN0aXZlcy9ncmlkLWxpc3QnLFxuICAgICdkaXJlY3RpdmVzL2dyaWQtdGlsZScsXG4gICAgJ2RpcmVjdGl2ZXMvZ3JpZCcsXG4gICAgJ2RpcmVjdGl2ZXMvbmF2aWdhdGlvbicsXG4gICAgJ3Byb2plY3RzL2FsbCcsXG4gICAgJ3Byb2plY3RzL2RldGFpbHMnXG4gIF07XG5cbiAgdmFyIGpzb24gPSBbXG4gICAgJ2luZm9ybWF0aW9uL2dlbmVyYWwnLFxuLy8gICAgJ2luZm9ybWF0aW9uL2ludGVyZXN0cycsXG4vLyAgICAnaW5mb3JtYXRpb24vcGVyc29uYWxpdHlUcmFpdHMnLFxuLy8gICAgJ2luZm9ybWF0aW9uL3NraWxscycsXG4gICAgJ2luZm9ybWF0aW9uL3dvcmsnLFxuLy8gICAgJ29sZFByb2plY3RzJyxcbiAgICAncHJvamVjdHMnXG4gIF07XG5cbiAgdmFyIHByb2pKc29uID0gW1xuICAgICdwcm9qZWN0cy9Bc3Rlcm9pZEJsYXN0ZXInLFxuLy8gICAgJ3Byb2plY3RzL0F1Z21lbnRlZFJlYWxpdHlTY2F2ZW5nZXJIdW50Jyxcbi8vICAgICdwcm9qZWN0cy9Cb21ibmFuemEnLFxuLy8gICAgJ3Byb2plY3RzL0J1enplZEJ1ZGR5JyxcbiAgICAncHJvamVjdHMvQ2hhcmxpZUVhdHNXb3JtcycsXG4vLyAgICAncHJvamVjdHMvQ29kZU9mS25pZ2h0aG9kZCcsXG4gICAgJ3Byb2plY3RzL0dvZGV4JyxcbiAgICAncHJvamVjdHMvSGFja29sYW50ZXJuJyxcbiAgICAncHJvamVjdHMvSW5iZXR3ZWVuJyxcbi8vICAgICdwcm9qZWN0cy9JbmJldHdlZW5pb3MnLFxuLy8gICAgJ3Byb2plY3RzL01jdmVyaWxvZycsXG4vLyAgICAncHJvamVjdHMvUGxhbnRzSW5TcGFjZScsXG4gICAgJ3Byb2plY3RzL1BsZXhtZWRpYVNlcnZlcicsXG4gICAgJ3Byb2plY3RzL1Bva2Vtb25kYicsXG4gICAgJ3Byb2plY3RzL1NpbXBsZVN0dWRlbnREYicsXG4gICAgJ3Byb2plY3RzL1NrYnV0dG9uJyxcbiAgICAncHJvamVjdHMvVmlydHVhbENvbW1lbmNlbWVudEFkbWluJyxcbiAgICAncHJvamVjdHMvV2lmaXVzYidcbiAgXVxuXG5cbiAgLyoqXG4gICAqIExvYWQgYWxsIGltYWdlcyBmcm9tIHRoZSBqc29uXG4gICAqIEBhdXRob3IgQnJhbmRvbiBHcm9mZlxuICAgKiBAcGFyYW0ge09iamVjdH0gIGpzb25GaWxlIHRoZSBsb2FkZWQganNvbiBmaWxlXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBhIHByb21pc2VcbiAgICovXG4gIHZhciBsb2FkSW1hZ2VzID0gZnVuY3Rpb24gKGpzb25GaWxlKSB7XG4gICAgdmFyIHByb21BcnJheSA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwganNvbkZpbGUuaW1hZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdXJsID0ganNvbkZpbGUuaW1hZ2VzW2ldO1xuICAgICAgdmFyIHByb20gPSAkaHR0cC5nZXQoJy9hc3NldHMvcHJvamVjdHMvJyArIHVybCk7XG4gICAgICBwcm9tQXJyYXkucHVzaChwcm9tKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21BcnJheSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIExvYWQgYWxsIHRlbXBsYXRlIGh0bWwsanNvbiwgYW5kIGltYWdlIGZpbGVzIGZvciBmdXR1cmUgdXNlXG4gICAqIEBhdXRob3IgQnJhbmRvbiBHcm9mZlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBQcm9taXNlIHRoYXQgYWx3YXlzIHJlc29sdmVzIHN1Y2Nlc3NmdWxseVxuICAgKi9cbiAgdGhpcy5sb2FkQWxsID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtYXN0ZXJQcm9tID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXG4gICAgICB2YXIgcHJvbUFycmF5ID0gW107XG5cbiAgICAgIC8vVmlld3NcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlld3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHRoaXNkaXIgPSB2aWV3c1tpXTtcbiAgICAgICAgdmFyIHByb20gPSAkaHR0cC5nZXQoJ3ZpZXdzLycgKyB0aGlzZGlyICsgJy5odG1sJyk7XG4gICAgICAgIHByb21BcnJheS5wdXNoKHByb20pO1xuICAgICAgfVxuXG4gICAgICAvL1Byb2pKU09OXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb2pKc29uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0aGlzZGlyID0gcHJvakpzb25baV07XG4gICAgICAgIHZhciBwcm9tID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICRodHRwLmdldCgnanNvbi8nICsgdGhpc2RpciArICcuanNvbicpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgLy9JbWFnZXNcbiAgICAgICAgICAgICAgdmFyIGltZ1Byb20gPSBsb2FkSW1hZ2VzKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgICBpbWdQcm9tLnRoZW4oZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgLy9hZGQgdGhpcyBpdGVtIG9yIGl0IHdvbid0IGdldCBjYWNoZWRcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaChyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwcm9tQXJyYXkucHVzaChwcm9tKTtcbiAgICAgIH1cblxuICAgICAgLy9KU09OXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGpzb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHRoaXNkaXIgPSBqc29uW2ldO1xuICAgICAgICB2YXIgcHJvbSA9ICRodHRwLmdldCgnanNvbi8nICsgdGhpc2RpciArICcuanNvbicpO1xuICAgICAgICBwcm9tQXJyYXkucHVzaChwcm9tKTtcbiAgICAgIH1cblxuICAgICAgLy9GSU5BTExZIC0+IHNhdmUgdGhlbSBBTExMTFxuICAgICAgUHJvbWlzZS5hbGwocHJvbUFycmF5KS50aGVuKGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgICB2YWx1ZXMuZm9yRWFjaChmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXNwb25zZSkpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlLmZvckVhY2goZnVuY3Rpb24gKGlubmVyUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgJHRlbXBsYXRlQ2FjaGUucHV0KGlubmVyUmVzcG9uc2UuY29uZmlnLnVybCwgaW5uZXJSZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkdGVtcGxhdGVDYWNoZS5wdXQocmVzcG9uc2UuY29uZmlnLnVybCwgcmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmVzb2x2ZSgnU3VjY2VzcycpO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgIHJlc29sdmUoZXJyKTtcbiAgICAgIH0pO1xuXG4gICAgfSk7XG4gICAgcmV0dXJuIG1hc3RlclByb207XG4gIH07XG5cbn0pOyJdfQ==
