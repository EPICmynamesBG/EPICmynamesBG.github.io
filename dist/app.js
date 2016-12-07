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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL0Fib3V0Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL0V4cGVyaWVuY2VDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvSG9tZUNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9OYXZDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvUHJvamVjdHNBbGxDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvUHJvamVjdHNDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvUHJvamVjdHNEZXRhaWxzQ29udHJvbGxlci5qcyIsImRpcmVjdGl2ZXMvYmFja1RvVG9wLmpzIiwiZGlyZWN0aXZlcy9jYXJvdXNlbC5qcyIsImRpcmVjdGl2ZXMvZ3JpZC5qcyIsImRpcmVjdGl2ZXMvZ3JpZExpc3QuanMiLCJkaXJlY3RpdmVzL2dyaWRUaWxlLmpzIiwiZGlyZWN0aXZlcy9tQXBwTG9hZGluZy5qcyIsImRpcmVjdGl2ZXMvbmF2aWdhdGlvbi5qcyIsImZpbHRlcnMvcmF3SHRtbC5qcyIsInNlcnZpY2VzL2pzb24uanMiLCJzZXJ2aWNlcy9wcmVsb2FkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ3VpLnJvdXRlcicsICduZ0FuaW1hdGUnXSk7XG5cbi8vc2V0VGltZW91dChcbi8vICBmdW5jdGlvbiBhc3luY0Jvb3RzdHJhcCgpIHtcbi8vICAgIGFuZ3VsYXIuYm9vdHN0cmFwKGRvY3VtZW50LCBbXCJhcHBcIl0pO1xuLy8gIH0sICgzLjMgKiAxMDAwKVxuLy8pO1xuXG5hcHAucnVuKGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc3RhdGUsICR0aW1lb3V0LCAkcHJlbG9hZCkge1xuICAkcm9vdFNjb3BlLmVuZEFuaW1hdGlvbiA9IGZhbHNlO1xuXG4gICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAkcm9vdFNjb3BlLmVuZEFuaW1hdGlvbiA9IHRydWU7XG4gIH0sIDMzMDApOyAvLzMuM3NlY1xuXG4gICRyb290U2NvcGUuJHN0YXRlID0gJHN0YXRlO1xuICAkcm9vdFNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgJHJvb3RTY29wZS5tb2RhbERhdGEgPSB7fTtcbiAgJChcIi5idXR0b24tY29sbGFwc2VcIikuc2lkZU5hdih7XG4gICAgY2xvc2VPbkNsaWNrOiB0cnVlXG4gIH0pO1xuXG4vLyAgJHByZWxvYWQubG9hZEFsbCgpLnRoZW4oZnVuY3Rpb24gKHN1Y2Nlc3MpIHtcbi8vICAgIGNvbnNvbGUubG9nKFwiUHJlbG9hZFwiLCBzdWNjZXNzKTtcbi8vICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbi8vICAgIGNvbnNvbGUubG9nKFwiUHJlbG9hZFwiLCBlcnJvcik7XG4vLyAgfSk7XG5cbiAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2dCwgdG8sIHBhcmFtcykge1xuICAgIGlmICh0by5yZWRpcmVjdFRvKSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICRzdGF0ZS5nbyh0by5yZWRpcmVjdFRvLCBwYXJhbXMsIHtcbiAgICAgICAgbG9jYXRpb246ICdyZXBsYWNlJ1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5cbi8qIC0tLSBSb3V0aW5nIC0tLSAqL1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuXG4gICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh7XG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICByZXF1aXJlQmFzZTogdHJ1ZVxuICB9KTtcblxuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKFwiL1wiKTtcblxuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnSG9tZScsIHtcbiAgICAgIHVybDogJy8nLFxuICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvaG9tZS5odG1sXCIsXG4gICAgICBjb250cm9sbGVyOiAnSG9tZUNvbnRyb2xsZXInLFxuICAgICAgZGF0YToge31cbiAgICB9KVxuICAgIC5zdGF0ZSgnQWJvdXQnLCB7XG4gICAgICB1cmw6ICcvYWJvdXQnLFxuICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWJvdXQuaHRtbFwiLFxuICAgICAgY29udHJvbGxlcjogJ0Fib3V0Q29udHJvbGxlcicsXG4gICAgICBkYXRhOiB7fVxuICAgIH0pXG4gICAgLnN0YXRlKCdFeHBlcmllbmNlJywge1xuICAgICAgdXJsOiAnL2V4cGVyaWVuY2UnLFxuICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvZXhwZXJpZW5jZS5odG1sXCIsXG4gICAgICBjb250cm9sbGVyOiAnRXhwZXJpZW5jZUNvbnRyb2xsZXInLFxuICAgICAgZGF0YToge31cbiAgICB9KVxuICAgIC5zdGF0ZSgnUHJvamVjdHMnLCB7XG4gICAgICB1cmw6IFwiL3Byb2plY3RzXCIsXG4gICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9wcm9qZWN0cy5odG1sXCIsXG4gICAgICBjb250cm9sbGVyOiAnUHJvamVjdHNDb250cm9sbGVyJyxcbiAgICAgIHJlZGlyZWN0VG86ICdQcm9qZWN0cy5BbGwnLFxuICAgICAgZGF0YToge31cbiAgICB9KVxuICAgIC5zdGF0ZSgnUHJvamVjdHMuQWxsJywge1xuICAgICAgcGFyZW50OiAnUHJvamVjdHMnLFxuICAgICAgcHJvamVjdDogJy9hbGwnLFxuICAgICAgdXJsOiBcIi9hbGw/c3R5bGVcIixcbiAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3Byb2plY3RzL2FsbC5odG1sXCIsXG4gICAgICBjb250cm9sbGVyOiAnUHJvamVjdHNBbGxDb250cm9sbGVyJyxcbiAgICAgIGRhdGE6IHt9XG4gICAgfSlcbiAgICAuc3RhdGUoJ1Byb2plY3RzLkRldGFpbCcsIHtcbiAgICAgIHBhcmVudDogJ1Byb2plY3RzJyxcbiAgICAgIHVybDogXCIvOnByb2plY3ROYW1lXCIsXG4gICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9wcm9qZWN0cy9kZXRhaWxzLmh0bWxcIixcbiAgICAgIGNvbnRyb2xsZXI6ICdQcm9qZWN0c0RldGFpbHNDb250cm9sbGVyJyxcbiAgICAgIGRhdGE6IHt9XG4gICAgfSk7XG59KTsiLCJhcHAuY29udHJvbGxlcignQWJvdXRDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGpzb24pIHtcblxuICAkanNvbi5sb2FkRmlsZSgnaW5mb3JtYXRpb24vZ2VuZXJhbCcpXG4gICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICRzY29wZS5nZW5lcmFsSW5mbyA9IGRhdGE7XG4gICAgfSlcbiAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSk7XG5cbn0pOyIsImFwcC5jb250cm9sbGVyKCdFeHBlcmllbmNlQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRqc29uKSB7XG4gICRqc29uLmxvYWRGaWxlKCdpbmZvcm1hdGlvbi93b3JrJylcbiAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgJHNjb3BlLndvcmtIaXN0b3J5ID0gZGF0YTtcbiAgICAgICQoJy5jb2xsYXBzaWJsZScpLmNvbGxhcHNpYmxlKCk7XG4gICAgfSlcbiAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSk7XG59KTsiLCJhcHAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUpe1xuICBcbn0pOyIsImFwcC5jb250cm9sbGVyKCdOYXZDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXG4gICQoXCIuYnV0dG9uLWNvbGxhcHNlXCIpLnNpZGVOYXYoe1xuICAgIGNsb3NlT25DbGljazogdHJ1ZVxuICB9KTtcblxufSk7IiwiYXBwLmNvbnRyb2xsZXIoJ1Byb2plY3RzQWxsQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRqc29uLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSkge1xuXG4gIGlmICghJHN0YXRlUGFyYW1zLnN0eWxlIHx8ICRzdGF0ZVBhcmFtcy5zdHlsZSA9PSBcIlwiKSB7XG4gICAgJHN0YXRlUGFyYW1zLnN0eWxlID0gJ3RpbGVzJztcblxuICAgICRzdGF0ZS5nbygnUHJvamVjdHMuQWxsJywge1xuICAgICAgc3R5bGU6ICRzdGF0ZVBhcmFtcy5zdHlsZVxuICAgIH0sIHtcbiAgICAgIG5vdGlmeTogZmFsc2UsXG4gICAgICBsb2NhdGlvbjogXCJyZXBsYWNlXCJcbiAgICB9KTtcblxuICB9O1xuICAkc2NvcGUuZ3JpZFN0eWxlID0gJHN0YXRlUGFyYW1zLnN0eWxlO1xuXG4gICRqc29uLmxvYWRGaWxlKCdwcm9qZWN0cycpXG4gICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICRzY29wZS5wcm9qZWN0TGlzdCA9IGRhdGE7XG4gICAgfSlcbiAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSk7XG5cblxuICAkc2NvcGUuJHdhdGNoKCdncmlkU3R5bGUnLCBmdW5jdGlvbiAobmV3VmFsLCBvbGRWYWwpIHtcbiAgICBpZiAobmV3VmFsICE9IG9sZFZhbCkge1xuICAgICAgJHN0YXRlLmdvKCdQcm9qZWN0cy5BbGwnLCB7XG4gICAgICAgIHN0eWxlOiBuZXdWYWxcbiAgICAgIH0sIHtcbiAgICAgICAgbm90aWZ5OiBmYWxzZSxcbiAgICAgICAgbG9jYXRpb246IFwicmVwbGFjZVwiXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG5cbn0pOyIsImFwcC5jb250cm9sbGVyKCdQcm9qZWN0c0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkanNvbikge1xuXG59KTsiLCJhcHAuY29udHJvbGxlcignUHJvamVjdHNEZXRhaWxzQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZVBhcmFtcywgJGpzb24sICRzY2UpIHtcblxuICB2YXIgdGl0bGUgPSAkanNvbi5mb3JtYXRUaXRsZSgkc3RhdGVQYXJhbXMucHJvamVjdE5hbWUpO1xuXG4gICRqc29uLmxvYWRGaWxlKFwicHJvamVjdHMvXCIgKyB0aXRsZSlcbiAgICAudGhlbihmdW5jdGlvbiBzdWNjZXNzQ2FsbGJhY2socmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5wcm9qZWN0ID0gcmVzcG9uc2UuZGF0YTtcbiAgICB9LCBmdW5jdGlvbiBlcnJvckNhbGxiYWNrKHJlc3BvbnNlKSB7XG4gICAgICAkanNvbi5lcnJvclJlc3BvbnNlKHJlc3BvbnNlKTtcbiAgICB9KTtcblxuXG5cbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2JhY2tUb1RvcCcsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgc2NvcGU6IHt9LFxuICAgIHRlbXBsYXRlOiAnPGRpdiBpZD1cImdvVG9Ub3BcIiBjbGFzcz1cImJ0biBidG4tZmxvYXRpbmcgd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0XCIgbmctY2xpY2s9XCJ0b1RvcCgpXCI+PGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPmtleWJvYXJkX2Fycm93X3VwPC9pPjwvZGl2PicsXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXG4gICAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQodGhpcykuc2Nyb2xsVG9wKCkgPiAxMDApIHtcbiAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdzaG93Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnc2hvdycpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgc2NvcGUudG9Ub3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoXCJodG1sLCBib2R5XCIpLmFuaW1hdGUoe1xuICAgICAgICAgIHNjcm9sbFRvcDogMFxuICAgICAgICB9LCA2MDApO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9O1xuXG4gICAgfVxuICB9XG59KTsiLCJhcHAuZGlyZWN0aXZlKCdjYXJvdXNlbCcsIGZ1bmN0aW9uICgkaW50ZXJ2YWwpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgc2NvcGU6IHtcbiAgICAgIGltYWdlQXJyYXk6ICc9J1xuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2RpcmVjdGl2ZXMvY2Fyb3VzZWwuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBcbiAgICAgIHNjb3BlLnBhdXNlZCA9IGZhbHNlO1xuICAgICAgXG4vLyAgICAgIHNjb3BlLmZ1bGxTY3JlZW4gPSBmYWxzZTtcblxuICAgICAgc2NvcGUuY2Fyb3VzZWxJbmRleCA9IDA7XG5cbiAgICAgIHZhciBjYXJvdXNlbFRpbWUgPSA0NTAwO1xuXG4gICAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHNlbGYuY2Fyb3VzZWwpIHtcbiAgICAgICAgICAkaW50ZXJ2YWwuY2FuY2VsKHNlbGYuY2Fyb3VzZWwpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBzZWxmLmNhcm91c2VsID0gJGludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoc2NvcGUucGF1c2VkKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2NvcGUuY2Fyb3VzZWxJbmRleCArPSAxO1xuICAgICAgICAgIGlmIChzY29wZS5pbWFnZUFycmF5Lmxlbmd0aCA9PSBzY29wZS5jYXJvdXNlbEluZGV4KSB7XG4gICAgICAgICAgICBzY29wZS5jYXJvdXNlbEluZGV4ID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGNhcm91c2VsVGltZSk7XG4gICAgICB9XG5cbiAgICAgIHNjb3BlLiR3YXRjaCgnaW1hZ2VBcnJheScsIGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICBpZiAobmV3VmFsdWUpIHtcbiAgICAgICAgICBpbml0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG5cbiAgICAgIC8qKlxuICAgICAgICogVG9nZ2xlIFBsYXliYWNrIGZ1bmN0aW9uLCBzdGFydHMvcGF1c2VzIGNhcm91c2VsXG4gICAgICAgKiBAYXV0aG9yIEJyYW5kb24gR3JvZmZcbiAgICAgICAqL1xuICAgICAgc2NvcGUudG9nZ2xlUGxheWJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNjb3BlLnBhdXNlZCA9ICFzY29wZS5wYXVzZWQ7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8qKlxuICAgICAgICogVG9nZ2xlIEZ1bGxTY3JlZW4gZnVuY3Rpb24sIGV4cGFuZHMvc2hyaW5rcyBjYXJvdXNlbFxuICAgICAgICogQGF1dGhvciBCcmFuZG9uIEdyb2ZmXG4gICAgICAgKi9cbi8vICAgICAgc2NvcGUudG9nZ2xlRnVsbHNjcmVlbiA9IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICBzY29wZS5mdWxsU2NyZWVuID0gIXNjb3BlLmZ1bGxTY3JlZW47XG4vLyAgICAgIH1cblxuICAgIH1cbiAgfVxufSk7IiwiZnVuY3Rpb24gR3JpZFN0eWxlKCkgeyB9XG5cbkdyaWRTdHlsZS5MaXN0ID0gJ2xpc3QnO1xuXG5HcmlkU3R5bGUuVGlsZXMgPSAnZ3JpZCc7XG5cbmFwcC5kaXJlY3RpdmUoJ2dyaWQnLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRyYW5zY2x1ZGU6IGZhbHNlLFxuICAgIHNjb3BlOiB7XG4gICAgICBkYXRhOiAnPScsXG4gICAgICBncmlkU3R5bGU6ICc9J1xuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2RpcmVjdGl2ZXMvZ3JpZC5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpe1xuICAgICAgaWYgKCFzY29wZS5ncmlkU3R5bGUpe1xuICAgICAgICBzY29wZS5ncmlkU3R5bGUgPSBHcmlkU3R5bGUuVGlsZXM7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHNjb3BlLnNldFN0eWxlID0gZnVuY3Rpb24obmV3U3R5bGUpIHtcbiAgICAgICAgc2NvcGUuZ3JpZFN0eWxlID0gbmV3U3R5bGU7XG4gICAgICB9O1xuICAgICAgXG4gICAgfVxuLy8gICAgY29udHJvbGxlcjogJ05hdkNvbnRyb2xsZXInXG4gIH1cbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2dyaWRMaXN0JywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBzY29wZToge1xuICAgICAgcHJvamVjdDogJz0nXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZGlyZWN0aXZlcy9ncmlkLWxpc3QuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKXtcbiAgICAgIFxuICAgIH1cbiAgfVxufSk7IiwiYXBwLmRpcmVjdGl2ZSgnZ3JpZFRpbGUnLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHNjb3BlOiB7XG4gICAgICBwcm9qZWN0OiAnPSdcbiAgICB9LFxuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9kaXJlY3RpdmVzL2dyaWQtdGlsZS5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpe1xuICAgICAgXG4gICAgfVxuICB9XG59KTsiLCJhcHAuZGlyZWN0aXZlKFwibUFwcExvYWRpbmdcIiwgZnVuY3Rpb24gKCRhbmltYXRlLCAkcm9vdFNjb3BlKSB7XG5cbiAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcykge1xuICAgIC8vIER1ZSB0byB0aGUgd2F5IEFuZ3VsYXJKUyBwcmV2ZW50cyBhbmltYXRpb24gZHVyaW5nIHRoZSBib290c3RyYXBcbiAgICAvLyBvZiB0aGUgYXBwbGljYXRpb24sIHdlIGNhbid0IGFuaW1hdGUgdGhlIHRvcC1sZXZlbCBjb250YWluZXI7IGJ1dCxcbiAgICAvLyBzaW5jZSB3ZSBhZGRlZCBcIm5nQW5pbWF0ZUNoaWxkcmVuXCIsIHdlIGNhbiBhbmltYXRlZCB0aGUgaW5uZXJcbiAgICAvLyBjb250YWluZXIgZHVyaW5nIHRoaXMgcGhhc2UuXG4gICAgLy8gLS1cbiAgICAvLyBOT1RFOiBBbSB1c2luZyAuZXEoMSkgc28gdGhhdCB3ZSBkb24ndCBhbmltYXRlIHRoZSBTdHlsZSBibG9jay5cbiAgICAkYW5pbWF0ZS5lbmFibGVkKHRydWUpO1xuXG4gICAgJHJvb3RTY29wZS4kd2F0Y2goJ2VuZEFuaW1hdGlvbicsIGZ1bmN0aW9uIChuZXdWYWwpIHtcbiAgICAgIGlmIChuZXdWYWwpIHtcbiAgICAgICAgJGFuaW1hdGUubGVhdmUoZWxlbWVudC5jaGlsZHJlbigpLmVxKDEpKS50aGVuKFxuICAgICAgICAgIGZ1bmN0aW9uIGNsZWFudXBBZnRlckFuaW1hdGlvbigpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgcm9vdCBkaXJlY3RpdmUgZWxlbWVudC5cbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgICAgICAvLyBDbGVhciB0aGUgY2xvc2VkLW92ZXIgdmFyaWFibGUgcmVmZXJlbmNlcy5cbiAgICAgICAgICAgIHNjb3BlID0gZWxlbWVudCA9IGF0dHJpYnV0ZXMgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB9O1xuXG5cbiAgLy8gUmV0dXJuIHRoZSBkaXJlY3RpdmUgY29uZmlndXJhdGlvbi5cbiAgcmV0dXJuICh7XG4gICAgbGluazogbGluayxcbiAgICByZXN0cmljdDogXCJDXCJcbiAgfSk7XG4gIC8vIEkgYmluZCB0aGUgSmF2YVNjcmlwdCBldmVudHMgdG8gdGhlIHNjb3BlLlxuXG59KTsiLCJhcHAuZGlyZWN0aXZlKCduYXZpZ2F0aW9uJywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdHJhbnNjbHVkZTogZmFsc2UsXG4gICAgc2NvcGU6IHtcbiAgICAgIHByb2plY3Q6IFwiPVwiXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZGlyZWN0aXZlcy9uYXZpZ2F0aW9uLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycyl7XG4gICAgICBcbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6ICdOYXZDb250cm9sbGVyJ1xuICB9XG59KTsiLCJhcHAuZmlsdGVyKCdyYXdIdG1sJywgWyckc2NlJywgZnVuY3Rpb24gKCRzY2UpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh2YWwpIHtcbiAgICByZXR1cm4gJHNjZS50cnVzdEFzSHRtbCh2YWwpO1xuICB9O1xufV0pOyIsImFwcC5zZXJ2aWNlKFwiJGpzb25cIiwgZnVuY3Rpb24gKCRodHRwKSB7XG5cbiAgdmFyIGxvY2F0aW9uID0gXCJqc29uL1wiO1xuXG4gIHZhciB0b1RpdGxlQ2FzZSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcd1xcUyovZywgZnVuY3Rpb24gKHR4dCkge1xuICAgICAgcmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHRoaXMuZm9ybWF0VGl0bGUgPSBmdW5jdGlvbiAodGl0bGUpIHtcbiAgICB2YXIgdGVtcCA9IHRvVGl0bGVDYXNlKHRpdGxlKTtcbiAgICB0ZW1wID0gdGVtcC5yZXBsYWNlKC8gL2csIFwiXCIpO1xuICAgIHRlbXAgPSB0ZW1wLnJlcGxhY2UoXCIoXCIsIFwiXCIpO1xuICAgIHRlbXAgPSB0ZW1wLnJlcGxhY2UoXCIpXCIsIFwiXCIpO1xuICAgIHRlbXAgPSB0ZW1wLnJlcGxhY2UoLy0vZywgXCJcIik7XG4gICAgcmV0dXJuIHRlbXA7XG4gIH1cblxuICB0aGlzLmxvYWRGaWxlID0gZnVuY3Rpb24gKGZpbGVuYW1lKSB7XG4gICAgcmV0dXJuICRodHRwLmdldChsb2NhdGlvbiArIGZpbGVuYW1lICsgXCIuanNvblwiKTtcbiAgfVxuXG4gIHRoaXMuZXJyb3JSZXNwb25zZSA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgIGFsZXJ0KFwiQW4gZXJyb3Igb2NjdXJlZCBsb2FkaW5nIHRoZSByZW1vdGUgZGF0YS4gUGxlYXNlIHJlbG9hZCB0aGUgcGFnZSB0byB0cnkgYWdhaW4uXCIpO1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgfVxufSk7IiwiYXBwLnNlcnZpY2UoXCIkcHJlbG9hZFwiLCBmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUsICRodHRwKSB7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciB2aWV3cyA9IFtcbiAgICAnYWJvdXQnLFxuICAgICdleHBlcmllbmNlJyxcbiAgICAnaG9tZScsXG4gICAgJ3Byb2plY3RzJyxcbiAgICAnZGlyZWN0aXZlcy9jYXJvdXNlbCcsXG4gICAgJ2RpcmVjdGl2ZXMvZ3JpZC1saXN0JyxcbiAgICAnZGlyZWN0aXZlcy9ncmlkLXRpbGUnLFxuICAgICdkaXJlY3RpdmVzL2dyaWQnLFxuICAgICdkaXJlY3RpdmVzL25hdmlnYXRpb24nLFxuICAgICdwcm9qZWN0cy9hbGwnLFxuICAgICdwcm9qZWN0cy9kZXRhaWxzJ1xuICBdO1xuXG4gIHZhciBqc29uID0gW1xuICAgICdpbmZvcm1hdGlvbi9nZW5lcmFsJyxcbi8vICAgICdpbmZvcm1hdGlvbi9pbnRlcmVzdHMnLFxuLy8gICAgJ2luZm9ybWF0aW9uL3BlcnNvbmFsaXR5VHJhaXRzJyxcbi8vICAgICdpbmZvcm1hdGlvbi9za2lsbHMnLFxuICAgICdpbmZvcm1hdGlvbi93b3JrJyxcbi8vICAgICdvbGRQcm9qZWN0cycsXG4gICAgJ3Byb2plY3RzJ1xuICBdO1xuXG4gIHZhciBwcm9qSnNvbiA9IFtcbiAgICAncHJvamVjdHMvQXN0ZXJvaWRCbGFzdGVyJyxcbi8vICAgICdwcm9qZWN0cy9BdWdtZW50ZWRSZWFsaXR5U2NhdmVuZ2VySHVudCcsXG4vLyAgICAncHJvamVjdHMvQm9tYm5hbnphJyxcbi8vICAgICdwcm9qZWN0cy9CdXp6ZWRCdWRkeScsXG4gICAgJ3Byb2plY3RzL0NoYXJsaWVFYXRzV29ybXMnLFxuLy8gICAgJ3Byb2plY3RzL0NvZGVPZktuaWdodGhvZGQnLFxuICAgICdwcm9qZWN0cy9Hb2RleCcsXG4gICAgJ3Byb2plY3RzL0hhY2tvbGFudGVybicsXG4gICAgJ3Byb2plY3RzL0luYmV0d2VlbicsXG4vLyAgICAncHJvamVjdHMvSW5iZXR3ZWVuaW9zJyxcbi8vICAgICdwcm9qZWN0cy9NY3Zlcmlsb2cnLFxuLy8gICAgJ3Byb2plY3RzL1BsYW50c0luU3BhY2UnLFxuICAgICdwcm9qZWN0cy9QbGV4bWVkaWFTZXJ2ZXInLFxuICAgICdwcm9qZWN0cy9Qb2tlbW9uZGInLFxuICAgICdwcm9qZWN0cy9TaW1wbGVTdHVkZW50RGInLFxuICAgICdwcm9qZWN0cy9Ta2J1dHRvbicsXG4gICAgJ3Byb2plY3RzL1ZpcnR1YWxDb21tZW5jZW1lbnRBZG1pbicsXG4gICAgJ3Byb2plY3RzL1dpZml1c2InXG4gIF1cblxuXG4gIC8qKlxuICAgKiBMb2FkIGFsbCBpbWFnZXMgZnJvbSB0aGUganNvblxuICAgKiBAYXV0aG9yIEJyYW5kb24gR3JvZmZcbiAgICogQHBhcmFtIHtPYmplY3R9ICBqc29uRmlsZSB0aGUgbG9hZGVkIGpzb24gZmlsZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gYSBwcm9taXNlXG4gICAqL1xuICB2YXIgbG9hZEltYWdlcyA9IGZ1bmN0aW9uIChqc29uRmlsZSkge1xuICAgIHZhciBwcm9tQXJyYXkgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGpzb25GaWxlLmltYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHVybCA9IGpzb25GaWxlLmltYWdlc1tpXTtcbiAgICAgIHZhciBwcm9tID0gJGh0dHAuZ2V0KCcvYXNzZXRzL3Byb2plY3RzLycgKyB1cmwpO1xuICAgICAgcHJvbUFycmF5LnB1c2gocHJvbSk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9tQXJyYXkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBMb2FkIGFsbCB0ZW1wbGF0ZSBodG1sLGpzb24sIGFuZCBpbWFnZSBmaWxlcyBmb3IgZnV0dXJlIHVzZVxuICAgKiBAYXV0aG9yIEJyYW5kb24gR3JvZmZcbiAgICogQHJldHVybnMge1Byb21pc2V9IEEgUHJvbWlzZSB0aGF0IGFsd2F5cyByZXNvbHZlcyBzdWNjZXNzZnVsbHlcbiAgICovXG4gIHRoaXMubG9hZEFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWFzdGVyUHJvbSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgdmFyIHByb21BcnJheSA9IFtdO1xuXG4gICAgICAvL1ZpZXdzXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0aGlzZGlyID0gdmlld3NbaV07XG4gICAgICAgIHZhciBwcm9tID0gJGh0dHAuZ2V0KCd2aWV3cy8nICsgdGhpc2RpciArICcuaHRtbCcpO1xuICAgICAgICBwcm9tQXJyYXkucHVzaChwcm9tKTtcbiAgICAgIH1cblxuICAgICAgLy9Qcm9qSlNPTlxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9qSnNvbi5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdGhpc2RpciA9IHByb2pKc29uW2ldO1xuICAgICAgICB2YXIgcHJvbSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAkaHR0cC5nZXQoJ2pzb24vJyArIHRoaXNkaXIgKyAnLmpzb24nKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgIC8vSW1hZ2VzXG4gICAgICAgICAgICAgIHZhciBpbWdQcm9tID0gbG9hZEltYWdlcyhyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgICAgaW1nUHJvbS50aGVuKGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgICAgICAgICAgIC8vYWRkIHRoaXMgaXRlbSBvciBpdCB3b24ndCBnZXQgY2FjaGVkXG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2gocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUodmFsdWVzKTtcbiAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcHJvbUFycmF5LnB1c2gocHJvbSk7XG4gICAgICB9XG5cbiAgICAgIC8vSlNPTlxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBqc29uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0aGlzZGlyID0ganNvbltpXTtcbiAgICAgICAgdmFyIHByb20gPSAkaHR0cC5nZXQoJ2pzb24vJyArIHRoaXNkaXIgKyAnLmpzb24nKTtcbiAgICAgICAgcHJvbUFycmF5LnB1c2gocHJvbSk7XG4gICAgICB9XG5cbiAgICAgIC8vRklOQUxMWSAtPiBzYXZlIHRoZW0gQUxMTExcbiAgICAgIFByb21pc2UuYWxsKHByb21BcnJheSkudGhlbihmdW5jdGlvbih2YWx1ZXMpIHtcbiAgICAgICAgdmFsdWVzLmZvckVhY2goZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzcG9uc2UpKSB7XG4gICAgICAgICAgICByZXNwb25zZS5mb3JFYWNoKGZ1bmN0aW9uIChpbm5lclJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICR0ZW1wbGF0ZUNhY2hlLnB1dChpbm5lclJlc3BvbnNlLmNvbmZpZy51cmwsIGlubmVyUmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJHRlbXBsYXRlQ2FjaGUucHV0KHJlc3BvbnNlLmNvbmZpZy51cmwsIHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJlc29sdmUoJ1N1Y2Nlc3MnKTtcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICByZXNvbHZlKGVycik7XG4gICAgICB9KTtcblxuICAgIH0pO1xuICAgIHJldHVybiBtYXN0ZXJQcm9tO1xuICB9O1xuXG59KTsiXX0=
