var app = angular.module('app', ['ui.router', 'ngAnimate']);

setTimeout(
  function asyncBootstrap() {
    angular.bootstrap(document, ["app"]);
  }, (3.3 * 1000)
);

app.run(function ($rootScope, $state) {
  $rootScope.$state = $state;
  $rootScope.loading = false;
  $rootScope.modalData = {};
  $(".button-collapse").sideNav({
    closeOnClick: true
  });

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
app.controller('ProjectsDetailsController', function ($scope, $stateParams, $json) {

  var title = $stateParams.projectName;

  $json.loadFile("projects/" + title)
    .then(function successCallback(response) {
      $scope.project = response.data;
    }, function errorCallback(response) {
      $json.errorResponse(response);
    });

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
      
      scope.paused = false;
      
      scope.carouselIndex = 0;
      
      var carouselTime = 4500;

      this.carousel = $interval(function () {
        scope.carouselIndex += 1;
        if (scope.project.images.length == scope.carouselIndex) {
          scope.carouselIndex = 0;
        }
      }, carouselTime);
      
      /**
       * Toggle Playback function, starts/pauses carousel
       * @author Brandon Groff
       */
      scope.togglePlayback = function() {
        scope.paused = !scope.paused;
      }

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
app.directive("mAppLoading", function ($animate) {

  function link(scope, element, attributes) {
    // Due to the way AngularJS prevents animation during the bootstrap
    // of the application, we can't animate the top-level container; but,
    // since we added "ngAnimateChildren", we can animated the inner
    // container during this phase.
    // --
    // NOTE: Am using .eq(1) so that we don't animate the Style block.
    $animate.enabled(true);
    $animate.leave(element.children().eq(1)).then(
      function cleanupAfterAnimation() {
        // Remove the root directive element.
        element.remove();
        // Clear the closed-over variable references.
        scope = element = attributes = null;
      }
    );
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

  var location = "json/"

  this.loadFile = function (filename) {
    return $http.get(location + filename + ".json");
  }

  this.errorResponse = function (error) {
    alert("An error occured loading the remote data. Please reload the page to try again.");
    console.log(error);
  }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL0Fib3V0Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL0V4cGVyaWVuY2VDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvSG9tZUNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9OYXZDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvUHJvamVjdHNBbGxDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvUHJvamVjdHNDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvUHJvamVjdHNEZXRhaWxzQ29udHJvbGxlci5qcyIsImRpcmVjdGl2ZXMvY2Fyb3VzZWwuanMiLCJkaXJlY3RpdmVzL2dyaWQuanMiLCJkaXJlY3RpdmVzL2dyaWRMaXN0LmpzIiwiZGlyZWN0aXZlcy9ncmlkVGlsZS5qcyIsImRpcmVjdGl2ZXMvbUFwcExvYWRpbmcuanMiLCJkaXJlY3RpdmVzL25hdmlnYXRpb24uanMiLCJzZXJ2aWNlcy9qc29uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsndWkucm91dGVyJywgJ25nQW5pbWF0ZSddKTtcblxuc2V0VGltZW91dChcbiAgZnVuY3Rpb24gYXN5bmNCb290c3RyYXAoKSB7XG4gICAgYW5ndWxhci5ib290c3RyYXAoZG9jdW1lbnQsIFtcImFwcFwiXSk7XG4gIH0sICgzLjMgKiAxMDAwKVxuKTtcblxuYXBwLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHN0YXRlKSB7XG4gICRyb290U2NvcGUuJHN0YXRlID0gJHN0YXRlO1xuICAkcm9vdFNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgJHJvb3RTY29wZS5tb2RhbERhdGEgPSB7fTtcbiAgJChcIi5idXR0b24tY29sbGFwc2VcIikuc2lkZU5hdih7XG4gICAgY2xvc2VPbkNsaWNrOiB0cnVlXG4gIH0pO1xuXG4gICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldnQsIHRvLCBwYXJhbXMpIHtcbiAgICBpZiAodG8ucmVkaXJlY3RUbykge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAkc3RhdGUuZ28odG8ucmVkaXJlY3RUbywgcGFyYW1zLCB7XG4gICAgICAgIGxvY2F0aW9uOiAncmVwbGFjZSdcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59KTtcblxuXG4vKiAtLS0gUm91dGluZyAtLS0gKi9cblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgXG4gICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh7XG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICByZXF1aXJlQmFzZTogdHJ1ZVxuICB9KTtcblxuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKFwiL1wiKTtcblxuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnSG9tZScsIHtcbiAgICAgIHVybDogJy8nLFxuICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvaG9tZS5odG1sXCIsXG4gICAgICBjb250cm9sbGVyOiAnSG9tZUNvbnRyb2xsZXInLFxuICAgICAgZGF0YToge31cbiAgICB9KVxuICAgIC5zdGF0ZSgnQWJvdXQnLCB7XG4gICAgICB1cmw6ICcvYWJvdXQnLFxuICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWJvdXQuaHRtbFwiLFxuICAgICAgY29udHJvbGxlcjogJ0Fib3V0Q29udHJvbGxlcicsXG4gICAgICBkYXRhOiB7fVxuICAgIH0pXG4gICAgLnN0YXRlKCdFeHBlcmllbmNlJywge1xuICAgICAgdXJsOiAnL2V4cGVyaWVuY2UnLFxuICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvZXhwZXJpZW5jZS5odG1sXCIsXG4gICAgICBjb250cm9sbGVyOiAnRXhwZXJpZW5jZUNvbnRyb2xsZXInLFxuICAgICAgZGF0YToge31cbiAgICB9KVxuICAgIC5zdGF0ZSgnUHJvamVjdHMnLCB7XG4gICAgICB1cmw6IFwiL3Byb2plY3RzXCIsXG4gICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9wcm9qZWN0cy5odG1sXCIsXG4gICAgICBjb250cm9sbGVyOiAnUHJvamVjdHNDb250cm9sbGVyJyxcbiAgICAgIHJlZGlyZWN0VG86ICdQcm9qZWN0cy5BbGwnLFxuICAgICAgZGF0YToge31cbiAgICB9KVxuICAgIC5zdGF0ZSgnUHJvamVjdHMuQWxsJywge1xuICAgICAgcGFyZW50OiAnUHJvamVjdHMnLFxuICAgICAgcHJvamVjdDogJy9hbGwnLFxuICAgICAgdXJsOiBcIi9hbGw/c3R5bGVcIixcbiAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3Byb2plY3RzL2FsbC5odG1sXCIsXG4gICAgICBjb250cm9sbGVyOiAnUHJvamVjdHNBbGxDb250cm9sbGVyJyxcbiAgICAgIGRhdGE6IHt9XG4gICAgfSlcbiAgICAuc3RhdGUoJ1Byb2plY3RzLkRldGFpbCcsIHtcbiAgICAgIHBhcmVudDogJ1Byb2plY3RzJyxcbiAgICAgIHVybDogXCIvOnByb2plY3ROYW1lXCIsXG4gICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9wcm9qZWN0cy9kZXRhaWxzLmh0bWxcIixcbiAgICAgIGNvbnRyb2xsZXI6ICdQcm9qZWN0c0RldGFpbHNDb250cm9sbGVyJyxcbiAgICAgIGRhdGE6IHt9XG4gICAgfSk7XG59KTsiLCJhcHAuY29udHJvbGxlcignQWJvdXRDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGpzb24pIHtcblxuICAkanNvbi5sb2FkRmlsZSgnaW5mb3JtYXRpb24vZ2VuZXJhbCcpXG4gICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICRzY29wZS5nZW5lcmFsSW5mbyA9IGRhdGE7XG4gICAgfSlcbiAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSk7XG5cbn0pOyIsImFwcC5jb250cm9sbGVyKCdFeHBlcmllbmNlQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRqc29uKSB7XG4gICRqc29uLmxvYWRGaWxlKCdpbmZvcm1hdGlvbi93b3JrJylcbiAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgJHNjb3BlLndvcmtIaXN0b3J5ID0gZGF0YTtcbiAgICAgICQoJy5jb2xsYXBzaWJsZScpLmNvbGxhcHNpYmxlKCk7XG4gICAgfSlcbiAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSk7XG59KTsiLCJhcHAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUpe1xuICBcbn0pOyIsImFwcC5jb250cm9sbGVyKCdOYXZDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXG4gICQoXCIuYnV0dG9uLWNvbGxhcHNlXCIpLnNpZGVOYXYoe1xuICAgIGNsb3NlT25DbGljazogdHJ1ZVxuICB9KTtcblxufSk7IiwiYXBwLmNvbnRyb2xsZXIoJ1Byb2plY3RzQWxsQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRqc29uLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSkge1xuXG4gIGlmICghJHN0YXRlUGFyYW1zLnN0eWxlIHx8ICRzdGF0ZVBhcmFtcy5zdHlsZSA9PSBcIlwiKSB7XG4gICAgJHN0YXRlUGFyYW1zLnN0eWxlID0gJ3RpbGVzJztcblxuICAgICRzdGF0ZS5nbygnUHJvamVjdHMuQWxsJywge1xuICAgICAgc3R5bGU6ICRzdGF0ZVBhcmFtcy5zdHlsZVxuICAgIH0sIHtcbiAgICAgIG5vdGlmeTogZmFsc2UsXG4gICAgICBsb2NhdGlvbjogXCJyZXBsYWNlXCJcbiAgICB9KTtcblxuICB9O1xuICAkc2NvcGUuZ3JpZFN0eWxlID0gJHN0YXRlUGFyYW1zLnN0eWxlO1xuXG4gICRqc29uLmxvYWRGaWxlKCdwcm9qZWN0cycpXG4gICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICRzY29wZS5wcm9qZWN0TGlzdCA9IGRhdGE7XG4gICAgfSlcbiAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSk7XG5cblxuICAkc2NvcGUuJHdhdGNoKCdncmlkU3R5bGUnLCBmdW5jdGlvbiAobmV3VmFsLCBvbGRWYWwpIHtcbiAgICBpZiAobmV3VmFsICE9IG9sZFZhbCkge1xuICAgICAgJHN0YXRlLmdvKCdQcm9qZWN0cy5BbGwnLCB7XG4gICAgICAgIHN0eWxlOiBuZXdWYWxcbiAgICAgIH0sIHtcbiAgICAgICAgbm90aWZ5OiBmYWxzZSxcbiAgICAgICAgbG9jYXRpb246IFwicmVwbGFjZVwiXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG5cbn0pOyIsImFwcC5jb250cm9sbGVyKCdQcm9qZWN0c0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkanNvbikge1xuXG59KTsiLCJhcHAuY29udHJvbGxlcignUHJvamVjdHNEZXRhaWxzQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZVBhcmFtcywgJGpzb24pIHtcblxuICB2YXIgdGl0bGUgPSAkc3RhdGVQYXJhbXMucHJvamVjdE5hbWU7XG5cbiAgJGpzb24ubG9hZEZpbGUoXCJwcm9qZWN0cy9cIiArIHRpdGxlKVxuICAgIC50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3NDYWxsYmFjayhyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLnByb2plY3QgPSByZXNwb25zZS5kYXRhO1xuICAgIH0sIGZ1bmN0aW9uIGVycm9yQ2FsbGJhY2socmVzcG9uc2UpIHtcbiAgICAgICRqc29uLmVycm9yUmVzcG9uc2UocmVzcG9uc2UpO1xuICAgIH0pO1xuXG59KTsiLCJhcHAuZGlyZWN0aXZlKCdjYXJvdXNlbCcsIGZ1bmN0aW9uICgkaW50ZXJ2YWwpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgc2NvcGU6IHtcbiAgICAgIGltYWdlQXJyYXk6ICc9J1xuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2RpcmVjdGl2ZXMvY2Fyb3VzZWwuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgXG4gICAgICBzY29wZS5wYXVzZWQgPSBmYWxzZTtcbiAgICAgIFxuICAgICAgc2NvcGUuY2Fyb3VzZWxJbmRleCA9IDA7XG4gICAgICBcbiAgICAgIHZhciBjYXJvdXNlbFRpbWUgPSA0NTAwO1xuXG4gICAgICB0aGlzLmNhcm91c2VsID0gJGludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2NvcGUuY2Fyb3VzZWxJbmRleCArPSAxO1xuICAgICAgICBpZiAoc2NvcGUucHJvamVjdC5pbWFnZXMubGVuZ3RoID09IHNjb3BlLmNhcm91c2VsSW5kZXgpIHtcbiAgICAgICAgICBzY29wZS5jYXJvdXNlbEluZGV4ID0gMDtcbiAgICAgICAgfVxuICAgICAgfSwgY2Fyb3VzZWxUaW1lKTtcbiAgICAgIFxuICAgICAgLyoqXG4gICAgICAgKiBUb2dnbGUgUGxheWJhY2sgZnVuY3Rpb24sIHN0YXJ0cy9wYXVzZXMgY2Fyb3VzZWxcbiAgICAgICAqIEBhdXRob3IgQnJhbmRvbiBHcm9mZlxuICAgICAgICovXG4gICAgICBzY29wZS50b2dnbGVQbGF5YmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzY29wZS5wYXVzZWQgPSAhc2NvcGUucGF1c2VkO1xuICAgICAgfVxuXG4gICAgfVxuICB9XG59KTsiLCJmdW5jdGlvbiBHcmlkU3R5bGUoKSB7IH1cblxuR3JpZFN0eWxlLkxpc3QgPSAnbGlzdCc7XG5cbkdyaWRTdHlsZS5UaWxlcyA9ICdncmlkJztcblxuYXBwLmRpcmVjdGl2ZSgnZ3JpZCcsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdHJhbnNjbHVkZTogZmFsc2UsXG4gICAgc2NvcGU6IHtcbiAgICAgIGRhdGE6ICc9JyxcbiAgICAgIGdyaWRTdHlsZTogJz0nXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZGlyZWN0aXZlcy9ncmlkLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycyl7XG4gICAgICBpZiAoIXNjb3BlLmdyaWRTdHlsZSl7XG4gICAgICAgIHNjb3BlLmdyaWRTdHlsZSA9IEdyaWRTdHlsZS5UaWxlcztcbiAgICAgIH1cbiAgICAgIFxuICAgICAgc2NvcGUuc2V0U3R5bGUgPSBmdW5jdGlvbihuZXdTdHlsZSkge1xuICAgICAgICBzY29wZS5ncmlkU3R5bGUgPSBuZXdTdHlsZTtcbiAgICAgIH07XG4gICAgICBcbiAgICB9XG4vLyAgICBjb250cm9sbGVyOiAnTmF2Q29udHJvbGxlcidcbiAgfVxufSk7IiwiYXBwLmRpcmVjdGl2ZSgnZ3JpZExpc3QnLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHNjb3BlOiB7XG4gICAgICBwcm9qZWN0OiAnPSdcbiAgICB9LFxuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9kaXJlY3RpdmVzL2dyaWQtbGlzdC5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpe1xuICAgICAgXG4gICAgfVxuICB9XG59KTsiLCJhcHAuZGlyZWN0aXZlKCdncmlkVGlsZScsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgc2NvcGU6IHtcbiAgICAgIHByb2plY3Q6ICc9J1xuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2RpcmVjdGl2ZXMvZ3JpZC10aWxlLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycyl7XG4gICAgICBcbiAgICB9XG4gIH1cbn0pOyIsImFwcC5kaXJlY3RpdmUoXCJtQXBwTG9hZGluZ1wiLCBmdW5jdGlvbiAoJGFuaW1hdGUpIHtcblxuICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzKSB7XG4gICAgLy8gRHVlIHRvIHRoZSB3YXkgQW5ndWxhckpTIHByZXZlbnRzIGFuaW1hdGlvbiBkdXJpbmcgdGhlIGJvb3RzdHJhcFxuICAgIC8vIG9mIHRoZSBhcHBsaWNhdGlvbiwgd2UgY2FuJ3QgYW5pbWF0ZSB0aGUgdG9wLWxldmVsIGNvbnRhaW5lcjsgYnV0LFxuICAgIC8vIHNpbmNlIHdlIGFkZGVkIFwibmdBbmltYXRlQ2hpbGRyZW5cIiwgd2UgY2FuIGFuaW1hdGVkIHRoZSBpbm5lclxuICAgIC8vIGNvbnRhaW5lciBkdXJpbmcgdGhpcyBwaGFzZS5cbiAgICAvLyAtLVxuICAgIC8vIE5PVEU6IEFtIHVzaW5nIC5lcSgxKSBzbyB0aGF0IHdlIGRvbid0IGFuaW1hdGUgdGhlIFN0eWxlIGJsb2NrLlxuICAgICRhbmltYXRlLmVuYWJsZWQodHJ1ZSk7XG4gICAgJGFuaW1hdGUubGVhdmUoZWxlbWVudC5jaGlsZHJlbigpLmVxKDEpKS50aGVuKFxuICAgICAgZnVuY3Rpb24gY2xlYW51cEFmdGVyQW5pbWF0aW9uKCkge1xuICAgICAgICAvLyBSZW1vdmUgdGhlIHJvb3QgZGlyZWN0aXZlIGVsZW1lbnQuXG4gICAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgIC8vIENsZWFyIHRoZSBjbG9zZWQtb3ZlciB2YXJpYWJsZSByZWZlcmVuY2VzLlxuICAgICAgICBzY29wZSA9IGVsZW1lbnQgPSBhdHRyaWJ1dGVzID0gbnVsbDtcbiAgICAgIH1cbiAgICApO1xuICB9O1xuXG5cbiAgLy8gUmV0dXJuIHRoZSBkaXJlY3RpdmUgY29uZmlndXJhdGlvbi5cbiAgcmV0dXJuICh7XG4gICAgbGluazogbGluayxcbiAgICByZXN0cmljdDogXCJDXCJcbiAgfSk7XG4gIC8vIEkgYmluZCB0aGUgSmF2YVNjcmlwdCBldmVudHMgdG8gdGhlIHNjb3BlLlxuXG59KTsiLCJhcHAuZGlyZWN0aXZlKCduYXZpZ2F0aW9uJywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdHJhbnNjbHVkZTogZmFsc2UsXG4gICAgc2NvcGU6IHtcbiAgICAgIHByb2plY3Q6IFwiPVwiXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZGlyZWN0aXZlcy9uYXZpZ2F0aW9uLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycyl7XG4gICAgICBcbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6ICdOYXZDb250cm9sbGVyJ1xuICB9XG59KTsiLCJhcHAuc2VydmljZShcIiRqc29uXCIsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gIHZhciBsb2NhdGlvbiA9IFwianNvbi9cIlxuXG4gIHRoaXMubG9hZEZpbGUgPSBmdW5jdGlvbiAoZmlsZW5hbWUpIHtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KGxvY2F0aW9uICsgZmlsZW5hbWUgKyBcIi5qc29uXCIpO1xuICB9XG5cbiAgdGhpcy5lcnJvclJlc3BvbnNlID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgYWxlcnQoXCJBbiBlcnJvciBvY2N1cmVkIGxvYWRpbmcgdGhlIHJlbW90ZSBkYXRhLiBQbGVhc2UgcmVsb2FkIHRoZSBwYWdlIHRvIHRyeSBhZ2Fpbi5cIik7XG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xuICB9XG59KTsiXX0=
