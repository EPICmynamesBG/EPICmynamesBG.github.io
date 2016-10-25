var app = angular.module('app', ['ui.router']);

app.run(function ($rootScope, config, $state) {
  $rootScope.config = config;
  $rootScope.$state = $state;
  $rootScope.loading = false;
  $rootScope.modalData = {};
  $(".button-collapse").sideNav({
    closeOnClick: true
  });
});


/* --- Routing --- */

app.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('Home', {
      url: '/',
      templateUrl: "html/main.html",
      controller: 'MainController',
      data: {}
    })
    .state('Search', {
      dynamic: true,
      url: "/search",
      templateUrl: "html/search.html",
      controller: 'SearchController',
      data: {
      }
    })
    .state('Projects', {
      url: "/projects",
      templateUrl: "html/projects.html",
      controller: 'CreateController',
      data: {
        
      }
    })
    .state('Projects.Project', {
      parent: 'Projects',
      url: "/project",
      templateUrl: "html/projects.html",
      controller: 'CreateController',
      data: {
        
      }
    });
});