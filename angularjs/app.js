var app = angular.module("Main", ['ngRoute', 'angular-carousel']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            redirectTo: '/projects'
        })
        .when('/information', {
            controller: "InformationController",
            templateUrl: 'html/information.html'
        })
        .when('/projects', {
            controller: "ProjectsController",
            templateUrl: 'html/projects.html'
        })
        .when('/gallery', {
            controller: "GalleryController",
            templateUrl: 'html/gallery.html'
        })
        .when('/projects/:title', {
            controller: "SingleProjectController",
            templateUrl: 'html/projects/singleProject.html'
        })
        .otherwise({
            redirectTo: '/projects'
        });
});