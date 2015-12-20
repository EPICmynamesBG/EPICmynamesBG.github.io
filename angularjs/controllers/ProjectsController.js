app.controller("ProjectsController", function ($scope, $location, $json) {

    $scope.singleProjectClick = function (title) {
        $location.path("/projects/" + title);
    };
	
	$scope.viewOldProjects = function() {
		$location.path("/old-projects/");
	};

    $scope.projects = [];

    $json.loadFile("projects.json")
        .then(function successCallback(response) {
            $scope.projects = response.data;
        }, function errorCallback(response) {
            $json.errorResponse(response);
        });
});