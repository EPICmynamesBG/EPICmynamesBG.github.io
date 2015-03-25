(function(){
    var app = angular.module("Default", ['ngRoute', 'angular-carousel']);
    
    app.config(function($routeProvider, $locationProvider){
        $routeProvider
            .when('/', {
            controller: "DefaultController",
            templateUrl: 'html/main.html'
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
            .when('/projects/:title',{
                controller: "SingleProjectController",
                templateUrl: 'html/projects/singleProject.html'
            })
            .otherwise({
                controller: "DefaultController",
                redirectTo: 'html/main.html'
            });

    });

    
    app.controller('DefaultController', ["$http","$scope","$route","$location",function($http,$scope,$route, $location) {
        $scope.infoClick = function() {
            $location.path("/information");
            $scope.element.addClass('clicked');
        };
        
        $scope.projectClick = function() {
            $location.path("/projects");
            $scope.element.addClass('clicked');
        };
        
        $scope.galleryClick = function() {
            $location.path("/gallery");
            $scope.element.addClass('clicked');
        };
        
        $scope.homeClick = function() {
            $location.path("/");
            $scope.element.addClass('clicked');
        };
    }]);
    
    app.controller("InformationController", ["$http", "$scope", "$route", "$location", InformationController] );
    
    app.controller("ProjectsController", ["$http", "$scope", "$route", "$location", ProjectsController] );
    
    app.controller("GalleryController", ["$http", "$scope", "$route", "$location", GalleryController] );
    
    app.controller("SingleProjectController", ["$http", "$scope", "$route", "$location", SingleProjectController] );
})();