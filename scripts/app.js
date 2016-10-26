var app = angular.module('app', ['ui.router', 'ngAnimate']);

setTimeout(
  function asyncBootstrap() {
    angular.bootstrap(document, ["app"]);
  }, (4.2 * 1000)
);

app.run(function ($rootScope, $state) {
  $rootScope.$state = $state;
  $rootScope.loading = false;
  $rootScope.modalData = {};
  $(".button-collapse").sideNav({
    closeOnClick: true
  });
});


/* --- Routing --- */

app.config(function ($stateProvider, $urlRouterProvider) {

  console.log('CONFIG');
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
      data: {}
    })
    .state('Projects.All', {
      project: '/all',
      url: "/all",
      templateUrl: "views/projects/all.html",
      controller: 'ProjectsAllController',
      data: {}
    })
    .state('Projects.Detail', {
      parent: 'Projects',
      url: "/:projectName",
      templateUrl: "views/projects/detail.html",
      controller: 'ProjectsDetailsController',
      data: {}
    });
});