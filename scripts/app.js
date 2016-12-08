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

  $preload.loadAll().then(function (success) {
    console.log("Preload", success);
  }, function (error) {
    console.log("Preload", error);
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