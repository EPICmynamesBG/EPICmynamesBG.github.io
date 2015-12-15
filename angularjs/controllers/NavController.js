app.controller("NavController", function ($scope, $location) {

    $scope.infoClick = function () {
        $location.path("/information");
    };

    $scope.projectClick = function () {
        $location.path("/projects");
    };

    $scope.galleryClick = function () {
        $location.path("/gallery");
    };

    $scope.homeClick = function () {
        $location.path("/");
    };
});