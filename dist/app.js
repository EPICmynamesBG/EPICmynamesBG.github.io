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
      url: "/all",
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
app.controller('ProjectsAllController', function ($scope, $json) {

  $json.loadFile('projects')
    .success(function (data) {
      $scope.projectList = data;
    })
    .error(function (error) {
      console.log(error);
    });
});
app.controller('ProjectsController', function ($scope, $json) {

  $json.loadFile('projects')
    .success(function (data) {
      $scope.projectList = data;
//      $(document).ready(function () {
//        $('ul.tabs').tabs();
//      });
    })
    .error(function (error) {
      console.log(error);
    });

});
app.controller('ProjectsDetailsController', function($scope){
  
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL0Fib3V0Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL0V4cGVyaWVuY2VDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvSG9tZUNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9OYXZDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvUHJvamVjdHNBbGxDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvUHJvamVjdHNDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvUHJvamVjdHNEZXRhaWxzQ29udHJvbGxlci5qcyIsImRpcmVjdGl2ZXMvY2Fyb3VzZWwuanMiLCJkaXJlY3RpdmVzL2dyaWQuanMiLCJkaXJlY3RpdmVzL2dyaWRMaXN0LmpzIiwiZGlyZWN0aXZlcy9ncmlkVGlsZS5qcyIsImRpcmVjdGl2ZXMvbUFwcExvYWRpbmcuanMiLCJkaXJlY3RpdmVzL25hdmlnYXRpb24uanMiLCJzZXJ2aWNlcy9qc29uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsndWkucm91dGVyJywgJ25nQW5pbWF0ZSddKTtcblxuc2V0VGltZW91dChcbiAgZnVuY3Rpb24gYXN5bmNCb290c3RyYXAoKSB7XG4gICAgYW5ndWxhci5ib290c3RyYXAoZG9jdW1lbnQsIFtcImFwcFwiXSk7XG4gIH0sICgzLjMgKiAxMDAwKVxuKTtcblxuYXBwLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHN0YXRlKSB7XG4gICRyb290U2NvcGUuJHN0YXRlID0gJHN0YXRlO1xuICAkcm9vdFNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgJHJvb3RTY29wZS5tb2RhbERhdGEgPSB7fTtcbiAgJChcIi5idXR0b24tY29sbGFwc2VcIikuc2lkZU5hdih7XG4gICAgY2xvc2VPbkNsaWNrOiB0cnVlXG4gIH0pO1xuXG4gICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldnQsIHRvLCBwYXJhbXMpIHtcbiAgICBpZiAodG8ucmVkaXJlY3RUbykge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAkc3RhdGUuZ28odG8ucmVkaXJlY3RUbywgcGFyYW1zLCB7XG4gICAgICAgIGxvY2F0aW9uOiAncmVwbGFjZSdcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59KTtcblxuXG4vKiAtLS0gUm91dGluZyAtLS0gKi9cblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgXG4gICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh7XG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICByZXF1aXJlQmFzZTogdHJ1ZVxuICB9KTtcblxuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKFwiL1wiKTtcblxuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnSG9tZScsIHtcbiAgICAgIHVybDogJy8nLFxuICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvaG9tZS5odG1sXCIsXG4gICAgICBjb250cm9sbGVyOiAnSG9tZUNvbnRyb2xsZXInLFxuICAgICAgZGF0YToge31cbiAgICB9KVxuICAgIC5zdGF0ZSgnQWJvdXQnLCB7XG4gICAgICB1cmw6ICcvYWJvdXQnLFxuICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWJvdXQuaHRtbFwiLFxuICAgICAgY29udHJvbGxlcjogJ0Fib3V0Q29udHJvbGxlcicsXG4gICAgICBkYXRhOiB7fVxuICAgIH0pXG4gICAgLnN0YXRlKCdFeHBlcmllbmNlJywge1xuICAgICAgdXJsOiAnL2V4cGVyaWVuY2UnLFxuICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvZXhwZXJpZW5jZS5odG1sXCIsXG4gICAgICBjb250cm9sbGVyOiAnRXhwZXJpZW5jZUNvbnRyb2xsZXInLFxuICAgICAgZGF0YToge31cbiAgICB9KVxuICAgIC5zdGF0ZSgnUHJvamVjdHMnLCB7XG4gICAgICB1cmw6IFwiL3Byb2plY3RzXCIsXG4gICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9wcm9qZWN0cy5odG1sXCIsXG4gICAgICBjb250cm9sbGVyOiAnUHJvamVjdHNDb250cm9sbGVyJyxcbiAgICAgIHJlZGlyZWN0VG86ICdQcm9qZWN0cy5BbGwnLFxuICAgICAgZGF0YToge31cbiAgICB9KVxuICAgIC5zdGF0ZSgnUHJvamVjdHMuQWxsJywge1xuICAgICAgcGFyZW50OiAnUHJvamVjdHMnLFxuICAgICAgcHJvamVjdDogJy9hbGwnLFxuICAgICAgdXJsOiBcIi9hbGxcIixcbiAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3Byb2plY3RzL2FsbC5odG1sXCIsXG4gICAgICBjb250cm9sbGVyOiAnUHJvamVjdHNBbGxDb250cm9sbGVyJyxcbiAgICAgIGRhdGE6IHt9XG4gICAgfSlcbiAgICAuc3RhdGUoJ1Byb2plY3RzLkRldGFpbCcsIHtcbiAgICAgIHBhcmVudDogJ1Byb2plY3RzJyxcbiAgICAgIHVybDogXCIvOnByb2plY3ROYW1lXCIsXG4gICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9wcm9qZWN0cy9kZXRhaWxzLmh0bWxcIixcbiAgICAgIGNvbnRyb2xsZXI6ICdQcm9qZWN0c0RldGFpbHNDb250cm9sbGVyJyxcbiAgICAgIGRhdGE6IHt9XG4gICAgfSk7XG59KTsiLCJhcHAuY29udHJvbGxlcignQWJvdXRDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGpzb24pIHtcblxuICAkanNvbi5sb2FkRmlsZSgnaW5mb3JtYXRpb24vZ2VuZXJhbCcpXG4gICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICRzY29wZS5nZW5lcmFsSW5mbyA9IGRhdGE7XG4gICAgfSlcbiAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSk7XG5cbn0pOyIsImFwcC5jb250cm9sbGVyKCdFeHBlcmllbmNlQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRqc29uKSB7XG4gICRqc29uLmxvYWRGaWxlKCdpbmZvcm1hdGlvbi93b3JrJylcbiAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgJHNjb3BlLndvcmtIaXN0b3J5ID0gZGF0YTtcbiAgICAgICQoJy5jb2xsYXBzaWJsZScpLmNvbGxhcHNpYmxlKCk7XG4gICAgfSlcbiAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSk7XG59KTsiLCJhcHAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUpe1xuICBcbn0pOyIsImFwcC5jb250cm9sbGVyKCdOYXZDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXG4gICQoXCIuYnV0dG9uLWNvbGxhcHNlXCIpLnNpZGVOYXYoe1xuICAgIGNsb3NlT25DbGljazogdHJ1ZVxuICB9KTtcblxufSk7IiwiYXBwLmNvbnRyb2xsZXIoJ1Byb2plY3RzQWxsQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRqc29uKSB7XG5cbiAgJGpzb24ubG9hZEZpbGUoJ3Byb2plY3RzJylcbiAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgJHNjb3BlLnByb2plY3RMaXN0ID0gZGF0YTtcbiAgICB9KVxuICAgIC5lcnJvcihmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KTtcbn0pOyIsImFwcC5jb250cm9sbGVyKCdQcm9qZWN0c0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkanNvbikge1xuXG4gICRqc29uLmxvYWRGaWxlKCdwcm9qZWN0cycpXG4gICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICRzY29wZS5wcm9qZWN0TGlzdCA9IGRhdGE7XG4vLyAgICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICAkKCd1bC50YWJzJykudGFicygpO1xuLy8gICAgICB9KTtcbiAgICB9KVxuICAgIC5lcnJvcihmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KTtcblxufSk7IiwiYXBwLmNvbnRyb2xsZXIoJ1Byb2plY3RzRGV0YWlsc0NvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUpe1xuICBcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2Nhcm91c2VsJywgZnVuY3Rpb24gKCRpbnRlcnZhbCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBzY29wZToge1xuICAgICAgaW1hZ2VBcnJheTogJz0nXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZGlyZWN0aXZlcy9jYXJvdXNlbC5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICBcbiAgICAgIHNjb3BlLnBhdXNlZCA9IGZhbHNlO1xuICAgICAgXG4gICAgICBzY29wZS5jYXJvdXNlbEluZGV4ID0gMDtcbiAgICAgIFxuICAgICAgdmFyIGNhcm91c2VsVGltZSA9IDQ1MDA7XG5cbiAgICAgIHRoaXMuY2Fyb3VzZWwgPSAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICBzY29wZS5jYXJvdXNlbEluZGV4ICs9IDE7XG4gICAgICAgIGlmIChzY29wZS5wcm9qZWN0LmltYWdlcy5sZW5ndGggPT0gc2NvcGUuY2Fyb3VzZWxJbmRleCkge1xuICAgICAgICAgIHNjb3BlLmNhcm91c2VsSW5kZXggPSAwO1xuICAgICAgICB9XG4gICAgICB9LCBjYXJvdXNlbFRpbWUpO1xuICAgICAgXG4gICAgICAvKipcbiAgICAgICAqIFRvZ2dsZSBQbGF5YmFjayBmdW5jdGlvbiwgc3RhcnRzL3BhdXNlcyBjYXJvdXNlbFxuICAgICAgICogQGF1dGhvciBCcmFuZG9uIEdyb2ZmXG4gICAgICAgKi9cbiAgICAgIHNjb3BlLnRvZ2dsZVBsYXliYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNjb3BlLnBhdXNlZCA9ICFzY29wZS5wYXVzZWQ7XG4gICAgICB9XG5cbiAgICB9XG4gIH1cbn0pOyIsImZ1bmN0aW9uIEdyaWRTdHlsZSgpIHsgfVxuXG5HcmlkU3R5bGUuTGlzdCA9ICdsaXN0JztcblxuR3JpZFN0eWxlLlRpbGVzID0gJ2dyaWQnO1xuXG5hcHAuZGlyZWN0aXZlKCdncmlkJywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBzY29wZToge1xuICAgICAgZGF0YTogJz0nLFxuICAgICAgZ3JpZFN0eWxlOiAnPSdcbiAgICB9LFxuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9kaXJlY3RpdmVzL2dyaWQuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKXtcbiAgICAgIFxuICAgICAgaWYgKCFzY29wZS5ncmlkU3R5bGUpe1xuICAgICAgICBzY29wZS5ncmlkU3R5bGUgPSBHcmlkU3R5bGUuVGlsZXM7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHNjb3BlLnNldFN0eWxlID0gZnVuY3Rpb24obmV3U3R5bGUpIHtcbiAgICAgICAgc2NvcGUuZ3JpZFN0eWxlID0gbmV3U3R5bGU7XG4gICAgICB9O1xuICAgICAgXG4gICAgfVxuLy8gICAgY29udHJvbGxlcjogJ05hdkNvbnRyb2xsZXInXG4gIH1cbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2dyaWRMaXN0JywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBzY29wZToge1xuICAgICAgcHJvamVjdDogJz0nXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZGlyZWN0aXZlcy9ncmlkLWxpc3QuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKXtcbiAgICAgIFxuICAgIH1cbiAgfVxufSk7IiwiYXBwLmRpcmVjdGl2ZSgnZ3JpZFRpbGUnLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHNjb3BlOiB7XG4gICAgICBwcm9qZWN0OiAnPSdcbiAgICB9LFxuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9kaXJlY3RpdmVzL2dyaWQtdGlsZS5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpe1xuICAgICAgXG4gICAgfVxuICB9XG59KTsiLCJhcHAuZGlyZWN0aXZlKFwibUFwcExvYWRpbmdcIiwgZnVuY3Rpb24gKCRhbmltYXRlKSB7XG5cbiAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcykge1xuICAgIC8vIER1ZSB0byB0aGUgd2F5IEFuZ3VsYXJKUyBwcmV2ZW50cyBhbmltYXRpb24gZHVyaW5nIHRoZSBib290c3RyYXBcbiAgICAvLyBvZiB0aGUgYXBwbGljYXRpb24sIHdlIGNhbid0IGFuaW1hdGUgdGhlIHRvcC1sZXZlbCBjb250YWluZXI7IGJ1dCxcbiAgICAvLyBzaW5jZSB3ZSBhZGRlZCBcIm5nQW5pbWF0ZUNoaWxkcmVuXCIsIHdlIGNhbiBhbmltYXRlZCB0aGUgaW5uZXJcbiAgICAvLyBjb250YWluZXIgZHVyaW5nIHRoaXMgcGhhc2UuXG4gICAgLy8gLS1cbiAgICAvLyBOT1RFOiBBbSB1c2luZyAuZXEoMSkgc28gdGhhdCB3ZSBkb24ndCBhbmltYXRlIHRoZSBTdHlsZSBibG9jay5cbiAgICAkYW5pbWF0ZS5lbmFibGVkKHRydWUpO1xuICAgICRhbmltYXRlLmxlYXZlKGVsZW1lbnQuY2hpbGRyZW4oKS5lcSgxKSkudGhlbihcbiAgICAgIGZ1bmN0aW9uIGNsZWFudXBBZnRlckFuaW1hdGlvbigpIHtcbiAgICAgICAgLy8gUmVtb3ZlIHRoZSByb290IGRpcmVjdGl2ZSBlbGVtZW50LlxuICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICAvLyBDbGVhciB0aGUgY2xvc2VkLW92ZXIgdmFyaWFibGUgcmVmZXJlbmNlcy5cbiAgICAgICAgc2NvcGUgPSBlbGVtZW50ID0gYXR0cmlidXRlcyA9IG51bGw7XG4gICAgICB9XG4gICAgKTtcbiAgfTtcblxuXG4gIC8vIFJldHVybiB0aGUgZGlyZWN0aXZlIGNvbmZpZ3VyYXRpb24uXG4gIHJldHVybiAoe1xuICAgIGxpbms6IGxpbmssXG4gICAgcmVzdHJpY3Q6IFwiQ1wiXG4gIH0pO1xuICAvLyBJIGJpbmQgdGhlIEphdmFTY3JpcHQgZXZlbnRzIHRvIHRoZSBzY29wZS5cblxufSk7IiwiYXBwLmRpcmVjdGl2ZSgnbmF2aWdhdGlvbicsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHRyYW5zY2x1ZGU6IGZhbHNlLFxuICAgIHNjb3BlOiB7XG4gICAgICBwcm9qZWN0OiBcIj1cIlxuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2RpcmVjdGl2ZXMvbmF2aWdhdGlvbi5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpe1xuICAgICAgXG4gICAgfSxcbiAgICBjb250cm9sbGVyOiAnTmF2Q29udHJvbGxlcidcbiAgfVxufSk7IiwiYXBwLnNlcnZpY2UoXCIkanNvblwiLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuICB2YXIgbG9jYXRpb24gPSBcImpzb24vXCJcblxuICB0aGlzLmxvYWRGaWxlID0gZnVuY3Rpb24gKGZpbGVuYW1lKSB7XG4gICAgcmV0dXJuICRodHRwLmdldChsb2NhdGlvbiArIGZpbGVuYW1lICsgXCIuanNvblwiKTtcbiAgfVxuXG4gIHRoaXMuZXJyb3JSZXNwb25zZSA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgIGFsZXJ0KFwiQW4gZXJyb3Igb2NjdXJlZCBsb2FkaW5nIHRoZSByZW1vdGUgZGF0YS4gUGxlYXNlIHJlbG9hZCB0aGUgcGFnZSB0byB0cnkgYWdhaW4uXCIpO1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgfVxufSk7Il19
