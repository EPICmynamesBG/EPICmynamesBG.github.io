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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL0Fib3V0Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL0V4cGVyaWVuY2VDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvSG9tZUNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9OYXZDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvUHJvamVjdHNBbGxDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvUHJvamVjdHNDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvUHJvamVjdHNEZXRhaWxzQ29udHJvbGxlci5qcyIsImZpbHRlcnMvcmF3SHRtbC5qcyIsImRpcmVjdGl2ZXMvYmFja1RvVG9wLmpzIiwiZGlyZWN0aXZlcy9jYXJvdXNlbC5qcyIsImRpcmVjdGl2ZXMvZ3JpZC5qcyIsImRpcmVjdGl2ZXMvZ3JpZExpc3QuanMiLCJkaXJlY3RpdmVzL2dyaWRUaWxlLmpzIiwiZGlyZWN0aXZlcy9tQXBwTG9hZGluZy5qcyIsImRpcmVjdGl2ZXMvbmF2aWdhdGlvbi5qcyIsInNlcnZpY2VzL2pzb24uanMiLCJzZXJ2aWNlcy9wcmVsb2FkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsndWkucm91dGVyJywgJ25nQW5pbWF0ZSddKTtcblxuc2V0VGltZW91dChcbiAgZnVuY3Rpb24gYXN5bmNCb290c3RyYXAoKSB7XG4gICAgYW5ndWxhci5ib290c3RyYXAoZG9jdW1lbnQsIFtcImFwcFwiXSk7XG4gIH0sICgxMClcbik7XG5cbmFwcC5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsICRzdGF0ZSwgJHRpbWVvdXQsICRwcmVsb2FkKSB7XG4gIFxuICAkcm9vdFNjb3BlLmVuZEFuaW1hdGlvbiA9IGZhbHNlO1xuXG4gICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAkcm9vdFNjb3BlLmVuZEFuaW1hdGlvbiA9IHRydWU7XG4gIH0sIDMzMDApOyAvLzMuM3NlY1xuXG4gICRyb290U2NvcGUuJHN0YXRlID0gJHN0YXRlO1xuICAkcm9vdFNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgJHJvb3RTY29wZS5tb2RhbERhdGEgPSB7fTtcbiAgJChcIi5idXR0b24tY29sbGFwc2VcIikuc2lkZU5hdih7XG4gICAgY2xvc2VPbkNsaWNrOiB0cnVlXG4gIH0pO1xuXG4vLyAgJHByZWxvYWQubG9hZEFsbCgpLnRoZW4oZnVuY3Rpb24gKHN1Y2Nlc3MpIHtcbi8vICAgIGNvbnNvbGUubG9nKFwiUHJlbG9hZFwiLCBzdWNjZXNzKTtcbi8vICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbi8vICAgIGNvbnNvbGUubG9nKFwiUHJlbG9hZFwiLCBlcnJvcik7XG4vLyAgfSk7XG5cbiAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2dCwgdG8sIHBhcmFtcykge1xuICAgIGlmICh0by5yZWRpcmVjdFRvKSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICRzdGF0ZS5nbyh0by5yZWRpcmVjdFRvLCBwYXJhbXMsIHtcbiAgICAgICAgbG9jYXRpb246ICdyZXBsYWNlJ1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5cbi8qIC0tLSBSb3V0aW5nIC0tLSAqL1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuXG4gICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh7XG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICByZXF1aXJlQmFzZTogdHJ1ZVxuICB9KTtcblxuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKFwiL1wiKTtcblxuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnSG9tZScsIHtcbiAgICAgIHVybDogJy8nLFxuICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvaG9tZS5odG1sXCIsXG4gICAgICBjb250cm9sbGVyOiAnSG9tZUNvbnRyb2xsZXInLFxuICAgICAgZGF0YToge31cbiAgICB9KVxuICAgIC5zdGF0ZSgnQWJvdXQnLCB7XG4gICAgICB1cmw6ICcvYWJvdXQnLFxuICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWJvdXQuaHRtbFwiLFxuICAgICAgY29udHJvbGxlcjogJ0Fib3V0Q29udHJvbGxlcicsXG4gICAgICBkYXRhOiB7fVxuICAgIH0pXG4gICAgLnN0YXRlKCdFeHBlcmllbmNlJywge1xuICAgICAgdXJsOiAnL2V4cGVyaWVuY2UnLFxuICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvZXhwZXJpZW5jZS5odG1sXCIsXG4gICAgICBjb250cm9sbGVyOiAnRXhwZXJpZW5jZUNvbnRyb2xsZXInLFxuICAgICAgZGF0YToge31cbiAgICB9KVxuICAgIC5zdGF0ZSgnUHJvamVjdHMnLCB7XG4gICAgICB1cmw6IFwiL3Byb2plY3RzXCIsXG4gICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9wcm9qZWN0cy5odG1sXCIsXG4gICAgICBjb250cm9sbGVyOiAnUHJvamVjdHNDb250cm9sbGVyJyxcbiAgICAgIHJlZGlyZWN0VG86ICdQcm9qZWN0cy5BbGwnLFxuICAgICAgZGF0YToge31cbiAgICB9KVxuICAgIC5zdGF0ZSgnUHJvamVjdHMuQWxsJywge1xuICAgICAgcGFyZW50OiAnUHJvamVjdHMnLFxuICAgICAgcHJvamVjdDogJy9hbGwnLFxuICAgICAgdXJsOiBcIi9hbGw/c3R5bGVcIixcbiAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3Byb2plY3RzL2FsbC5odG1sXCIsXG4gICAgICBjb250cm9sbGVyOiAnUHJvamVjdHNBbGxDb250cm9sbGVyJyxcbiAgICAgIGRhdGE6IHt9XG4gICAgfSlcbiAgICAuc3RhdGUoJ1Byb2plY3RzLkRldGFpbCcsIHtcbiAgICAgIHBhcmVudDogJ1Byb2plY3RzJyxcbiAgICAgIHVybDogXCIvOnByb2plY3ROYW1lXCIsXG4gICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9wcm9qZWN0cy9kZXRhaWxzLmh0bWxcIixcbiAgICAgIGNvbnRyb2xsZXI6ICdQcm9qZWN0c0RldGFpbHNDb250cm9sbGVyJyxcbiAgICAgIGRhdGE6IHt9XG4gICAgfSk7XG59KTsiLCJhcHAuY29udHJvbGxlcignQWJvdXRDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGpzb24pIHtcblxuICAkanNvbi5sb2FkRmlsZSgnaW5mb3JtYXRpb24vZ2VuZXJhbCcpXG4gICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICRzY29wZS5nZW5lcmFsSW5mbyA9IGRhdGEuZGF0YTtcbiAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KTtcblxufSk7IiwiYXBwLmNvbnRyb2xsZXIoJ0V4cGVyaWVuY2VDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGpzb24pIHtcbiAgJGpzb24ubG9hZEZpbGUoJ2luZm9ybWF0aW9uL3dvcmsnKVxuICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAkc2NvcGUud29ya0hpc3RvcnkgPSBkYXRhLmRhdGE7XG4gICAgICAkKCcuY29sbGFwc2libGUnKS5jb2xsYXBzaWJsZSgpO1xuICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH0pO1xufSk7IiwiYXBwLmNvbnRyb2xsZXIoJ0hvbWVDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlKXtcbiAgXG59KTsiLCJhcHAuY29udHJvbGxlcignTmF2Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblxuICAkKFwiLmJ1dHRvbi1jb2xsYXBzZVwiKS5zaWRlTmF2KHtcbiAgICBjbG9zZU9uQ2xpY2s6IHRydWVcbiAgfSk7XG5cbn0pOyIsImFwcC5jb250cm9sbGVyKCdQcm9qZWN0c0FsbENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkanNvbiwgJHN0YXRlUGFyYW1zLCAkc3RhdGUpIHtcblxuICBpZiAoISRzdGF0ZVBhcmFtcy5zdHlsZSB8fCAkc3RhdGVQYXJhbXMuc3R5bGUgPT0gXCJcIikge1xuICAgICRzdGF0ZVBhcmFtcy5zdHlsZSA9ICd0aWxlcyc7XG5cbiAgICAkc3RhdGUuZ28oJ1Byb2plY3RzLkFsbCcsIHtcbiAgICAgIHN0eWxlOiAkc3RhdGVQYXJhbXMuc3R5bGVcbiAgICB9LCB7XG4gICAgICBub3RpZnk6IGZhbHNlLFxuICAgICAgbG9jYXRpb246IFwicmVwbGFjZVwiXG4gICAgfSk7XG5cbiAgfTtcbiAgJHNjb3BlLmdyaWRTdHlsZSA9ICRzdGF0ZVBhcmFtcy5zdHlsZTtcblxuICAkanNvbi5sb2FkRmlsZSgncHJvamVjdHMnKVxuICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAkc2NvcGUucHJvamVjdExpc3QgPSBkYXRhLmRhdGE7XG4gICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSk7XG5cblxuICAkc2NvcGUuJHdhdGNoKCdncmlkU3R5bGUnLCBmdW5jdGlvbiAobmV3VmFsLCBvbGRWYWwpIHtcbiAgICBpZiAobmV3VmFsICE9IG9sZFZhbCkge1xuICAgICAgJHN0YXRlLmdvKCdQcm9qZWN0cy5BbGwnLCB7XG4gICAgICAgIHN0eWxlOiBuZXdWYWxcbiAgICAgIH0sIHtcbiAgICAgICAgbm90aWZ5OiBmYWxzZSxcbiAgICAgICAgbG9jYXRpb246IFwicmVwbGFjZVwiXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG5cbn0pOyIsImFwcC5jb250cm9sbGVyKCdQcm9qZWN0c0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkanNvbikge1xuXG59KTsiLCJhcHAuY29udHJvbGxlcignUHJvamVjdHNEZXRhaWxzQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZVBhcmFtcywgJGpzb24sICRzY2UpIHtcblxuICB2YXIgdGl0bGUgPSAkanNvbi5mb3JtYXRUaXRsZSgkc3RhdGVQYXJhbXMucHJvamVjdE5hbWUpO1xuXG4gICRqc29uLmxvYWRGaWxlKFwicHJvamVjdHMvXCIgKyB0aXRsZSlcbiAgICAudGhlbihmdW5jdGlvbiBzdWNjZXNzQ2FsbGJhY2socmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5wcm9qZWN0ID0gcmVzcG9uc2UuZGF0YTtcbiAgICB9LCBmdW5jdGlvbiBlcnJvckNhbGxiYWNrKHJlc3BvbnNlKSB7XG4gICAgICAkanNvbi5lcnJvclJlc3BvbnNlKHJlc3BvbnNlKTtcbiAgICB9KTtcblxuXG5cbn0pOyIsImFwcC5maWx0ZXIoJ3Jhd0h0bWwnLCBbJyRzY2UnLCBmdW5jdGlvbiAoJHNjZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKHZhbCkge1xuICAgIHJldHVybiAkc2NlLnRydXN0QXNIdG1sKHZhbCk7XG4gIH07XG59XSk7IiwiYXBwLmRpcmVjdGl2ZSgnYmFja1RvVG9wJywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRSdcbiAgICAsIHJlcGxhY2U6IHRydWVcbiAgICAsIHNjb3BlOiB7fVxuICAgICwgdGVtcGxhdGU6ICc8ZGl2IGlkPVwiZ29Ub1RvcFwiIGNsYXNzPVwiYnRuIGJ0bi1mbG9hdGluZyB3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHRcIiBuZy1jbGljaz1cInRvVG9wKClcIj48aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+a2V5Ym9hcmRfYXJyb3dfdXA8L2k+PC9kaXY+J1xuICAgICwgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKHRoaXMpLnNjcm9sbFRvcCgpID4gMTAwKSB7XG4gICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnc2hvdycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpIDw9IDc1MCkge1xuICAgICAgICAgIGlmICgkKHRoaXMpLnNjcm9sbFRvcCgpID49ICQod2luZG93KS5oZWlnaHQoKSAtIDEpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ3VwZml4Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygndXBmaXgnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygndXBmaXgnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBzY29wZS50b1RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJChcImh0bWwsIGJvZHlcIikuYW5pbWF0ZSh7XG4gICAgICAgICAgc2Nyb2xsVG9wOiAwXG4gICAgICAgIH0sIDYwMCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH07XG4gICAgfVxuICB9XG59KTsiLCJhcHAuZGlyZWN0aXZlKCdjYXJvdXNlbCcsIGZ1bmN0aW9uICgkaW50ZXJ2YWwpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgc2NvcGU6IHtcbiAgICAgIGltYWdlQXJyYXk6ICc9J1xuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2RpcmVjdGl2ZXMvY2Fyb3VzZWwuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBcbiAgICAgIHNjb3BlLnBhdXNlZCA9IGZhbHNlO1xuICAgICAgXG4vLyAgICAgIHNjb3BlLmZ1bGxTY3JlZW4gPSBmYWxzZTtcblxuICAgICAgc2NvcGUuY2Fyb3VzZWxJbmRleCA9IDA7XG5cbiAgICAgIHZhciBjYXJvdXNlbFRpbWUgPSA0NTAwO1xuXG4gICAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHNlbGYuY2Fyb3VzZWwpIHtcbiAgICAgICAgICAkaW50ZXJ2YWwuY2FuY2VsKHNlbGYuY2Fyb3VzZWwpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBzZWxmLmNhcm91c2VsID0gJGludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoc2NvcGUucGF1c2VkKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2NvcGUuY2Fyb3VzZWxJbmRleCArPSAxO1xuICAgICAgICAgIGlmIChzY29wZS5pbWFnZUFycmF5Lmxlbmd0aCA9PSBzY29wZS5jYXJvdXNlbEluZGV4KSB7XG4gICAgICAgICAgICBzY29wZS5jYXJvdXNlbEluZGV4ID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGNhcm91c2VsVGltZSk7XG4gICAgICB9XG5cbiAgICAgIHNjb3BlLiR3YXRjaCgnaW1hZ2VBcnJheScsIGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICBpZiAobmV3VmFsdWUpIHtcbiAgICAgICAgICBpbml0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG5cbiAgICAgIC8qKlxuICAgICAgICogVG9nZ2xlIFBsYXliYWNrIGZ1bmN0aW9uLCBzdGFydHMvcGF1c2VzIGNhcm91c2VsXG4gICAgICAgKiBAYXV0aG9yIEJyYW5kb24gR3JvZmZcbiAgICAgICAqL1xuICAgICAgc2NvcGUudG9nZ2xlUGxheWJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNjb3BlLnBhdXNlZCA9ICFzY29wZS5wYXVzZWQ7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8qKlxuICAgICAgICogVG9nZ2xlIEZ1bGxTY3JlZW4gZnVuY3Rpb24sIGV4cGFuZHMvc2hyaW5rcyBjYXJvdXNlbFxuICAgICAgICogQGF1dGhvciBCcmFuZG9uIEdyb2ZmXG4gICAgICAgKi9cbi8vICAgICAgc2NvcGUudG9nZ2xlRnVsbHNjcmVlbiA9IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICBzY29wZS5mdWxsU2NyZWVuID0gIXNjb3BlLmZ1bGxTY3JlZW47XG4vLyAgICAgIH1cblxuICAgIH1cbiAgfVxufSk7IiwiZnVuY3Rpb24gR3JpZFN0eWxlKCkgeyB9XG5cbkdyaWRTdHlsZS5MaXN0ID0gJ2xpc3QnO1xuXG5HcmlkU3R5bGUuVGlsZXMgPSAnZ3JpZCc7XG5cbmFwcC5kaXJlY3RpdmUoJ2dyaWQnLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRyYW5zY2x1ZGU6IGZhbHNlLFxuICAgIHNjb3BlOiB7XG4gICAgICBkYXRhOiAnPScsXG4gICAgICBncmlkU3R5bGU6ICc9J1xuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2RpcmVjdGl2ZXMvZ3JpZC5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpe1xuICAgICAgaWYgKCFzY29wZS5ncmlkU3R5bGUpe1xuICAgICAgICBzY29wZS5ncmlkU3R5bGUgPSBHcmlkU3R5bGUuVGlsZXM7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHNjb3BlLnNldFN0eWxlID0gZnVuY3Rpb24obmV3U3R5bGUpIHtcbiAgICAgICAgc2NvcGUuZ3JpZFN0eWxlID0gbmV3U3R5bGU7XG4gICAgICB9O1xuICAgICAgXG4gICAgfVxuLy8gICAgY29udHJvbGxlcjogJ05hdkNvbnRyb2xsZXInXG4gIH1cbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2dyaWRMaXN0JywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBzY29wZToge1xuICAgICAgcHJvamVjdDogJz0nXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZGlyZWN0aXZlcy9ncmlkLWxpc3QuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKXtcbiAgICAgIFxuICAgIH1cbiAgfVxufSk7IiwiYXBwLmRpcmVjdGl2ZSgnZ3JpZFRpbGUnLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHNjb3BlOiB7XG4gICAgICBwcm9qZWN0OiAnPSdcbiAgICB9LFxuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9kaXJlY3RpdmVzL2dyaWQtdGlsZS5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpe1xuICAgICAgXG4gICAgfVxuICB9XG59KTsiLCJhcHAuZGlyZWN0aXZlKFwibUFwcExvYWRpbmdcIiwgZnVuY3Rpb24gKCRhbmltYXRlLCAkcm9vdFNjb3BlKSB7XG5cbiAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcykge1xuICAgIC8vIER1ZSB0byB0aGUgd2F5IEFuZ3VsYXJKUyBwcmV2ZW50cyBhbmltYXRpb24gZHVyaW5nIHRoZSBib290c3RyYXBcbiAgICAvLyBvZiB0aGUgYXBwbGljYXRpb24sIHdlIGNhbid0IGFuaW1hdGUgdGhlIHRvcC1sZXZlbCBjb250YWluZXI7IGJ1dCxcbiAgICAvLyBzaW5jZSB3ZSBhZGRlZCBcIm5nQW5pbWF0ZUNoaWxkcmVuXCIsIHdlIGNhbiBhbmltYXRlZCB0aGUgaW5uZXJcbiAgICAvLyBjb250YWluZXIgZHVyaW5nIHRoaXMgcGhhc2UuXG4gICAgLy8gLS1cbiAgICAvLyBOT1RFOiBBbSB1c2luZyAuZXEoMSkgc28gdGhhdCB3ZSBkb24ndCBhbmltYXRlIHRoZSBTdHlsZSBibG9jay5cbiAgICAkYW5pbWF0ZS5lbmFibGVkKHRydWUpO1xuXG4gICAgJHJvb3RTY29wZS4kd2F0Y2goJ2VuZEFuaW1hdGlvbicsIGZ1bmN0aW9uIChuZXdWYWwpIHtcbiAgICAgIGlmIChuZXdWYWwpIHtcbiAgICAgICAgJGFuaW1hdGUubGVhdmUoZWxlbWVudC5jaGlsZHJlbigpLmVxKDEpKS50aGVuKFxuICAgICAgICAgIGZ1bmN0aW9uIGNsZWFudXBBZnRlckFuaW1hdGlvbigpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgcm9vdCBkaXJlY3RpdmUgZWxlbWVudC5cbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgICAgICAvLyBDbGVhciB0aGUgY2xvc2VkLW92ZXIgdmFyaWFibGUgcmVmZXJlbmNlcy5cbiAgICAgICAgICAgIHNjb3BlID0gZWxlbWVudCA9IGF0dHJpYnV0ZXMgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB9O1xuXG5cbiAgLy8gUmV0dXJuIHRoZSBkaXJlY3RpdmUgY29uZmlndXJhdGlvbi5cbiAgcmV0dXJuICh7XG4gICAgbGluazogbGluayxcbiAgICByZXN0cmljdDogXCJDXCJcbiAgfSk7XG4gIC8vIEkgYmluZCB0aGUgSmF2YVNjcmlwdCBldmVudHMgdG8gdGhlIHNjb3BlLlxuXG59KTsiLCJhcHAuZGlyZWN0aXZlKCduYXZpZ2F0aW9uJywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdHJhbnNjbHVkZTogZmFsc2UsXG4gICAgc2NvcGU6IHtcbiAgICAgIHByb2plY3Q6IFwiPVwiXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZGlyZWN0aXZlcy9uYXZpZ2F0aW9uLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycyl7XG4gICAgICBcbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6ICdOYXZDb250cm9sbGVyJ1xuICB9XG59KTsiLCJhcHAuc2VydmljZShcIiRqc29uXCIsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gIHZhciBsb2NhdGlvbiA9IFwianNvbi9cIjtcblxuICB2YXIgdG9UaXRsZUNhc2UgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXHdcXFMqL2csIGZ1bmN0aW9uICh0eHQpIHtcbiAgICAgIHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgfSk7XG4gIH1cblxuICB0aGlzLmZvcm1hdFRpdGxlID0gZnVuY3Rpb24gKHRpdGxlKSB7XG4gICAgdmFyIHRlbXAgPSB0b1RpdGxlQ2FzZSh0aXRsZSk7XG4gICAgdGVtcCA9IHRlbXAucmVwbGFjZSgvIC9nLCBcIlwiKTtcbiAgICB0ZW1wID0gdGVtcC5yZXBsYWNlKFwiKFwiLCBcIlwiKTtcbiAgICB0ZW1wID0gdGVtcC5yZXBsYWNlKFwiKVwiLCBcIlwiKTtcbiAgICB0ZW1wID0gdGVtcC5yZXBsYWNlKC8tL2csIFwiXCIpO1xuICAgIHJldHVybiB0ZW1wO1xuICB9XG5cbiAgdGhpcy5sb2FkRmlsZSA9IGZ1bmN0aW9uIChmaWxlbmFtZSkge1xuICAgIHJldHVybiAkaHR0cC5nZXQobG9jYXRpb24gKyBmaWxlbmFtZSArIFwiLmpzb25cIik7XG4gIH1cblxuICB0aGlzLmVycm9yUmVzcG9uc2UgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICBhbGVydChcIkFuIGVycm9yIG9jY3VyZWQgbG9hZGluZyB0aGUgcmVtb3RlIGRhdGEuIFBsZWFzZSByZWxvYWQgdGhlIHBhZ2UgdG8gdHJ5IGFnYWluLlwiKTtcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gIH1cbn0pOyIsImFwcC5zZXJ2aWNlKFwiJHByZWxvYWRcIiwgZnVuY3Rpb24gKCR0ZW1wbGF0ZUNhY2hlLCAkaHR0cCkge1xuXG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgdmlld3MgPSBbXG4gICAgJ2Fib3V0JyxcbiAgICAnZXhwZXJpZW5jZScsXG4gICAgJ2hvbWUnLFxuICAgICdwcm9qZWN0cycsXG4gICAgJ2RpcmVjdGl2ZXMvY2Fyb3VzZWwnLFxuICAgICdkaXJlY3RpdmVzL2dyaWQtbGlzdCcsXG4gICAgJ2RpcmVjdGl2ZXMvZ3JpZC10aWxlJyxcbiAgICAnZGlyZWN0aXZlcy9ncmlkJyxcbiAgICAnZGlyZWN0aXZlcy9uYXZpZ2F0aW9uJyxcbiAgICAncHJvamVjdHMvYWxsJyxcbiAgICAncHJvamVjdHMvZGV0YWlscydcbiAgXTtcblxuICB2YXIganNvbiA9IFtcbiAgICAnaW5mb3JtYXRpb24vZ2VuZXJhbCcsXG4vLyAgICAnaW5mb3JtYXRpb24vaW50ZXJlc3RzJyxcbi8vICAgICdpbmZvcm1hdGlvbi9wZXJzb25hbGl0eVRyYWl0cycsXG4vLyAgICAnaW5mb3JtYXRpb24vc2tpbGxzJyxcbiAgICAnaW5mb3JtYXRpb24vd29yaycsXG4vLyAgICAnb2xkUHJvamVjdHMnLFxuICAgICdwcm9qZWN0cydcbiAgXTtcblxuICB2YXIgcHJvakpzb24gPSBbXG4gICAgJ3Byb2plY3RzL0FzdGVyb2lkQmxhc3RlcicsXG4vLyAgICAncHJvamVjdHMvQXVnbWVudGVkUmVhbGl0eVNjYXZlbmdlckh1bnQnLFxuLy8gICAgJ3Byb2plY3RzL0JvbWJuYW56YScsXG4vLyAgICAncHJvamVjdHMvQnV6emVkQnVkZHknLFxuICAgICdwcm9qZWN0cy9DaGFybGllRWF0c1dvcm1zJyxcbi8vICAgICdwcm9qZWN0cy9Db2RlT2ZLbmlnaHRob2RkJyxcbiAgICAncHJvamVjdHMvR29kZXgnLFxuICAgICdwcm9qZWN0cy9IYWNrb2xhbnRlcm4nLFxuICAgICdwcm9qZWN0cy9JbmJldHdlZW4nLFxuLy8gICAgJ3Byb2plY3RzL0luYmV0d2VlbmlvcycsXG4vLyAgICAncHJvamVjdHMvTWN2ZXJpbG9nJyxcbi8vICAgICdwcm9qZWN0cy9QbGFudHNJblNwYWNlJyxcbiAgICAncHJvamVjdHMvUGxleG1lZGlhU2VydmVyJyxcbiAgICAncHJvamVjdHMvUG9rZW1vbmRiJyxcbiAgICAncHJvamVjdHMvU2ltcGxlU3R1ZGVudERiJyxcbiAgICAncHJvamVjdHMvU2tidXR0b24nLFxuICAgICdwcm9qZWN0cy9WaXJ0dWFsQ29tbWVuY2VtZW50QWRtaW4nLFxuICAgICdwcm9qZWN0cy9XaWZpdXNiJ1xuICBdXG5cblxuICAvKipcbiAgICogTG9hZCBhbGwgaW1hZ2VzIGZyb20gdGhlIGpzb25cbiAgICogQGF1dGhvciBCcmFuZG9uIEdyb2ZmXG4gICAqIEBwYXJhbSB7T2JqZWN0fSAganNvbkZpbGUgdGhlIGxvYWRlZCBqc29uIGZpbGVcbiAgICogQHJldHVybnMge1Byb21pc2V9IGEgcHJvbWlzZVxuICAgKi9cbiAgdmFyIGxvYWRJbWFnZXMgPSBmdW5jdGlvbiAoanNvbkZpbGUpIHtcbiAgICB2YXIgcHJvbUFycmF5ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBqc29uRmlsZS5pbWFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB1cmwgPSBqc29uRmlsZS5pbWFnZXNbaV07XG4gICAgICB2YXIgcHJvbSA9ICRodHRwLmdldCgnL2Fzc2V0cy9wcm9qZWN0cy8nICsgdXJsKTtcbiAgICAgIHByb21BcnJheS5wdXNoKHByb20pO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbUFycmF5KTtcbiAgfTtcblxuICAvKipcbiAgICogTG9hZCBhbGwgdGVtcGxhdGUgaHRtbCxqc29uLCBhbmQgaW1hZ2UgZmlsZXMgZm9yIGZ1dHVyZSB1c2VcbiAgICogQGF1dGhvciBCcmFuZG9uIEdyb2ZmXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBBIFByb21pc2UgdGhhdCBhbHdheXMgcmVzb2x2ZXMgc3VjY2Vzc2Z1bGx5XG4gICAqL1xuICB0aGlzLmxvYWRBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1hc3RlclByb20gPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgIHZhciBwcm9tQXJyYXkgPSBbXTtcblxuICAgICAgLy9WaWV3c1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aWV3cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdGhpc2RpciA9IHZpZXdzW2ldO1xuICAgICAgICB2YXIgcHJvbSA9ICRodHRwLmdldCgndmlld3MvJyArIHRoaXNkaXIgKyAnLmh0bWwnKTtcbiAgICAgICAgcHJvbUFycmF5LnB1c2gocHJvbSk7XG4gICAgICB9XG5cbiAgICAgIC8vUHJvakpTT05cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvakpzb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHRoaXNkaXIgPSBwcm9qSnNvbltpXTtcbiAgICAgICAgdmFyIHByb20gPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgJGh0dHAuZ2V0KCdqc29uLycgKyB0aGlzZGlyICsgJy5qc29uJylcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAvL0ltYWdlc1xuICAgICAgICAgICAgICB2YXIgaW1nUHJvbSA9IGxvYWRJbWFnZXMocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgICAgIGltZ1Byb20udGhlbihmdW5jdGlvbih2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAvL2FkZCB0aGlzIGl0ZW0gb3IgaXQgd29uJ3QgZ2V0IGNhY2hlZFxuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHZhbHVlcyk7XG4gICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHByb21BcnJheS5wdXNoKHByb20pO1xuICAgICAgfVxuXG4gICAgICAvL0pTT05cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwganNvbi5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdGhpc2RpciA9IGpzb25baV07XG4gICAgICAgIHZhciBwcm9tID0gJGh0dHAuZ2V0KCdqc29uLycgKyB0aGlzZGlyICsgJy5qc29uJyk7XG4gICAgICAgIHByb21BcnJheS5wdXNoKHByb20pO1xuICAgICAgfVxuXG4gICAgICAvL0ZJTkFMTFkgLT4gc2F2ZSB0aGVtIEFMTExMXG4gICAgICBQcm9taXNlLmFsbChwcm9tQXJyYXkpLnRoZW4oZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICAgIHZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3BvbnNlKSkge1xuICAgICAgICAgICAgcmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiAoaW5uZXJSZXNwb25zZSkge1xuICAgICAgICAgICAgICAkdGVtcGxhdGVDYWNoZS5wdXQoaW5uZXJSZXNwb25zZS5jb25maWcudXJsLCBpbm5lclJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICR0ZW1wbGF0ZUNhY2hlLnB1dChyZXNwb25zZS5jb25maWcudXJsLCByZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXNvbHZlKCdTdWNjZXNzJyk7XG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgcmVzb2x2ZShlcnIpO1xuICAgICAgfSk7XG5cbiAgICB9KTtcbiAgICByZXR1cm4gbWFzdGVyUHJvbTtcbiAgfTtcblxufSk7Il19
